var searchResultDiv = document.getElementById("searchResult");
var addUserResultDiv = document.getElementById("addUserResult");
var deleteUserResultDiv = document.getElementById("deleteUserResult");
var updateUserResultDiv = document.getElementById("updateUserResult");
var addUpdateDeviceUsesResultsDiv = document.getElementById(
  "addUpdateDeviceUsesResults"
);

function searchUsers() {
  var searchInput = document.getElementById("searchInput").value.trim();
  var userID = document.getElementById("userID").value.trim(); // Assume you have an input with ID 'userID'
  var startDate = document.getElementById("startDate").value.trim(); // Assume you have an input with ID 'startDate'
  var endDate = document.getElementById("endDate").value.trim(); // Assume you have an input with ID 'endDate'

  clearAllResults();

  // Construct the URL with query parameters for user name, user ID, and date range
  var url = "/user-management/search?userName=" + searchInput;
  if (userID) {
    url += "&userID=" + userID;
  }
  if (startDate && endDate) {
    url += "&startDate=" + startDate + "&endDate=" + endDate;
  }

  // Use the constructed URL to perform the search
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        displaySearchResult([], "ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displaySearchResult(data);
    })
    .catch((error) => {
      console.error(error);
      displaySearchResult([], "ERROR: An error occurred while fetching data");
    });
}

function displaySearchResult(data, message = "") {
  clearAllResults();
  searchResultDiv.style.display = "block";
  if (message) {
    searchResultDiv.textContent = message;
  } else if (data.length === 0) {
    searchResultDiv.textContent = "No users found.";
  } else {
    var userList = document.createElement("ul");
    data.forEach((user) => {
      var listItem = document.createElement("li");
      listItem.textContent = user.userName + " - " + user.userType;
      userList.appendChild(listItem);
    });
    searchResultDiv.appendChild(userList);
  }
}

// ... [rest of the existing app.js functions]

// ---------//
function addUser() {
  var newUserID = document.getElementById("newUserID").value.trim();
  var newUserName = document.getElementById("newUserName").value.trim();
  var newUserType = document.getElementById("newUserType").value.trim();

  clearAllResults();

  if (newUserID === "") {
    displayAddUserResult("Please Enter the User ID.");
    return;
  }

  if (newUserName === "") {
    displayAddUserResult("Please Enter the User Name.");
    return;
  }

  if (newUserType === "") {
    displayAddUserResult(
      "Please enter Administrator, Visitor, or Regular for User Type."
    );
    return;
  }

  fetch(
    `/user-management/addUser?userID=${newUserID}&userName=${newUserName}&userType=${newUserType}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: newUserID,
        userName: newUserName,
        userType: newUserType,
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        displayAddUserResult("ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayAddUserResult(data);
    })
    .catch((error) => console.error(error));
}

function displayAddUserResult(message) {
  clearAllResults();
  if (message) {
    addUserResultDiv.textContent = message;
    addUserResultDiv.style.display = "block";
  } else {
    addUserResultDiv.style.display = "none";
  }
}

// ---------//
function updateUser() {
  var oldUserID = document.getElementById("oldUserID").value.trim();
  var updateUserName = document.getElementById("updateUserName").value.trim();
  var updateUserType = document.getElementById("updateUserType").value.trim();

  clearAllResults();
  if (oldUserID === "") {
    displayUpdateUserResult("Please Enter the User ID.");
    return;
  }

  if (updateUserName === "") {
    displayUpdateUserResult("Please Enter the User Name.");
    return;
  }

  if (updateUserType === "") {
    displayUpdateUserResult(
      "Please enter Administrator, Visitor, or Regular for User Type."
    );
    return;
  }

  fetch(
    `/user-management/updateUser?oldUserID=${oldUserID}&updateUserName=${updateUserName}&updateUserType=${updateUserType}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldUserID: oldUserID,
        updateUserName: updateUserName,
        updateUserType: updateUserType,
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        displayUpdateUserResult("ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayUpdateUserResult(data);
    })
    .catch((error) => console.error(error));
}

