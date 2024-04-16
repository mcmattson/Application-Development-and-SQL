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

@WebServlet("/user-management/addUserUses")
public class UserUsesAddServlet extends HttpServlet {
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

        String usageDate = usageDateYear + usageDateMonth + usageDateDay;

        try {
            Class.forName(DBConfig.getDriver());
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        }

        try (Connection connection = DriverManager.getConnection(DBConfig.getUrl(), DBConfig.getUsername(),
                DBConfig.getPassword());
                PreparedStatement checkExistence = connection.prepareStatement(
                        "SELECT UsageDuration FROM Uses WHERE UserID = ? AND DeviceID = ? AND UsageDate = ?");
                PreparedStatement updateOrInsert = connection.prepareStatement(
                        "INSERT INTO Uses (UserID, DeviceID, UsageDate, UsageDuration) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE UsageDuration = UsageDuration + VALUES(UsageDuration)")) {

            // Check if the entry exists
            checkExistence.setString(1, userID);
            checkExistence.setString(2, deviceID);
            checkExistence.setString(3, usageDate);
            ResultSet rs = checkExistence.executeQuery();

            // Setup the insert or update statement
            updateOrInsert.setString(1, userID);
            updateOrInsert.setString(2, deviceID);
            updateOrInsert.setString(3, usageDate);
            updateOrInsert.setString(4, usageDuration);

            int result = updateOrInsert.executeUpdate();
            try (PrintWriter out = response.getWriter()) {
                if (result > 0) {
                    if (rs.next()) {
                        out.print(new Gson().toJson("Device usage updated successfully."));
                    } else {
                        out.print(new Gson().toJson("Device usage added successfully."));
                    }
                } else {
                    out.print(new Gson().toJson("Failed to add or update device use record."));
                }
                out.flush();
            }
        } catch (SQLException e) {
            log("SQL Error: ", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try (PrintWriter out = response.getWriter()) {
                out.print(new Gson().toJson("An error occurred while processing your request: " + e.getMessage()));
                out.flush();
            }
        }
    }
}
