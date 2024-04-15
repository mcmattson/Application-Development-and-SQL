var searchResultDiv = document.getElementById("searchResult");
var addUserResultDiv = document.getElementById("addUserResult");
var deleteUserResultDiv = document.getElementById("deleteUserResult");
var updateUserResultDiv = document.getElementById("updateUserResult");

function searchUsers() {
  var searchInput = document.getElementById("searchInput").value.trim();
  if (searchInput === "") {
    alert("Please enter a user name to search.");
    return;
  }

  fetch("/user-management/search?userName=" + searchInput)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displaySearchResult(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displaySearchResult(data) {
  searchResultDiv.innerHTML = "";
  addUserResultDiv.innerHTML = "";
  updateUserResultDiv.innerHTML = "";
  deleteUserResultDiv.innerHTML = "";

  if (data.length === 0) {
    searchResultDiv.textContent = "No users found.";
  } else {
    searchResultDiv.style.display = "block";
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

  if (newUserID === "") {
    alert("Please enter a user ID to add.");
    return;
  }

  if (newUserName === "") {
    alert("Please enter a user name to add.");
    return;
  }

  if (newUserType === "") {
    alert("Please enter Administrator, Visitor, or Regular for User Type.");
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
    .then((response) => response.json())
    .then((data) => {
      displayAddUserResult(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displayAddUserResult(message) {
  // Clear all result divs to ensure no old messages are displayed
  clearAllResults();
  if (message) {
    addUserResultDiv.textContent = message;
    addUserResultDiv.style.display = "block"; // Show only if there is a message
  } else {
    addUserResultDiv.style.display = "none"; // Hide if no message
  }
}

// ---------//
function updateUser() {
  var oldUserID = document.getElementById("oldUserID").value.trim();
  var updateUserName = document.getElementById("updateUserName").value.trim();
  var updateUserType = document.getElementById("updateUserType").value.trim();

  if (oldUserID === "") {
    alert("Please enter the user ID to update.");
    return;
  }

  if (updateUserName === "") {
    alert("Please enter a user name to update.");
    return;
  }

  if (updateUserType === "") {
    alert("Please enter Administrator, Visitor, or Regular for User Type.");
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
    .then((response) => response.json())
    .then((data) => {
      displayUpdateUserResult(data);
    })
    .catch((error) => console.error("Error:", error));
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
  if (deleteUserID === "") {
    alert("Please enter a user ID to delete.");
    return;
  }

  fetch(`/user-management/deleteUser?userID=${deleteUserID}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      displayDeleteResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      displayDeleteResult("Network error occurred");
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

function clearAllResults() {
  const resultDivs = [
    searchResultDiv,
    addUserResultDiv,
    updateUserResultDiv,
    deleteUserResultDiv,
  ];
  resultDivs.forEach((div) => {
    div.innerHTML = "";
    div.style.display = "none"; // Hide all result divs initially
  });
}
