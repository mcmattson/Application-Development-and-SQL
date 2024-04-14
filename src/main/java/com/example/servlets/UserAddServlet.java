package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user-management/addUser")
public class UserAddServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    // JDBC URL, username, and password
    private static final String JDBC_URL = "jdbc:mysql://faure.cs.colostate.edu:3306/mmattson";
    private static final String JDBC_USERNAME = "mmattson";
    private static final String JDBC_PASSWORD = "829587718";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        String userName = request.getParameter("userName");
        String userID = request.getParameter("userID");
        String newUserType = request.getParameter("newUserType");
        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD);

            // Check if user exists
            String sql = "SELECT * FROM Users WHERE UserName LIKE ? OR UserID = ?";
            statement = connection.prepareStatement(sql);
            statement.setString(1, userID);
            statement.setString(2, userName);

            resultSet = statement.executeQuery();

            if (resultSet.next()) {
                out.print(new Gson().toJson("User already exists in the database."));
            } else {
                // Add user to the database
                sql = "INSERT INTO Users (UserID, UserName, UserType) VALUES (?, ?, ?)";
                statement = connection.prepareStatement(sql);
                statement.setString(1, userID);
                statement.setString(2, userName);
                statement.setString(3, newUserType);
                int result = statement.executeUpdate();

                if (result > 0) {
                    out.print(new Gson().toJson("User added successfully."));
                } else {
                    out.print(new Gson().toJson("Failed to add user."));
                }
            }
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occurred while processing your request.");
        } finally {
            // Close resources
            try {
                if (resultSet != null)
                    resultSet.close();
                if (statement != null)
                    statement.close();
                if (connection != null)
                    connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        out.flush();
    }
}
