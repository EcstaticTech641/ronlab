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
        const targetCategory = container.getAttribute('data-category');

        let filteredServices = services.filter(item => item.category !== 'Minecraft Servers');

        if (targetCategory) {
            filteredServices = filteredServices.filter(item => item.category === targetCategory);
        }

        // Group services by category in deterministic order
        const categoryOrder = ['Services', 'Minecraft', 'Games & Experimental', 'Other'];
        const categories = {};

        categoryOrder.forEach(cat => { categories[cat] = []; });

        filteredServices.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        let html = '';

        for (const catName of Object.keys(categories)) {
            const items = categories[catName];
            if (!items || items.length === 0) continue;

            const hideTitle = !!targetCategory;

            html += `
            <section>
                ${hideTitle ? '' : `<h3 class="section-title">${escapeHtml(catName)}</h3>`}
                <div class="card-grid">
            `;

            items.forEach(item => {
                const targetAttr = (item.type === 'subdomain' || item.type === 'external') ? 'target="_blank" rel="noopener noreferrer"' : '';
                html += `
                    <a href="${escapeHtml(item.url)}" class="card-link" ${targetAttr}>
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
            const targetAttr = (item.type === 'subdomain' || item.type === 'external') ? 'target="_blank" rel="noopener noreferrer"' : '';
            html += `
                <tr>
                    <td>${escapeHtml(item.title)}</td>
                    <td>${escapeHtml(item.description)}</td>
                    <td><a href="${escapeHtml(item.url)}" ${targetAttr}>${escapeHtml(item.url)}</a></td>
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
