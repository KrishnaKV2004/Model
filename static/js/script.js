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

    // Active Navigation Link Highlighting
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(l => l.classList.remove("active", "default-active"));

            link.classList.add("active");
            localStorage.setItem("activeNav", link.href);
        });
    });

    // Restore active link state on page load
    const activeNav = localStorage.getItem("activeNav");
    if (activeNav) {
        navLinks.forEach(link => {
            if (link.href === activeNav) {
                link.classList.add("active");
            }
        });
    }
});