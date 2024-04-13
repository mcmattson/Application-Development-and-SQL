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

import com.example.model.User;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/WebAssignment/search")
public class UserSearchServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // JDBC URL, username, and password
    private static final String JDBC_URL = "jdbc:mysql://faure.cs.colostate.edu:3306/mmattson/mmattson";
    private static final String JDBC_USERNAME = "mmattson";
    private static final String JDBC_PASSWORD = "829587718";

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String userName = request.getParameter("userName");
        List<User> searchResult = new ArrayList<>();
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        }

        try {
            // Establish database connection
            connection = DriverManager.getConnection(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD);

            // Prepare SQL statement
            String sql = "SELECT * FROM Users WHERE UserName LIKE ?";
            statement = connection.prepareStatement(sql);
            statement.setString(1, "%" + userName + "%");

            // Execute query
            resultSet = statement.executeQuery();

            // Process result set
            while (resultSet.next()) {
                int userId = resultSet.getInt("UserID");
                String name = resultSet.getString("UserName");
                String userType = resultSet.getString("UserType");
                System.out.println(" Student ID: " + userId + "\n Student Name: " + name + "\n Dept Name: "
                        + userType);
                // Create User object and add to search result
                User user = new User(userId, name, userType);
                searchResult.add(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occurred while processing your request.");

        } finally {
            // Close resources
            try {
                if (resultSet != null)
                    resultSet.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                if (statement != null)
                    statement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
            try {
                if (connection != null)
                    connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // Convert searchResult to JSON and send as response
        Gson gson = new Gson();
        String jsonResult = gson.toJson(searchResult);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        out.print(jsonResult);
        out.flush();
    }
}
