package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.Gson;
import com.example.util.DBConfig;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user-management/addUpdateDeviceUses")
public class UserUsesAddUpdateServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userID = request.getParameter("userID");
        String deviceID = request.getParameter("deviceID");
        String usageDateYear = request.getParameter("usageDateYear");
        String usageDateMonth = request.getParameter("usageDateMonth");
        String usageDateDay = request.getParameter("usageDateDay");
        String usageDuration = request.getParameter("usageDuration");

        // Truncate Usage Date into Database requirements
        String usageDate = usageDateYear + '-' + usageDateMonth + '-' + usageDateDay;

        try {
            Class.forName(DBConfig.getDriver());
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        }

        try (Connection connection = DriverManager.getConnection(DBConfig.getUrl(), DBConfig.getUsername(),
                DBConfig.getPassword())) {

            // First, check if an entry already exists
            String selectSQL = "SELECT UsageDuration FROM Uses WHERE UserID = ? AND DeviceID = ? AND UsageDate = ?";
            try (PreparedStatement checkStmt = connection.prepareStatement(selectSQL)) {
                checkStmt.setString(1, userID);
                checkStmt.setString(2, deviceID);
                checkStmt.setString(3, usageDate);

                ResultSet resultSet = checkStmt.executeQuery();
                if (resultSet.next()) {
                    int existingDuration = resultSet.getInt("UsageDuration");
                    int parsedDuration = Integer.parseInt(usageDuration);

                    // Check if Entry will be less than zero
                    try (PrintWriter out = response.getWriter()) {
                        if (existingDuration + parsedDuration < 0) {
                            out.print(new Gson()
                                    .toJson("Updating duration results in negative total duration, operation aborted."));
                            out.flush();
                            return;
                        } else if (existingDuration + parsedDuration > 1000) {
                            out.print(new Gson()
                                    .toJson("Updating duration results in total duration over the max, operation aborted."));
                            out.flush();
                            return;
                        }

                        // Update the existing record
                        String updateSQL = "UPDATE Uses SET UsageDuration = UsageDuration + ? WHERE UserID = ? AND DeviceID = ? AND UsageDate = ?";
                        try (PreparedStatement updateStmt = connection.prepareStatement(updateSQL)) {
                            updateStmt.setString(1, usageDuration);
                            updateStmt.setString(2, userID);
                            updateStmt.setString(3, deviceID);
                            updateStmt.setString(4, usageDate);
                            updateStmt.executeUpdate();
                            response.getWriter().println(new Gson().toJson("Updated existing usage successfully."));
                        }
                    }
                } else {
                    // Insert a new record if no existing record is found
                    String insertSQL = "INSERT INTO Uses (UserID, DeviceID, UsageDate, UsageDuration) VALUES (?, ?, ?, ?)";
                    try (PreparedStatement insertStmt = connection.prepareStatement(insertSQL)) {
                        insertStmt.setString(1, userID);
                        insertStmt.setString(2, deviceID);
                        insertStmt.setString(3, usageDate);
                        insertStmt.setString(4, usageDuration);
                        insertStmt.executeUpdate();
                        response.getWriter().println(new Gson().toJson("Added new device use successfully."));
                    }
                }
            }
        } catch (SQLException e) {
            log("SQL Error: ", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Database error: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            response.getWriter().println(new Gson().toJson("Error: " + e.getMessage()));
        } catch (Exception e) {
            log("General Error: ", e);
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An unexpected error occurred: " + e.getMessage());
        }
    }
}