function displayUpdateUserResult(message) {
  clearAllResults();
  if (message) {
    updateUserResultDiv.textContent = message;
    updateUserResultDiv.style.display = "block";
  } else {
    updateUserResultDiv.style.display = "none";
  }
}

// ----- //
function deleteUser() {
  var deleteUserID = document.getElementById("deleteUserID").value.trim();
  if (!deleteUserID) {
    displayDeleteResult("Please Enter the User ID.");
    return;
  }

  var modal = document.getElementById("deleteConfirmationModal");
  modal.style.display = "block";
  var cancelBtn = document.getElementById("cancelDelete");
  var confirmBtn = document.getElementById("confirmDelete");

  cancelBtn.onclick = function () {
    modal.style.display = "none";
    displayDeleteResult("Deletion cancelled.");
  };

  confirmBtn.onclick = function () {
    modal.style.display = "none";
    proceedToDelete(deleteUserID);
  };
}

function proceedToDelete(deleteUserID) {
  fetch(`/user-management/deleteUser?userID=${deleteUserID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayDeleteResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayDeleteResult("Network error occurred: " + error.message);
    });
}

function displayDeleteResult(message) {
  clearAllResults();
  if (message) {
    deleteUserResultDiv.textContent = message;
    deleteUserResultDiv.style.display = "block";
  } else {
    deleteUserResultDiv.style.display = "none";
  }
}

function addUpdateDeviceUses() {
  var userID = document.getElementById("userID").value.trim();
  var deviceID = document.getElementById("deviceID").value.trim();
  var usageDateYear = document.getElementById("usageDateYear").value.trim();
  var usageDateMonth = document.getElementById("usageDateMonth").value.trim();
  var usageDateDay = document.getElementById("usageDateDay").value.trim();
  var usageDuration = document.getElementById("usageDuration").value.trim();

  clearAllResults();

  if (userID === "") {
    displayUsesResult("Please Enter the User ID.");
    return;
  }

  if (deviceID === "") {
    displayUsesResult("Please Enter the Device ID.");
    return;
  }

  if (usageDateYear === "") {
    displayUsesResult("Please enter Date Year (yyyy).");
    return;
  }

  if (usageDateMonth === "") {
    displayUsesResult("Please enter Date Month (mm).");
    return;
  }

  if (usageDateDay === "") {
    displayUsesResult("Please enter Date Day (dd).");
    return;
  }

  if (usageDuration === "") {
    displayUsesResult("Please enter Duration in Minutes.");
    return;
  }

  fetch(
    `/user-management/addUpdateDeviceUses?userID=${userID}&deviceID=${deviceID}&usageDateYear=${usageDateYear}&usageDateMonth=${usageDateMonth}&usageDateDay=${usageDateDay}&usageDuration=${usageDuration}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: userID,
        deviceID: deviceID,
        usageDateYear: usageDateYear,
        usageDateMonth: usageDateMonth,
        usageDateDay: usageDateDay,
        usageDuration: usageDuration,
      }),
    }
  )
    .then((response) => {
      if (!response.ok) {
        displayUsesResult("ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayUsesResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayUsesResult("Network error occurred: " + error.message);
    });
}

function displayUsesResult(message) {
  clearAllResults();
  if (message) {
    addUpdateDeviceUsesResultsDiv.textContent = message;
    addUpdateDeviceUsesResultsDiv.style.display = "block";
  } else {
    addUpdateDeviceUsesResultsDiv.style.display = "none";
  }
}

function clearAllResults() {
  const resultDivs = [
    searchResultDiv,
    addUserResultDiv,
    updateUserResultDiv,
    deleteUserResultDiv,
    addUpdateDeviceUsesResultsDiv,
  ];
  resultDivs.forEach((div) => {
    div.innerHTML = "";
    div.style.display = "none";
  });
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
}

function applyInitialTheme() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
  }
}

document.addEventListener("DOMContentLoaded", applyInitialTheme);

function displayMessage(elementId, message) {
  const element = document.getElementById(elementId);
  element.innerHTML = "";
  if (message) {
    element.textContent = message;
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
