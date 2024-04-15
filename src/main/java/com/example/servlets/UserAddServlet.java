package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
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

    private static final String JDBC_URL = "jdbc:mysql://faure.cs.colostate.edu:3306/mmattson";
    private static final String JDBC_USERNAME = "mmattson";
    private static final String JDBC_PASSWORD = "829587718";

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userName = request.getParameter("userName");
        String userID = request.getParameter("userID");
        String userType = request.getParameter("userType");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        }

        try (Connection connection = DriverManager.getConnection(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD);
                PreparedStatement statement = connection
                        .prepareStatement("INSERT INTO Users (UserID, UserName, UserType) VALUES (?, ?, ?)")) {

            statement.setString(1, userID);
            statement.setString(2, userName);
            statement.setString(3, userType);

            int result = statement.executeUpdate();
            try (PrintWriter out = response.getWriter()) {
                if (result > 0) {
                    out.print(new Gson().toJson("User added successfully."));
                } else {
                    out.print(new Gson().toJson("Failed to add user."));
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
        } catch (Exception e) {
            log("General Error: ", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            try (PrintWriter out = response.getWriter()) {
                out.print(new Gson().toJson("An unexpected error occurred: " + e.getMessage()));
                out.flush();
            }
        }
    }
}
