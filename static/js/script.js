document.addEventListener("DOMContentLoaded", () => {
    // Sidebar toggle functionality
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-toggle");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            localStorage.setItem("sidebarCollapsed", sidebar.classList.contains("collapsed"));
        });

        if (localStorage.getItem("sidebarCollapsed") === "true") {
            sidebar.classList.add("collapsed");
        }
    }

    // Highlight active link based on the current page
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active", "default-active");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");
            localStorage.setItem("activeNav", link.getAttribute("href"));
        });
    });

    // File upload and drag & drop functionality
    const dropbox = document.getElementById("dropbox");
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");

    if (dropbox && fileInput && fileNameDisplay) {
        fileInput.addEventListener("change", (event) => {
            handleFile(event.target.files[0]);
        });

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

        function handleFile(file) {
            if (file && file.type.startsWith("image/")) {
                fileNameDisplay.textContent = "Uploaded Successfully ✅";
                fileNameDisplay.style.color = "green";
            } else {
                fileNameDisplay.textContent = "Invalid File Type ! ❌";
                fileNameDisplay.style.color = "red";
            }
        }
    }

    // Prediction functionality
    const predictButton = document.getElementById("predictButton");
    const predictionMessage = document.getElementById("predictionMessage");

    if (predictButton && predictionMessage && fileInput) {
        predictButton.addEventListener("click", () => {
            if (fileInput.files.length === 0) {
                predictionMessage.textContent = "No File Selected ! ❌";
                predictionMessage.style.color = "red";
                return;
            }

            const formData = new FormData();
            formData.append("file", fileInput.files[0]);

            predictionMessage.textContent = "Prediction In Progress... ⏳";
            predictionMessage.style.color = "#005ECF";

            fetch("/predict", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    predictionMessage.textContent = data.error;
                    predictionMessage.style.color = "red";
                } else {
                    // Display prediction result
                    if (data.prediction) {
                        predictionMessage.textContent = `Prediction: ${data.prediction} ✅`;
                        predictionMessage.style.color = "green";
                    } else {
                        predictionMessage.textContent = "Prediction Failed! ❌";
                        predictionMessage.style.color = "red";
                    }
                }
            })
            .catch(error => {
                predictionMessage.textContent = "Prediction Failed! ❌";
                predictionMessage.style.color = "red";
                console.error(error);
            });
        });
    }
});