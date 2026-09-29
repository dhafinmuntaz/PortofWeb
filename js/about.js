/**
 * PortofWeb — About Detail Page Dynamic Loader
 * Loads architect profile data from Supabase or data/profile.json
 */

(function () {
    'use strict';

    const FALLBACK_PROFILE = {
        "name": "Dhafin Muntaz Rizqullah",
        "studioName": "MNTS DSGN",
        "title": "Junior Architect · Site Supervisor · Project Coordinator",
        "tagline": "Architect and project coordinator with more than four years of professional experience in drafting, BIM modeling, 3D visualization, retail design, and end-to-end project coordination.",
        "location": "Jakarta, Indonesia",
        "yearsExperience": 4,
        "completedProjects": 32,
        "awardsCount": 3,
        "bio": "I work across architecture, interior, and retail projects, from technical drawings and 3D visualization to site coordination and project development. My experience covers both design and execution, with a focus on practical solutions, clear documentation, and delivering projects to site.",
        "philosophy": [
            {
                "pillar": "01. Practical Solutions & Clear Documentation",
                "statement": "Bridging architectural design intent with constructible site execution through meticulous technical drawings, comprehensive BOQ/RAB specifications, and precise construction documentation."
            },
            {
                "pillar": "02. End-to-End Project Coordination",
                "statement": "Ensuring smooth delivery across 50+ retail, commercial, and residential projects by orchestrating site surveys, landlord compliance, MEP alignment, and proactive vendor management."
            },
            {
                "pillar": "03. Immersive 3D Visualization & BIM",
                "statement": "Leveraging BIM workflows, realistic 3D renderings, and lighting studies to evaluate spatial volumes, validate materials, and communicate design concepts effectively to clients and stakeholders."
            }
        ],
        "services": [
            {
                "name": "Architecture & Spatial Design",
                "description": "Concept development, spatial massing, floor planning, facade articulation, and complete drawing sets for residential, educational, and commercial facilities."
            },
            {
                "name": "Retail & F&B Environments",
                "description": "End-to-end retail kiosk and outlet design-and-build, brand interior rollouts, modular joinery detailing, and international remote project coordination."
            },
            {
                "name": "3D Architectural Visualization",
                "description": "High-fidelity 3D modeling, photorealistic exterior and interior renderings, material texturing, and presentation animations using Lumion and Chaos Enscape."
            },
            {
                "name": "Site Supervision & Coordination",
                "description": "On-site surveys, landlord and mall management compliance, MEP coordination, progress monitoring, and cost-effective vendor management."
            }
        ],
        "toolkit": [
            "AutoCAD",
            "Google SketchUp",
            "Lumion",
            "Archicad",
            "Chaos Enscape",
            "Adobe Creative Cloud",
            "BOQ / RAB",
            "Revit (BIM)"
        ],
        "credentials": [
            {
                "year": "2023 — Present",
                "title": "Project Coordinator & Designer — Sour Sally Group (50+ outlets, 3 international projects)"
            },
            {
                "year": "2023",
                "title": "Bachelor of Architecture — Institut Teknologi Nasional (Itenas), Bandung (GPA 3.31 / 4.00)"
            },
            {
                "year": "2023",
                "title": "Construction Expert Training — Bina Utama"
            },
            {
                "year": "2022",
                "title": "Building Information Modeling 101 — Autodesk Authorized Academic Partner"
            },
            {
                "year": "2021 — 2023",
                "title": "Freelance Architect — Jabodetabek & West Java (Design concepts, drawing sets & realistic 3D renderings)"
            },
            {
                "year": "2021 — 2022",
                "title": "Drafter & Maintenance Coordinator — Akso Studio Design and Build, Bandung"
            },
            {
                "year": "2021",
                "title": "Junior Architect Intern — CV Cipta Bina Sarana, Bandung"
            },
            {
                "year": "2020",
                "title": "Archicad 22 & SketchUp for Architecture Certified — Itenas BIMCoE"
            }
        ],
        "contact": {
            "email": "muntazrizqullah@gmail.com",
            "phone": "+62 878 3380 4321",
            "office": "Jakarta, Indonesia",
            "instagram": "@mnts.dsgn",
            "linkedin": "linkedin.com/in/dhafinmuntaz",
            "website": "dhafinmuntaz.github.io/PortofWeb"
        }
    };

    let profile = null;

    async function loadProfile() {
        try {
            const online = await window.portofwebDb.load('profile');
            if (online) {
                profile = online;
                renderProfile();
                return;
            }
            const res = await fetch('data/profile.json');
            if (res.ok) {
                profile = await res.json();
            } else {
                profile = FALLBACK_PROFILE;
            }
        } catch (err) {
            profile = FALLBACK_PROFILE;
        }

        renderProfile();
    }

    function renderProfile() {
        if (!profile) return;

        // Headline & Bio
        const nameEl = document.getElementById('profileName');
        if (nameEl) nameEl.textContent = profile.name || 'Dhafin Muntaz Rizqullah';

        const titleEl = document.getElementById('profileTitle');
        if (titleEl) titleEl.textContent = profile.title || 'Junior Architect · Site Supervisor · Project Coordinator';

        const bioEl = document.getElementById('profileBio');
        if (bioEl) bioEl.textContent = profile.bio || '';

        // Stats
        const expEl = document.getElementById('statExp');
        if (expEl) expEl.textContent = `${profile.yearsExperience || 4}+`;

        const projEl = document.getElementById('statProj');
        if (projEl) projEl.textContent = `${profile.completedProjects || 32}+`;

        const awardEl = document.getElementById('statAward');
        if (awardEl) awardEl.textContent = `${profile.awardsCount || 3}`;

        // Philosophy
        const philContainer = document.getElementById('philosophyContainer');
        if (philContainer && profile.philosophy) {
            philContainer.innerHTML = profile.philosophy.map(item => `
                <div class="philosophy-card">
                    <h3>${escapeHtml(item.pillar)}</h3>
                    <p>${escapeHtml(item.statement)}</p>
                </div>
            `).join('');
        }

        // Services
        const servContainer = document.getElementById('servicesContainer');
        if (servContainer && profile.services) {
            servContainer.innerHTML = profile.services.map(item => `
                <div class="service-card">
                    <h4>${escapeHtml(item.name)}</h4>
                    <p>${escapeHtml(item.description)}</p>
                </div>
            `).join('');
        }

        // Credentials
        const credContainer = document.getElementById('credentialsContainer');
        if (credContainer && profile.credentials) {
            credContainer.innerHTML = profile.credentials.map(item => `
                <div class="credential-item">
                    <span class="credential-year">${escapeHtml(item.year)}</span>
                    <span class="credential-title">${escapeHtml(item.title)}</span>
                </div>
            `).join('');
        }

        // Toolkit
        const toolContainer = document.getElementById('toolkitContainer');
        if (toolContainer && profile.toolkit) {
            toolContainer.innerHTML = profile.toolkit.map(item => `
                <span class="tool-badge">${escapeHtml(item)}</span>
            `).join('');
        }

        // Contact info
        const emailEl = document.getElementById('contactEmail');
        if (emailEl && profile.contact) {
            emailEl.textContent = profile.contact.email;
            emailEl.href = `mailto:${profile.contact.email}`;
        }

        const phoneEl = document.getElementById('contactPhone');
        if (phoneEl && profile.contact) {
            phoneEl.textContent = profile.contact.phone;
            phoneEl.href = `tel:${profile.contact.phone}`;
        }

        const officeEl = document.getElementById('contactOffice');
        if (officeEl && profile.contact) {
            officeEl.textContent = profile.contact.office;
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

    // Handle Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.form-btn-submit');
            const originalText = btn.textContent;
            btn.textContent = 'TRANSMITTING...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Thank you for reaching out. We have received your project inquiry and will contact you within 24 hours.');
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 800);
        });
    }

    document.addEventListener('DOMContentLoaded', loadProfile);
})();
