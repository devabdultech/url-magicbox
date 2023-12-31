const form = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let input = urlInput.value;

  if (!input) {
    Toastify({
      text: "Invalid URL: Please enter a valid URL",
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right, #d50000, #ff1744)",
      },
    }).showToast();
    return;
  }

  // Check and append "https://" if necessary
  if (!input.includes("https:") && !input.includes("http:")) {
    input = "https://" + input;
  }

  let url = new URL(input);

  let urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/.*)?$/i;
  if (!urlRegex.test(input)) {
    Toastify({
      text: "Invalid URL: Please enter a valid URL with a domain.",
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right, #d50000, #ff1744)",
      },
    }).showToast();
    return;
  }

  // Send the URL to the server for processing
  fetch("http://localhost:3000/url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: url.href }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server
      const shortUrlLink = document.getElementById("short-url-link");
      const longUrlLink = document.getElementById("long-url-link");

      // Update the shortened URL link and copy button
      shortUrlLink.href = data.shortUrl;
      shortUrlLink.textContent = "http://localhost:3000/" + data.shortUrl;
      document
        .getElementById("copy-short-url-button")
        .setAttribute("data-url", data.shortUrl);

      // Update the lengthened URL link and copy button
      longUrlLink.href = data.longUrl;
      longUrlLink.textContent = "http://localhost:3000/" + data.longUrl;
      document
        .getElementById("copy-long-url-button")
        .setAttribute("data-url", data.longUrl);

      // Display the result container
      const resultContainer = document.getElementById("result-container");
      resultContainer.style.display = "block";

      // Clear the input field
      urlInput.value = "";
    })
    .catch((error) => {
      // Handle any errors that occur during the request
      console.error("Error:", error);
    });
});

// Copy button event listeners
document
  .getElementById("copy-short-url-button")
  .addEventListener("click", copyUrl);
document
  .getElementById("copy-long-url-button")
  .addEventListener("click", copyUrl);

const analyticsTable = document.getElementById("analytics-data");

// Fetch analytics data
fetch("http://localhost:3000/analytics")
  .then((response) => response.json())
  .then((data) => {
    let dataArray = data.data;

    dataArray.map((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="http://localhost:3000/${entry.shortUrl}" target="_blank">http://localhost:3000/${entry.shortUrl}</a></td>
        <td><a href="${entry.originalUrl}" target="_blank">${entry.originalUrl}</a></td>
        <td>${entry.clicks}</td>
        <td>
          <span class="copy-icon" data-url="${entry.shortUrl}">
            <i class="fas fa-copy"></i>
          </span>
          <span class="delete-icon" data-id="${entry._id}">
            <i class="fas fa-trash-alt"></i>
          </span>
        </td>
      `;
      analyticsTable.appendChild(row);
    });

    const deleteIcons = document.querySelectorAll(".delete-icon");
    const copyIcons = document.querySelectorAll(".copy-icon");

    deleteIcons.forEach((element) => {
      element.addEventListener("click", handleDelete);
    });

    copyIcons.forEach((copyIcon) => {
      copyIcon.addEventListener("click", copyUrl);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });

async function copyUrl(event) {
  const url = event.currentTarget.getAttribute("data-url");
  navigator.clipboard.writeText("http://localhost:3000/" + url).then(() => {
    Toastify({
      text: "URL copied to clipboard.",
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right, #00bfa5, #1de9b6)",
      },
    }).showToast();
  });
}

async function handleDelete(event) {
  const id = event.currentTarget.getAttribute("data-id");
  const rowToDelete = event.currentTarget.parentElement.parentElement;
  try {
    const response = await fetch(`http://localhost:3000/delete/${id}`, {
      method: "DELETE",
    });

    if (response.status === 200) {
      // Handle successful deletion
      console.log(rowToDelete);
      rowToDelete.remove();
      Toastify({
        text: "URL deleted successfully",
        gravity: "top",
        position: "center",
        style: {
          background: "linear-gradient(to right, #00bfa5, #1de9b6)",
        },
      }).showToast();
      console.log("URL deleted successfully");
    } else {
      // Handle deletion failure
      console.error("Failed to delete URL");
    }
  } catch (error) {
    // Handle error case
    console.error("Failed to delete URL", error);
  }
}
