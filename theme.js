/**
 * RonLab Centralized Theme & Dark Mode Controller
 */
(function () {
    function applyTheme() {
        const isDarkMode = localStorage.getItem('darkMode');
        if (isDarkMode === 'enabled') {
            document.body.classList.add('dark-mode');
        } else if (isDarkMode === 'disabled') {
            document.body.classList.remove('dark-mode');
        }
    }

    if (document.body) {
        applyTheme();
    } else {
        document.addEventListener('DOMContentLoaded', applyTheme);
    }

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme();

        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isNowDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isNowDark ? 'enabled' : 'disabled');
            });
        }
    });
})();
