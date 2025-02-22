document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const navLinks = document.querySelectorAll(".nav-link");

    // Sidebar Toggle
    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
        });

        // Restore sidebar state on page load
        if (localStorage.getItem("sidebarCollapsed") === "true") {
            sidebar.classList.add("collapsed");
        }
    }

    // Restore active link state on page load
    const activeNav = localStorage.getItem("activeNav") || "{{ url_for('home') }}"; // Default to Home
    navLinks.forEach(link => {
        if (link.getAttribute("href") === activeNav) {
            link.classList.add("active");
        } else {
            link.classList.remove("active", "default-active");
        }
    });

    // Active Navigation Link Highlighting on click
    navLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            localStorage.setItem("activeNav", link.getAttribute("href"));
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const dropbox = document.getElementById("dropbox");
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");

    // Handle file selection via input
    fileInput.addEventListener("change", (event) => {
        handleFile(event.target.files[0]);
    });

    // Handle drag & drop
    dropbox.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropbox.classList.add("dragover");
    });

    dropbox.addEventListener("dragleave", () => {
        dropbox.classList.remove("dragover");
    });

    dropbox.addEventListener("drop", (event) => {
        event.preventDefault();
        dropbox.classList.remove("dragover");

        if (event.dataTransfer.files.length > 0) {
            handleFile(event.dataTransfer.files[0]);
        }
    });

    // Handle file processing
    function handleFile(file) {
        if (file && file.type.startsWith("image/")) {
            fileNameDisplay.textContent = "Uploaded Successfully ✅";
            fileNameDisplay.style.color = "green";
        } else {
            fileNameDisplay.textContent = "Invalid file type! ❌";
            fileNameDisplay.style.color = "red";
        }
    }
});

const predictButton = document.getElementById("predictButton");
const predictionMessage = document.getElementById("predictionMessage");

predictButton.addEventListener("click", () => {
    predictionMessage.textContent = "Prediction in progress... ⏳";
    predictionMessage.style.color = "#005ECF";

    setTimeout(() => {
        predictionMessage.textContent = "Prediction Complete ✅";
        predictionMessage.style.color = "green";
    }, 2000);
});