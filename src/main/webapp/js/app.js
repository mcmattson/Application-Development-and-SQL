let searchResultDiv = document.getElementById("searchResult");
let addUserResultDiv = document.getElementById("addUserResult");
let deleteUserResultDiv = document.getElementById("deleteUserResult");
let updateUserResultDiv = document.getElementById("updateUserResult");
let addUpdateDeviceUsesResultsDiv = document.getElementById(
  "addUpdateDeviceUsesResults"
);
let currentPage = 1;

/**
 * Searches for users based on input criteria and pagination, displaying results and pagination controls.
 * Retrieves user search input, filters by user ID, start and end dates, fetches data from the server, and handles pagination.
 * @function
 * @param {number} [page=1] - The page number for pagination, defaults to the first page.
 */
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

/**
 * Displays search results in a formatted table based on the provided data or message.
 * Clears existing results, displays a message if provided, or populates a table with user and device usage data.
 * @function
 * @param {Array} data - The array of objects containing user and device usage data.
 * @param {string} [message=""] - Optional message to display if no data is provided.
 */
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

/**
 * Adds a new user after validating inputs and making a POST request to the server.
 * Validates user ID, user name, and user type before sending a POST request to add a new user.
 * @function
 */
function addUser() {
  let newUserID = document.getElementById("newUserID").value.trim();
  let newUserName = document.getElementById("newUserName").value.trim();
  let newUserType = document.getElementById("newUserType").value.trim();

  clearAllResults();

  if (!newUserID || !Number.isInteger(Number(newUserID))) {
    displayAddUserResult("Please Enter a valid User ID.");
    return;
  }

  if (!newUserName) {
    displayAddUserResult("Please Enter the User Name.");
    return;
  }

  const allowedTypes = ["Administrator", "Visitor", "Regular"];
  if (!allowedTypes.includes(newUserType)) {
    displayAddUserResult(
      "Please enter a valid User Type: Administrator, Visitor, or Regular."
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
        displayAddUserResult("ERROR: User Already Exists.");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayAddUserResult(data);
    })
    .catch((error) => console.error(error));
}

/**
 * Displays the result message for adding a user, showing or hiding the message based on input.
 * Clears existing results, sets the message content, and adjusts the display style of the result div.
 * @function
 * @param {string} message - The message to display for the result of adding a user.
 */
function displayAddUserResult(message) {
  clearAllResults();
  if (message) {
    addUserResultDiv.textContent = message;
    addUserResultDiv.style.display = "block";
  } else {
    addUserResultDiv.style.display = "none";
  }
}

/**
 * Updates user information after validating inputs and making a PUT request to the server.
 * Validates user ID, user name, and user type before sending a PUT request to update user details.
 * @function
 */
