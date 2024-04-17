package com.example.model;

public class Uses extends User {

    private String deviceName;
    private String usageDate; // Changed to String for simplicity
    private int usageDuration;

    public Uses(int userId, String userName, String userType, String deviceName, String usageDate, int usageDuration) {
        super(userId, userName, userType);
        this.deviceName = deviceName;
        this.usageDate = usageDate;
        this.usageDuration = usageDuration;
    }

    // Getters and Setters for the new fields

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getUsageDate() {
        return usageDate;
    }

    public void setUsageDate(String usageDate) {
        this.usageDate = usageDate;
    }

    public int getUsageDuration() {
        return usageDuration;
    }

    public void setUsageDuration(int usageDuration) {
        this.usageDuration = usageDuration;
    }
}