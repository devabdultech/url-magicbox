const form = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let input = urlInput.value;

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

function copyUrl(event) {
  const url = event.target.getAttribute("data-url");
  navigator.clipboard.writeText(url).then(() => {
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
