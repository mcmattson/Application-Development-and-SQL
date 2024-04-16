package com.example.util;

import java.io.InputStream;
import java.util.Properties;

public class DBConfig {
    private static Properties properties = new Properties();

    static {
        try (InputStream input = DBConfig.class.getClassLoader().getResourceAsStream("db.properties")) {
            properties.load(input);
        } catch (Exception e) {
            throw new RuntimeException("Error loading database properties", e);
        }
    }

    public static String getUrl() {
        return properties.getProperty("jdbc.url");
    }

    public static String getUsername() {
        return properties.getProperty("jdbc.username");
    }

    public static String getPassword() {
        return properties.getProperty("jdbc.password");
    }

    public static String getDriver() {
        return properties.getProperty("jdbc.driver");
    }
}
