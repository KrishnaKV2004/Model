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