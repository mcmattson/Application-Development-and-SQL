let searchResultDiv = document.getElementById("searchResult");
let addUserResultDiv = document.getElementById("addUserResult");
let deleteUserResultDiv = document.getElementById("deleteUserResult");
let updateUserResultDiv = document.getElementById("updateUserResult");
let addUpdateDeviceUsesResultsDiv = document.getElementById(
  "addUpdateDeviceUsesResults"
);
let currentPage = 1;

function searchUsers(page = 1) {
  let searchInput = document.getElementById("searchInput").value.trim();
  let userID = document.getElementById("userID").value.trim();
  let startDate = document.getElementById("startDate").value.trim();
  let endDate = document.getElementById("endDate").value.trim();

  clearAllResults();

  let url = "/user-management/search?userName=" + searchInput;
  if (userID) {
    url += "&userID=" + userID;
  }
  if (startDate || endDate) {
    if (startDate && endDate == "") {
      url += "&startDate=" + startDate + "&endDate=" + "3000-01-01";
    } else if (startDate == "" && endDate) {
      url += "&startDate=" + "1900-01-01" + "&endDate=" + endDate;
    } else {
      return;
    }
  }
  url += "&page=" + page;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        displaySearchResult([], "ERROR: Network error occurred");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      currentPage = page;
      displaySearchResult(data);
      createPaginationControls(data.length < 25);
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
    return;
  }

  if (data.length === 0) {
    searchResultDiv.textContent = "No Users or Device Uses found.";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  searchResultDiv.appendChild(table);

  const headerRow = document.createElement("tr");
  const headers = [
    "User ID",
    "User Name",
    "User Type",
    "Device Name",
    "Usage Date",
    "Usage Duration",
  ];
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  thead.appendChild(headerRow);

  data.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.userName}</td>
            <td>${user.userType}</td>
            <td>${user.deviceName}</td>
            <td>${user.usageDate}</td>
            <td>${user.usageDuration} minute(s)</td>
        `;
    tbody.appendChild(row);
  });
}

// ---------//
function addUser() {
  let newUserID = document.getElementById("newUserID").value.trim();
  let newUserName = document.getElementById("newUserName").value.trim();
  let newUserType = document.getElementById("newUserType").value.trim();

  clearAllResults();

  if (!newUserID) {
    displayAddUserResult("Please Enter the User ID.");
    return;
  }

  if (!newUserName) {
    displayAddUserResult("Please Enter the User Name.");
    return;
  }

  if (!newUserType) {
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
  let oldUserID = document.getElementById("oldUserID").value.trim();
  let updateUserName = document.getElementById("updateUserName").value.trim();
  let updateUserType = document.getElementById("updateUserType").value.trim();

  clearAllResults();
  if (!oldUserID) {
    displayUpdateUserResult("Please Enter the User ID.");
    return;
  }

  if (!updateUserName) {
    displayUpdateUserResult("Please Enter the User Name.");
    return;
  }

  if (!updateUserType) {
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
  let deleteUserID = document.getElementById("deleteUserID").value.trim();
  if (!deleteUserID) {
    displayDeleteResult("Please Enter the User ID.");
    return;
  }

  let modal = document.getElementById("deleteConfirmationModal");
  modal.style.display = "block";
  let cancelBtn = document.getElementById("cancelDelete");
  let confirmBtn = document.getElementById("confirmDelete");

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
  let userUpdateID = document.getElementById("userUpdateID").value.trim();
  let deviceID = document.getElementById("deviceID").value.trim();
  let usageDate = document.getElementById("usageDate").value.trim();
  let usageDuration = document.getElementById("usageDuration").value.trim();

  clearAllResults();

  if (!userUpdateID) {
    displayUsesResult("Please Enter the User ID.");
    return;
  }

  if (!deviceID) {
    displayUsesResult("Please Enter the Device ID.");
    return;
  }

  if (!usageDate) {
    displayUsesResult("Please enter Date.");
    return;
  }

  if (!usageDuration) {
    displayUsesResult("Please enter Duration in Minutes.");
    return;
  }

  fetch(
    `/user-management/addUpdateDeviceUses?userUpdateID=${userUpdateID}&deviceID=${deviceID}&usageDate=${usageDate}&usageDuration=${usageDuration}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userUpdateID: userUpdateID,
        deviceID: deviceID,
        usageDate: usageDate,
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

function createPaginationControls(isLastPage) {
  const paginationDiv =
    document.getElementById("paginationControls") ||
    document.createElement("div");
  paginationDiv.id = "paginationControls";
  paginationDiv.innerHTML = "";

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.classList.add("pagination-prev");
    prevButton.onclick = () => {
      searchResultDiv.innerHTML = "";
      searchUsers(currentPage - 1);
    };
    paginationDiv.appendChild(prevButton);
  }

  if (!isLastPage) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("pagination-next");
    nextButton.onclick = () => {
      searchResultDiv.innerHTML = "";
      searchUsers(currentPage + 1);
    };
    paginationDiv.appendChild(nextButton);
  }

  searchResultDiv.appendChild(paginationDiv);
}

function clearAllResults() {
  searchResultDiv.innerHTML = ""; // Clear search results
  const paginationDiv = document.getElementById("paginationControls");
  if (paginationDiv) {
    paginationDiv.innerHTML = ""; // Clear pagination controls
  }

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
  const { body } = document;
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
