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

        try (Connection connection = DriverManager.getConnection(DBConfig.getUrl(), DBConfig.getUsername(),
                DBConfig.getPassword());
                PreparedStatement statement = connection.prepareStatement("DELETE FROM Users WHERE UserID = ?")) {

            statement.setString(1, userID);
            int result = statement.executeUpdate();

            PrintWriter out = response.getWriter();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            if (result > 0) {
                out.print(new Gson().toJson("SUCCESS: User " + userID + " has been deleted."));
            } else {
                out.print(new Gson().toJson("ERROR: No user found with provided ID: " + userID + "."));
            }
            out.flush();
        } catch (SQLException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "An error occurred while processing your request: " + e.getMessage());
        }
    }
}
