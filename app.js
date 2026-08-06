/**
 * RonLab Dynamic Service & Sitemap Renderer
 */
(function () {
    async function loadServices() {
        const gridMount = document.getElementById('dynamic-card-grid');
        const sitemapMount = document.getElementById('dynamic-sitemap-table');

        if (!gridMount && !sitemapMount) return;

        try {
            const response = await fetch('/services.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const services = await response.json();

            if (gridMount) {
                renderCardGrid(gridMount, services);
            }

            if (sitemapMount) {
                renderSitemapTable(sitemapMount, services);
            }
        } catch (error) {
            console.error('Error loading services catalog:', error);
            if (gridMount) {
                gridMount.innerHTML = '<p style="color: #b12124; text-align: center;">Unable to load services catalog.</p>';
            }
            if (sitemapMount) {
                sitemapMount.innerHTML = '<tr><td colspan="3" style="color: #b12124; text-align: center;">Unable to load sitemap catalog.</td></tr>';
            }
        }
    }

    function renderCardGrid(container, services) {
        // Exclude specific server detail entries from main index dashboard
        const dashboardServices = services.filter(item => item.category !== 'Minecraft Servers');

        // Group services by category in deterministic order
        const categoryOrder = ['Services', 'Minecraft', 'Games & Experimental', 'Other'];
        const categories = {};

        categoryOrder.forEach(cat => { categories[cat] = []; });

        dashboardServices.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        let html = '';

        for (const catName of Object.keys(categories)) {
            const items = categories[catName];
            if (!items || items.length === 0) continue;

            html += `
            <section>
                <h3 class="section-title">${escapeHtml(catName)}</h3>
                <div class="card-grid">
            `;

            items.forEach(item => {
                html += `
                    <a href="${escapeHtml(item.url)}" class="card-link">
                        <div class="card">
                            <h3>${escapeHtml(item.title)}</h3>
                            <p>${escapeHtml(item.description)}</p>
                        </div>
                    </a>
                `;
            });

            html += `
                </div>
            </section>
            `;
        }

        container.innerHTML = html;
    }

    function renderSitemapTable(container, services) {
        const sitemapServices = services.filter(item => item.show_in_sitemap);

        let html = '';
        sitemapServices.forEach(item => {
            html += `
                <tr>
                    <td>${escapeHtml(item.title)}</td>
                    <td>${escapeHtml(item.description)}</td>
                    <td><a href="${escapeHtml(item.url)}">${escapeHtml(item.url)}</a></td>
                </tr>
            `;
        });

        container.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadServices);
    } else {
        loadServices();
    }
})();
