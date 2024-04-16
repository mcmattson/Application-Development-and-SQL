package com.example.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import com.google.gson.Gson;
import com.example.util.DBConfig;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user-management/deleteUser")
public class UserDeleteServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String userID = request.getParameter("userID");

        try {
            Class.forName(DBConfig.getDriver());
        } catch (ClassNotFoundException e) {
            System.err.println("Driver Error");
            e.printStackTrace();
        }

        Connection connection = null;
        try {
            connection = DriverManager.getConnection(DBConfig.getUrl(), DBConfig.getUsername(),
                    DBConfig.getPassword());
            connection.setAutoCommit(false); // Start transaction

            // First, delete user's usage records
            try (PreparedStatement usesStmt = connection.prepareStatement("DELETE FROM Uses WHERE UserID = ?")) {
                usesStmt.setString(1, userID);
                usesStmt.executeUpdate();
            }

            // Then, delete the user
            try (PreparedStatement usersStmt = connection.prepareStatement("DELETE FROM Users WHERE UserID = ?")) {
                usersStmt.setString(1, userID);
                int result = usersStmt.executeUpdate();
                PrintWriter out = response.getWriter();
                if (result > 0) {
                    connection.commit(); 
                    out.print(new Gson()
                            .toJson("SUCCESS: User and associated uses for UserID " + userID + " have been deleted."));
                } else {
                    connection.rollback();
                    out.print(new Gson().toJson("ERROR: No user found with provided ID: " + userID + "."));
                }
                out.flush();
            }

        } catch (SQLException e) {
            if (connection != null) {
                try {
                    connection.rollback();
                } catch (SQLException se) {
                    se.printStackTrace();
                }
            }
            PrintWriter out = response.getWriter();
            out.print(new Gson().toJson("An error occurred while processing your request: " + e.getMessage()));
            out.flush();
            e.printStackTrace();
        } finally {
            if (connection != null) {
                try {
                    connection.setAutoCommit(true);
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}