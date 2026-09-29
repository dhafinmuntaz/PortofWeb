/**
 * PortofWeb — Architecture & Interior Design Main Application
 * Dynamically loads and renders projects from decoupled data.
 */

(function () {
    'use strict';

    // Default fallback dataset if offline or local file:// protocol
    const FALLBACK_PROJECTS = [
        {
            "id": "proj-01",
            "slug": "cesarino-puri",
            "title": "Cesarino Italian Restaurant",
            "spine": "Cesarino",
            "category": "Interior Design",
            "type": "Hospitality & Dining",
            "year": "2025",
            "client": "Mr.N",
            "role": "Team Project — Lead Interior Designer & Site Coordinator",
            "location": "Jakarta, Indonesia",
            "area": "228 sqm",
            "materials": "Exposed brick, natural oak timber, cream ceramic tile, dark green joinery, antique brass",
            "coverImage": "images/Project/Cesarino Puri/Cesarino Puri (1).png",
            "galleryImages": [
                "images/Project/Cesarino Puri/Cesarino Puri (1).png",
                "images/Project/Cesarino Puri/Cesarino Puri (2).png",
                "images/Project/Cesarino Puri/Cesarino Puri (3).png",
                "images/Project/Cesarino Puri/Cesarino Puri (4).png",
                "images/Project/Cesarino Puri/Cesarino Puri (5).png",
                "images/Project/Cesarino Puri/Cesarino Puri (6).png",
                "images/Project/Cesarino Puri/Cesarino Puri (7).png"
            ],
            "description": "A warm Italian dining atmosphere shaped by exposed brick arches, dark green detailing, natural timber, and layered ambient lighting.",
            "details": "Cesarino Puri is an Italian restaurant in Jakarta inspired by the warmth and character of traditional Italian dining. The interior combines exposed brick, warm timber, and soft ambient lighting to create an intimate and welcoming atmosphere.",
            "inKinetic": true
        },
        {
            "id": "proj-02",
            "slug": "sour-sally-city-centre-dubai",
            "title": "Sour Sally City Centre, Dubai",
            "spine": "City Centre",
            "category": "Interior Design",
            "type": "Commercial & Retail Pavilion",
            "year": "2025",
            "client": "Sour Sally Group",
            "role": "Interior Designer & Remote Coordinator",
            "location": "Dubai, UAE",
            "area": "36 sqm",
            "materials": "Brushed stainless steel, lime-green solid surfaces, white laminate, illuminated acrylic, LED lighting",
            "coverImage": "images/Project/CityCenter Deira/CityCenter Deira (1).png",
            "galleryImages": [
                "images/Project/CityCenter Deira/CityCenter Deira (1).png",
                "images/Project/CityCenter Deira/CityCenter Deira (2).png",
                "images/Project/CityCenter Deira/CityCenter Deira (3).png"
            ],
            "description": "A dynamic frozen-yogurt retail environment combining Sour Sally’s signature green identity with fluid forms, integrated lighting, and a contemporary metallic material palette.",
            "details": "Sour Sally Deira is a contemporary frozen-yogurt retail concept in Dubai, combining Sour Sally’s signature green identity with a clean, futuristic interior language. Curved forms, illuminated details, and brushed-metal finishes create a bright and energetic customer experience.",
            "inKinetic": true
        },
        {
            "id": "proj-03",
            "slug": "evd-vocational-high-school",
            "title": "EVD Vocational High School",
            "spine": "EVD SMK",
            "category": "Architecture",
            "type": "Vocational Education & Technology Campus",
            "year": "2024",
            "client": "-",
            "role": "Final Year Project",
            "location": "Indonesia",
            "area": "3148 sqm",
            "materials": "Exposed structural steel, aluminium composite panels, glass curtain walls, concrete, and neutral-toned architectural finishes",
            "coverImage": "images/Project/EVD SMK/EVD SMK (1).png",
            "galleryImages": [
                "images/Project/EVD SMK/EVD SMK (1).png",
                "images/Project/EVD SMK/EVD SMK (2).png",
                "images/Project/EVD SMK/EVD SMK (3).png",
                "images/Project/EVD SMK/EVD SMK (4).png",
                "images/Project/EVD SMK/EVD SMK (5).png",
                "images/Project/EVD SMK/EVD SMK (6).png",
                "images/Project/EVD SMK/EVD SMK (7).png",
                "images/Project/EVD SMK/EVD SMK (8).png"
            ],
            "description": "A contemporary vocational campus organized around connected learning spaces, technical workshops, and landscaped courtyards to support hands-on education in electronic vehicle development.",
            "details": "EVD SMK is a modern vocational education campus in Cimahi dedicated to Electric Vehicle Development and technical learning. The campus combines academic, laboratory, workshop, sports, and communal facilities within a contemporary and highly connected educational environment.",
            "inKinetic": true
        },
        {
            "id": "proj-04",
            "slug": "geo-gymnas",
            "title": "Geo Gymnas",
            "spine": "Gymnas",
            "category": "Architecture",
            "type": "Sports & Wellness Pavilion",
            "year": "2023",
            "client": "Geo Sports Club",
            "role": "Team Project - 3D Drafter & Visualization",
            "location": "Bandung, Indonesia",
            "area": "±4000 sqm",
            "materials": "Exposed concrete, dark metal structure, glass curtain walls, timber flooring, perforated metal railings, and landscaped greenery",
            "coverImage": "images/Project/GEO GYMNAS/GEO GYMNAS (1).png",
            "galleryImages": [
                "images/Project/GEO GYMNAS/GEO GYMNAS (1).png",
                "images/Project/GEO GYMNAS/GEO GYMNAS (2).png",
                "images/Project/GEO GYMNAS/GEO GYMNAS (3).png",
                "images/Project/GEO GYMNAS/GEO GYMNAS (4).png",
                "images/Project/GEO GYMNAS/GEO GYMNAS (5).png"
            ],
            "description": "A contemporary public sports environment that integrates functional athletic spaces, flexible programming, natural light, and strong connections between indoor and outdoor areas.",
            "details": "GEO Gymnas – Bandung is a contemporary public sports facility designed as a multifunctional environment for athletic activities, recreation, and community use. Combining modern architectural forms with expansive sports halls, generous glazing, landscaped outdoor areas, and flexible spaces that support a variety of sporting activities.",
            "inKinetic": true
        },
        {
            "id": "proj-05",
            "slug": "juicy-sally-booth",
            "title": "Juicy Sally Booth",
            "spine": "Juicy Sally",
            "category": "Architecture",
            "type": "F&B Retail Booth / Kiosk",
            "year": "2026",
            "client": "Sour Sally Group",
            "role": "Lead Designer & Project Coordinator",
            "location": "Indonesia",
            "area": "15-20 sqm",
            "materials": "Pink illuminated acrylic, black laminate, LED lighting, digital display panels, graphic vinyl, and glossy accent finishes",
            "coverImage": "images/Project/JS/JS (1).png",
            "galleryImages": [
                "images/Project/JS/JS (1).png",
                "images/Project/JS/JS (2).png",
                "images/Project/JS/JS (3).png"
            ],
            "description": "A bold and playful F&B booth that translates Juicy Sally’s youthful brand identity into a highly visible retail experience through vibrant color, graphic expression, integrated lighting, and distinctive character elements.",
            "details": "Juicy Sally – Sour Sally Group is a vibrant F&B kiosk concept designed around a bold, youthful, and playful visual identity. The booth combines vivid pink tones, black accents, illuminated graphics, and the signature Juicy Sally character to create a highly recognizable presence within a contemporary retail environment.",
            "inKinetic": true
        },
        {
            "id": "proj-06",
            "slug": "juicy-sally-summarecon-mall-serpong",
            "title": "Juicy Sally — Summarecon Mall Serpong",
            "spine": "Serpong",
            "category": "Architecture",
            "type": "F&B Retail",
            "year": "2026",
            "client": "Sour Sally Group",
            "role": "Lead Designer & Project Coordinator",
            "location": "Jakarta, Indonesia",
            "area": "40 sqm",
            "materials": "Pink illuminated acrylic, black laminate, LED lighting, digital display panels, graphic vinyl, and glossy accent finishes",
            "coverImage": "images/Project/JS SMS/JS SMS (1).png",
            "galleryImages": [
                "images/Project/JS SMS/JS SMS (1).png",
                "images/Project/JS SMS/JS SMS (2).png",
                "images/Project/JS SMS/JS SMS (3).png",
                "images/Project/JS SMS/JS SMS (4).png",
                "images/Project/JS SMS/JS SMS (5).png"
            ],
            "description": "A bold and immersive F&B retail unit that expresses Juicy Sally’s playful identity through vibrant graphics, integrated lighting, strong contrast, and a highly recognizable branded environment.",
            "details": "Juicy Sally – Summarecon Mall Serpong is a vibrant F&B retail unit developed for the Juicy Sally brand, translating its playful and energetic identity into a compact mall environment. The design combines bold pink graphics, black finishes, integrated LED lighting, and signature character elements to create a distinctive and highly visible customer-facing space.",
            "inKinetic": true
        },
        {
            "id": "proj-07",
            "slug": "housing-complex-reimagine",
            "title": "Housing Complex Reimagine",
            "spine": "Housing",
            "category": "Architecture",
            "type": "Residential",
            "year": "2024",
            "client": "Private Client",
            "role": "3D Visualization",
            "location": "Indonesia",
            "area": "±800 sqm",
            "materials": "Clay roof tiles, natural stone, timber finishes, textured white walls, porcelain flooring, glass, and warm LED lighting",
            "coverImage": "images/Project/KOMPLEK/KOMPLEK (1).png",
            "galleryImages": [
                "images/Project/KOMPLEK/KOMPLEK (1).png",
                "images/Project/KOMPLEK/KOMPLEK (2).png",
                "images/Project/KOMPLEK/KOMPLEK (3).png",
                "images/Project/KOMPLEK/KOMPLEK (4).png",
                "images/Project/KOMPLEK/KOMPLEK (5).png"
            ],
            "description": "A warm contemporary residential environment combining functional compact living spaces with natural materials, tropical landscaping, and a consistent architectural language across the housing cluster.",
            "details": "Residential Housing Complex is a contemporary tropical housing development designed around a warm, modern residential character. The architecture combines pitched clay-tile roofs, natural stone, timber elements, and landscaped communal areas, creating a cohesive and comfortable environment across the housing units.",
            "inKinetic": true
        }
    ];

    let projects = [];
    const PROJECT_DATA_VERSION = 'project-images-v3';

    // DOM Elements
    const trackEl = document.getElementById('projectTrack');
    const gridContainerEl = document.getElementById('gridGalleryContainer');
    const projectGridEl = document.getElementById('projectGrid');
    const projectDialog = document.getElementById('projectDialog');
    const btnReelView = document.getElementById('btnReelView');
    const btnGridView = document.getElementById('btnGridView');

    /** Load online data first, with JSON and local fallbacks for setup/offline use. */
    async function loadProjects() {
        try {
            const online = await window.portofwebDb.load('projects');
            if (online) {
                projects = online;
                renderAll();
                return;
            }
            const res = await fetch('data/projects.json?t=' + Date.now());
            if (res.ok) {
                projects = await res.json();
                renderAll();
                return;
            }
        } catch (err) {
            console.log('Direct fetch notice, using cached or fallback projects:', err);
        }

        projects = FALLBACK_PROJECTS;
        renderAll();
    }

    /**
     * Render both views
     */
    function renderAll() {
        renderKineticTrack();
        renderGridGallery();
    }

    // Reflect Kinetic Reel edits immediately when Admin CMS is open in another tab.
    window.addEventListener('storage', event => {
        if (event.key !== 'portofweb_projects' || !event.newValue) return;
        try {
            projects = JSON.parse(event.newValue);
            renderAll();
        } catch (error) {
            console.warn('Unable to apply project update from Admin CMS', error);
        }
    });

    /**
     * Render the kinetic horizontal panels (up to 7 selected projects from admin console)
     */
    function renderKineticTrack() {
        if (!trackEl) return;
        trackEl.innerHTML = '';

        // Only show up to 5 projects marked from Admin console (or first 5 as fallback)
        let kineticProjects = projects.filter(p => p.inKinetic);
        if (kineticProjects.length === 0) {
            kineticProjects = projects.slice(0, 7);
        } else if (kineticProjects.length > 7) {
            kineticProjects = kineticProjects.slice(0, 7);
        }

        const total = kineticProjects.length;
        kineticProjects.forEach((proj, idx) => {
            const indexFormatted = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
            const article = document.createElement('article');
            article.className = 'panel';
            article.innerHTML = `
                <div class="panel__bg">
                    <img src="${escapeHtml(proj.coverImage)}"
                         alt="${escapeHtml(proj.title)}"
                         loading="${idx === 0 ? 'eager' : 'lazy'}">
                </div>
                <span class="panel__index">${indexFormatted}</span>
                <h2 class="spine">${escapeHtml(proj.spine || proj.title)}</h2>
                <div class="details">
                    <p class="details__category">${escapeHtml(proj.category)}</p>
                    <h3 class="details__title">${escapeHtml(proj.title)}</h3>
                    <div class="details__meta">
                        <div class="details__meta-item">
                            <span class="details__meta-label">Location</span>
                            <span class="details__meta-value">${escapeHtml(proj.location || proj.client)}</span>
                        </div>
                        <div class="details__meta-item">
                            <span class="details__meta-label">Year</span>
                            <span class="details__meta-value">${escapeHtml(proj.year)}</span>
                        </div>
                        <div class="details__meta-item">
                            <span class="details__meta-label">Area</span>
                            <span class="details__meta-value">${escapeHtml(proj.area || proj.role)}</span>
                        </div>
                    </div>
                    <p class="details__description">${escapeHtml(proj.description)}</p>
                    <button type="button" class="btn-view" data-project-id="${escapeHtml(proj.id)}">
                        View Project
                        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
                        </svg>
                    </button>
                </div>
            `;
            trackEl.appendChild(article);
        });

        // Attach view button listeners in track
        trackEl.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-project-id');
                openProjectDialog(id);
            });
        });

        if (window.innerWidth <= 900 && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            trackEl.querySelectorAll('article.panel').forEach(p => {
                p.style.opacity = '0';
                p.style.transform = 'translateY(20px)';
                p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(p);
            });
        }
    }

    /**
     * Render the grid gallery
     */
    function renderGridGallery() {
        if (!projectGridEl) return;
        projectGridEl.innerHTML = '';

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-card__thumb-wrap">
                    <span class="project-card__category-tag">${escapeHtml(proj.category)}</span>
                    <span class="project-card__year-tag">${escapeHtml(proj.year)}</span>
                    <img src="${escapeHtml(proj.coverImage)}" alt="${escapeHtml(proj.title)}" loading="lazy">
                </div>
                <div class="project-card__content">
                    <h3 class="project-card__title">${escapeHtml(proj.title)}</h3>
                    <div class="project-card__meta-bar">
                        <span>Loc: <strong>${escapeHtml(proj.location || '—')}</strong></span>
                        <span>Area: <strong>${escapeHtml(proj.area || '—')}</strong></span>
                        <span>Client: <strong>${escapeHtml(proj.client || '—')}</strong></span>
                    </div>
                    <p class="project-card__desc">${escapeHtml(proj.description)}</p>
                    <div class="project-card__footer">
                        <span class="project-card__btn">
                            Architectural Specs &rarr;
                        </span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => {
                openProjectDialog(proj.id);
            });

            projectGridEl.appendChild(card);
        });
    }

    /**
     * Open Project Detail Dialog
     */
    function openProjectDialog(projectId) {
        const proj = projects.find(p => p.id === projectId);
        if (!proj || !projectDialog) return;

        const images = (proj.galleryImages && proj.galleryImages.length > 0)
            ? proj.galleryImages
            : [proj.coverImage];
        const galleryHtml = images.map((img, index) => `
            <button type="button" class="dialog-gallery-image" data-image-src="${escapeHtml(img)}" aria-label="Zoom ${escapeHtml(proj.title)} image ${index + 1}">
                <img src="${escapeHtml(img)}" alt="${escapeHtml(proj.title)} - image ${index + 1}" loading="lazy">
                <span>Click to zoom</span>
            </button>
        `).join('');

        projectDialog.innerHTML = `
            <div class="dialog-inner">
                <button type="button" class="dialog-close-btn" id="dialogCloseBtn" aria-label="Close dialog">&times;</button>
                <div class="dialog-header">
                    <span class="dialog-category">${escapeHtml(proj.category)} &bull; ${escapeHtml(proj.type || 'Project')}</span>
                    <h2 class="dialog-title">${escapeHtml(proj.title)}</h2>
                </div>

                <div class="dialog-media-showcase">
                    ${galleryHtml}
                </div>

                <div class="dialog-specs-grid">
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Location</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.location || 'N/A')}</span>
                    </div>
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Gross Area</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.area || 'N/A')}</span>
                    </div>
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Completion</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.year || 'N/A')}</span>
                    </div>
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Client</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.client || 'N/A')}</span>
                    </div>
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Role</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.role || 'Lead Architect')}</span>
                    </div>
                    <div class="dialog-spec-item">
                        <span class="dialog-spec-label">Primary Materials</span>
                        <span class="dialog-spec-val">${escapeHtml(proj.materials || 'Concrete, Glass, Steel')}</span>
                    </div>
                </div>

                <div class="dialog-narrative">
                    <div>
                        <h4>Design Statement</h4>
                        <p>${escapeHtml(proj.description)}</p>
                    </div>
                    <div>
                        <h4>Spatial & Tectonic Execution</h4>
                        <p>${escapeHtml(proj.details || 'Bespoke architectural detailing tailored for acoustic harmony, natural ventilation, and material integrity.')}</p>
                    </div>
                </div>
            </div>
        `;

        // Modern showModal
        projectDialog.showModal();

        // Close button listener
        document.getElementById('dialogCloseBtn').addEventListener('click', () => {
            projectDialog.close();
        });

        projectDialog.querySelectorAll('.dialog-gallery-image').forEach(button => {
            button.addEventListener('click', () => openImageZoom(button.dataset.imageSrc, button.querySelector('img').alt));
        });
    }

    /** Open a full-screen, manually dismissible view of a project image. */
    function openImageZoom(src, alt) {
        let zoomDialog = document.getElementById('imageZoomDialog');
        if (!zoomDialog) {
            zoomDialog = document.createElement('dialog');
            zoomDialog.id = 'imageZoomDialog';
            zoomDialog.className = 'image-zoom-dialog';
            document.body.appendChild(zoomDialog);
            zoomDialog.addEventListener('click', event => {
                if (event.target === zoomDialog) zoomDialog.close();
            });
        }

        zoomDialog.innerHTML = `
            <button type="button" class="image-zoom-close" aria-label="Close enlarged image">&times;</button>
            <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">
        `;
        zoomDialog.querySelector('.image-zoom-close').addEventListener('click', () => zoomDialog.close());
        zoomDialog.showModal();
    }

    /**
     * Fallback for light-dismiss (modern-web-guidance)
     */
    if (projectDialog && !('closedBy' in HTMLDialogElement.prototype)) {
        projectDialog.addEventListener('click', (event) => {
            if (event.target !== projectDialog) return;
            const rect = projectDialog.getBoundingClientRect();
            const isDialogContent = (
                rect.top <= event.clientY &&
                event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX &&
                event.clientX <= rect.left + rect.width
            );
            if (!isDialogContent) {
                projectDialog.close();
            }
        });
    }

    /**
     * Setup View Switcher
     */
    function setupControls() {
        if (btnReelView && btnGridView) {
            btnReelView.addEventListener('click', () => {
                btnReelView.classList.add('active');
                btnGridView.classList.remove('active');
                if (gridContainerEl) gridContainerEl.classList.remove('active');
                if (trackEl) trackEl.style.display = 'flex';
                document.body.classList.add('kinetic-view');
            });

            btnGridView.addEventListener('click', () => {
                btnGridView.classList.add('active');
                btnReelView.classList.remove('active');
                if (trackEl) trackEl.style.display = 'none';
                if (gridContainerEl) gridContainerEl.classList.add('active');
                document.body.classList.remove('kinetic-view');
            });
        }
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadProjects();
        setupControls();
    });
})();
