var searchResultDiv = document.getElementById("searchResult");
var addUserResultDiv = document.getElementById("addUserResult");
var deleteUserResultDiv = document.getElementById("deleteUserResult");
var updateUserResultDiv = document.getElementById("updateUserResult");
var addUsesResultDiv = document.getElementById("addUsesResult");

function searchUsers() {
  var searchInput = document.getElementById("searchInput").value.trim();

  clearAllResults();
  if (searchInput === "") {
    displaySearchResult([], "Please Enter the User Name to Search for.");
    return;
  }

  fetch("/user-management/search?userName=" + searchInput)
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
    .catch((error) => console.error(error));
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

function addUserUses() {
  var userID = document.getElementById("userID").value.trim();
  var deviceID = document.getElementById("deviceID").value.trim();
  var usageDateYear = document.getElementById("usageDateYear").value.trim();
  var usageDateMonth = document.getElementById("usageDateMonth").value.trim();
  var usageDateDay = document.getElementById("usageDateDay").value.trim();
  var usageDuration = document.getElementById("usageDuration").value.trim();

  clearAllResults();

  if (userID === "") {
    displayAddUsesResult("Please Enter the User ID.");
    return;
  }

  if (deviceID === "") {
    displayAddUsesResult("Please Enter the Device ID.");
    return;
  }

  if (usageDateYear === "") {
    displayAddUsesResult("Please enter Date Year (yyyy).");
    return;
  }

  if (usageDateMonth === "") {
    displayAddUsesResult("Please enter Date Month (mm).");
    return;
  }

  if (usageDateDay === "") {
    displayAddUsesResult("Please enter Date Day (dd).");
    return;
  }

  if (usageDuration === "") {
    displayAddUsesResult("Please enter Duration in Minutes.");
    return;
  }

  fetch(
    `/user-management/addUserUses?userID=${userID}&deviceID=${deviceID}&usageDateYear=${usageDateYear}&usageDateMonth=${usageDateMonth}&usageDateDay=${usageDateDay}&usageDuration=${usageDuration}`,
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
        displayAddUsesResult("ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayAddUsesResult(data);
    })
    .catch((error) => console.error(error));
}

function displayAddUsesResult(message) {
  clearAllResults();
  if (message) {
    addUsesResultDiv.textContent = message;
    addUsesResultDiv.style.display = "block";
  } else {
    addUsesResultDiv.style.display = "none";
  }
}

function clearAllResults() {
  const resultDivs = [
    searchResultDiv,
    addUserResultDiv,
    updateUserResultDiv,
    deleteUserResultDiv,
    addUsesResultDiv,
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
