# SETTING UP THE USER MANAGEMENT APPLICATION - FOR WINDOWS USERS

## OBTAIN THE APPLICATION/MODIFY SERVER INFO  

1.	Download and extract the User_Manager.zip folder on to your desktop.  
2.	Navigate to the /src/main/webapp/WEB-INF/classes/db.properties  
a.	insert the database, username, password to the required database connection information.  

## COMPILING THE PROJECT USING MAVEN
4.	Open cmd  
5.	Enter "%MAVEN_HOME%\bin\mvn.cmd" clean install -f "%DOWNLOADFOLDER%\User_Manager\pom.xml"  
a.	Be sure to change the %MAVEN_HOME% to the location of the mvc.cmd  
b.	Be sure to change the %DOWNLOADFOLDER% to where ever the folder was extracted to.  
6.	The Project will clean the target folder and compile the project.  
a.This action will also create the user_management.war file in the “target” folder. 

## RUNNING THE APPLICATION ON A TOMCAT SERVER
6.	Follow the Steps to set up your Tomcat server locally and run the server.  
7.	Open your Browser to http://localhost:8080/manager and identify the “Deploy” section and the subsection “WAR file to deploy” section and select the “Choose File” button.  
8.	Navigate to the unzipped User_Manager\target and select the “user-management.war” file that was created in the previous step and select open.  
a.  This action will deploy the war file to your local server and update the “Applications” list in the section above the “Deploy” section.  
9.	Finally navigate to http://localhost:8080/user-management/ to view the user management application.  
