package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.example.model.Uses;
import com.google.gson.Gson;
import com.example.util.DBConfig;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user-management/search")
public class UserSearchServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userName = request.getParameter("userName");
        String userID = request.getParameter("userID");
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");
        List<Uses> searchResult = new ArrayList<>();
        SimpleDateFormat dbDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat formattedDate = new SimpleDateFormat("MM/dd/yyyy");

        try {
            Class.forName(DBConfig.getDriver());
            try (Connection connection = DriverManager.getConnection(DBConfig.getUrl(), DBConfig.getUsername(),
                    DBConfig.getPassword())) {

                String sql = "SELECT u.UserID, u.UserName, u.UserType, d.DeviceName, us.UsageDate, us.UsageDuration " +
                        "FROM Users u " +
                        "LEFT JOIN Uses us ON u.UserID = us.UserID " +
                        "LEFT JOIN Devices d ON us.DeviceID = d.DeviceID " +
                        "WHERE u.UserName LIKE ? ";

                if (userID != null && !userID.trim().isEmpty()) {
                    sql += "AND u.UserID = ?";
                }

                if (startDate != null && endDate != null &&
                        !startDate.trim().isEmpty() && !endDate.trim().isEmpty()) {
                    sql += "AND us.UsageDate BETWEEN ? AND ?";
                }

                try (PreparedStatement statement = connection.prepareStatement(sql)) {
                    statement.setString(1, "%" + userName + "%");

                    int paramIndex = 2;

                    if (userID != null && !userID.trim().isEmpty()) {
                        statement.setString(paramIndex++, userID);
                    }

                    if (startDate != null && endDate != null &&
                            !startDate.trim().isEmpty() && !endDate.trim().isEmpty()) {
                        statement.setString(paramIndex++, startDate);
                        statement.setString(paramIndex++, endDate);
                    }

                    try (ResultSet resultSet = statement.executeQuery()) {
                        while (resultSet.next()) {
                            int userId = resultSet.getInt("UserID");
                            String name = resultSet.getString("UserName");
                            String userType = resultSet.getString("UserType");
                            String deviceName = resultSet.getString("DeviceName");
                            Date usageDate = dbDateFormat.parse(resultSet.getString("UsageDate"));
                            int usageDuration = resultSet.getInt("UsageDuration");
                            searchResult.add(
                                    new Uses(userId, name, userType, deviceName,
                                            formattedDate.format(usageDate), usageDuration));
                        }
                    }
                }
            }
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occurred while processing your request.");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occurred while formatting dates.");
        }

        Gson gson = new Gson();
        String jsonResult = gson.toJson(searchResult);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(jsonResult);
            out.flush();
        }
    }
}