function updateUser() {
  let oldUserID = document.getElementById("oldUserID").value.trim();
  let updateUserName = document.getElementById("updateUserName").value.trim();
  let updateUserType = document.getElementById("updateUserType").value.trim();

  clearAllResults();
  if (!oldUserID || !Number.isInteger(Number(oldUserID))) {
    displayUpdateUserResult("Please Enter a valid User ID.");
    return;
  }

  if (!updateUserName) {
    displayUpdateUserResult("Please Enter the User Name.");
    return;
  }

  const allowedTypes = ["Administrator", "Visitor", "Regular"];
  if (!allowedTypes.includes(updateUserType)) {
    displayUpdateUserResult(
      "Please enter a valid User Type: Administrator, Visitor, or Regular."
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

/**
 * Displays the result message for updating a user, showing or hiding the message based on input.
 * Clears existing results, sets the message content, and adjusts the display style of the result div.
 * @function
 * @param {string} message - The message to display for the result of updating a user.
 */
function displayUpdateUserResult(message) {
  clearAllResults();
  if (message) {
    updateUserResultDiv.textContent = message;
    updateUserResultDiv.style.display = "block";
  } else {
    updateUserResultDiv.style.display = "none";
  }
}

/**
 * Deletes a user after confirmation.
 * Validates the user ID, displays a confirmation modal, and handles cancellation or confirmation of deletion.
 * @function
 */
function deleteUser() {
  let deleteUserID = document.getElementById("deleteUserID").value.trim();
  if (!deleteUserID || !Number.isInteger(Number(deleteUserID))) {
    displayDeleteResult("Please Enter a valid User ID.");
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

/**
 * Proceeds with deleting a user by sending a DELETE request to the server and handling the response.
 * Initiates a DELETE request with the user ID to delete, processes the response data, and displays the result.
 * @function
 * @param {string} deleteUserID - The ID of the user to be deleted.
 */
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

/**
 * Displays the result message for deleting a user, showing or hiding the message based on input.
 * Clears existing results, sets the message content, and adjusts the display style of the result div.
 * @function
 * @param {string} message - The message to display for the result of deleting a user.
 */
function displayDeleteResult(message) {
  clearAllResults();
  if (message) {
    deleteUserResultDiv.textContent = message;
    deleteUserResultDiv.style.display = "block";
  } else {
    deleteUserResultDiv.style.display = "none";
  }
}

/**
 * Adds or updates device usage information after validating inputs and making a POST request to the server.
 * Validates user ID, device ID, usage date, and duration before sending a POST request to add or update device usage.
 * @function
 */
function addUpdateDeviceUses() {
  let userUpdateID = document.getElementById("userUpdateID").value.trim();
  let deviceID = document.getElementById("deviceID").value.trim();
  let usageDate = document.getElementById("usageDate").value.trim();
  let usageDuration = document.getElementById("usageDuration").value.trim();

  clearAllResults();

  if (!userUpdateID || !Number.isInteger(Number(userUpdateID))) {
    displayUsesResult("Please Enter a valid User ID.");
    return;
  }

  if (!deviceID || !Number.isInteger(Number(deviceID))) {
    displayUsesResult("Please Enter a valid Device ID.");
    return;
  }

  if (!usageDate) {
    displayUsesResult("Please enter Date.");
    return;
  }

  if (!usageDuration || !Number.isInteger(Number(usageDuration))) {
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
        displayUsesResult("ERROR: No User Found.");
        throw new Error("Network error occurred");
      }
      return response.json();
    })
    .then((data) => {
      displayUsesResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * Displays the result message for adding or updating device uses, showing or hiding the message based on input.
 * Clears existing results, sets the message content, and adjusts the display style of the result div.
 * @function
 * @param {string} message - The message to display for the result of adding or updating device uses.
 */
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

/**
 * Clears all result divs and pagination controls, resetting their content and hiding them.
 * Clears the content of search result div, pagination controls, and other result divs, hiding them from view.
 * @function
 */
function clearAllResults() {
  searchResultDiv.innerHTML = "";
  const paginationDiv = document.getElementById("paginationControls");
  if (paginationDiv) {
    paginationDiv.innerHTML = "";
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

/**
 * Applies the initial theme based on the stored preference in local storage.
 * Checks if the dark mode preference is stored in local storage and applies the "dark-mode" class to the body if set to true.
 * @function
 */
function applyInitialTheme() {
  const darkMode = localStorage.getItem("darkMode") === "true";
  if (darkMode) {
    document.body.classList.add("dark-mode");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  applyInitialTheme();

  let toggleSwitch = document.getElementById("darkModeToggle");
  toggleSwitch.checked = localStorage.getItem("darkMode") === "true";

  toggleSwitch.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
    localStorage.setItem("darkMode", this.checked);
  });
});

/**
 * Displays a message in the specified element, showing or hiding the element based on the message content.
 * Clears the element's existing content, sets the message text, and adjusts the display style of the element.
 * @function
 * @param {string} elementId - The ID of the HTML element where the message will be displayed.
 * @param {string} message - The message to display in the specified element.
 */
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
