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

function displaySearchResult(users) {
  var searchResultDiv = document.getElementById("searchResult");
  searchResultDiv.innerHTML = "";

  if (users.length === 0) {
    searchResultDiv.textContent = "No users found.";
  } else {
    var userList = document.createElement("ul");
    users.forEach((user) => {
      var listItem = document.createElement("li");
      listItem.textContent = user.userName + " - " + user.userType; // Update property names according to the backend
      userList.appendChild(listItem);
    });
    searchResultDiv.appendChild(userList);
  }
}
// ---------//
function addUser() {
  var newUserID = document.getElementById("newUserID").value.trim();
  if (newUserID === "") {
    alert("Please enter a user ID to add.");
    return;
  }

  var newUserName = document.getElementById("newUserName").value.trim();
  if (newUserName === "") {
    alert("Please enter a user name to add.");
    return;
  }

  var newUserType = document.getElementById("newUserType").value.trim();
  if (newUserType === "") {
    alert("Please enter Administrator, Visitor, or Regular for User Type.");
    return;
  }

  fetch(
    `/user-management/addUser?userID=${newUserID}&userName=${newUserName}&userType=${newUserType}`,
    {
      method: "POST",
    }
  )
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

function displayAddUserResult(data) {
  var addUserResultDiv = document.getElementById("addUserResult");
  addUserResultDiv.innerHTML = ""; // Clear previous results

  // Since response is a plain message
  addUserResultDiv.textContent = data;
}

// ---------//
function updateUser() {
  var oldUserID = document.getElementById("oldUserID").value.trim();
  if (oldUserID === "") {
    alert("Please enter a old user ID to update.");
    return;
  }

  var updateUserName = document.getElementById("updateUserName").value.trim();
  if (updateUserName === "") {
    alert("Please enter a user name to update.");
    return;
  }

  var updateUserType = document.getElementById("updateUserType").value.trim();
  if (updateUserType === "") {
    alert("Please enter a user type to update.");
    return;
  }

  fetch(
    `/user-management/updateUser?oldUserID=${oldUserID}?updateUserName=${updateUserName}?updateUserType=${updateUserType}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayUpdateResult(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displayUpdateResult(users) {
  var updateUserResultDiv = document.getElementById("updateUserResult");
  updateUserResultDiv.innerHTML = "";

  updateUserResultDiv.innerHTML = ""; // Clear previous results

  // Since response is a plain message
  updateUserResultDiv.textContent = data;
}
// ----- //
function deleteUser() {
  var deleteUserID = document.getElementById("deleteUserID").value.trim();
  if (deleteUserID === "") {
    alert("Please enter a user name to delete.");
    return;
  }

  fetch("/user-management/deleteUser?userID=" + deleteUserID)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayDeleteResult(data);
    })
    .catch((error) => console.error("Error:", error));
}

function displayDeleteResult(users) {
  var deleteUserResultDiv = document.getElementById("deleteUserResult");
  deleteUserResultDiv.innerHTML = "";

  // Since response is a plain message
  deleteUserResultDiv.textContent = data;
}
