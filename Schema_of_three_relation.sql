-- Create the Users table
CREATE TABLE Users (
    UserID INT PRIMARY KEY,
    UserName VARCHAR(50) NOT NULL,
    UserType VARCHAR(20) NOT NULL
);

-- Create the Devices table
CREATE TABLE Devices (
    DeviceID INT PRIMARY KEY,
    DeviceName VARCHAR(50) NOT NULL,
    DeviceType VARCHAR(20) NOT NULL
);

-- Create the Uses table
CREATE TABLE Uses (
    UserID INT NOT NULL,
    DeviceID INT NOT NULL,
    UsageDate DATE NOT NULL,
    UsageDuration INT NOT NULL, -- Assuming duration is in minutes
    PRIMARY KEY (UserID, DeviceID, UsageDate),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (DeviceID) REFERENCES Devices(DeviceID)
);