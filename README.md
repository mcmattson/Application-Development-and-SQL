# SETTING UP THE USER MANAGEMENT APPLICATION - FOR WINDOWS USERS

  

### OBTAIN THE APPLICATION/MODIFY SERVER INFO

  

 1. Download and extract the User_Manager.zip folder on to your desktop.
 2. Navigate to the `/src/main/webapp/WEB-INF/classes/db.properties` and change the database information.

  

### COMPILING THE PROJECT USING MAVEN

4. Open cmd from the start menu or search bar

5. Enter `"%MAVEN_HOME%\bin\mvn.cmd" clean install -f "%DOWNLOADFOLDEDLOCATION%\User_Manager\pom.xml"`
*Be sure to change the `%MAVEN_HOME%` to the location of the mvc.cmd and change the `%DOWNLOADFOLDEDLOCATION%` to where ever the folder was extracted to.*

7. The Project will clean the target folder and compile the project. This action will also create the user_management.war file in the “target” folder.

  

### RUNNING THE APPLICATION ON A TOMCAT SERVER

6. Follow the Steps to set up your Tomcat server locally and run the server.

7. Open your Browser to `http://localhost:8080/manager` and identify the “Deploy” section and the subsection “WAR file to deploy” section and select the “Choose File” button.

8. Navigate to the unzipped `User_Manager\target` and select the `user-management.war` file that was created in the previous step and select open.
*This action will deploy the war file to your local server and update the “Applications” list in the section above the “Deploy” section.*

10. Finally navigate to `http://localhost:8080/user-management/` to view the user management application.
