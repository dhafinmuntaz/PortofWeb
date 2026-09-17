/**
 * PortofWeb — About Detail Page Dynamic Loader
 * Loads architect profile data from Supabase or data/profile.json
 */

(function () {
    'use strict';

    const FALLBACK_PROFILE = {
        "name": "Kaelen Vane",
        "studioName": "MNTS DSGN",
        "title": "Architect & Interior Designer",
        "tagline": "Spatial reduction, structural honesty, and atmospheric architecture.",
        "location": "Tokyo & New York",
        "yearsExperience": 12,
        "completedProjects": 38,
        "awardsCount": 7,
        "bio": "I am a registered architect and interior designer practicing at the intersection of raw material tectonic architecture and atmospheric interior spaces. My work investigates how light, spatial volume, and restrained material palettes can transform residential and commercial sanctuaries into meditative, functional environments.",
        "philosophy": [
            {
                "pillar": "01. Material Authenticity",
                "statement": "Raw concrete, charred timber, natural stone, and unadorned metals are celebrated for their intrinsic texture, weight, and graceful aging rather than concealed behind superficial veneers."
            },
            {
                "pillar": "02. Spatial Compression & Release",
                "statement": "Manipulating vertical proportions and threshold transitions to create emotional resonance—tightening entryways to amplify the dramatic expanse of sunlit living volumes."
            },
            {
                "pillar": "03. Light as Matter",
                "statement": "Natural light is treated not merely as illumination, but as an active sculptural medium that activates surfaces and articulates the passage of time."
            }
        ],
        "services": [
            {
                "name": "Architectural Design",
                "description": "Concept design, spatial planning, facade articulation, and full schematic development for residential villas, cultural pavilions, and boutique commercial buildings."
            },
            {
                "name": "Interior Architecture",
                "description": "Comprehensive interior environments, custom acoustic millwork, monolithic kitchen & bath design, and bespoke furniture curation."
            },
            {
                "name": "Lighting & Atmospheric Studies",
                "description": "Circadian lighting analysis, indirect luminaire detailing, and daylight shadow simulation to harmonize interior volumes."
            },
            {
                "name": "Adaptive Reuse & Renovation",
                "description": "Surgical interventions within historic and industrial structures, breathing contemporary life into aged masonry and heavy timber frames."
            }
        ],
        "toolkit": [
            "Revit (BIM)",
            "Rhino 8 + Grasshopper",
            "AutoCAD",
            "3ds Max + V-Ray",
            "Enscape 3D",
            "SketchUp Pro",
            "Adobe Creative Cloud",
            "Twinmotion"
        ],
        "credentials": [
            {
                "year": "2024",
                "title": "AIA International Design Excellence Award — Residential Category"
            },
            {
                "year": "2022",
                "title": "IIDA Interior Architecture Best in Show — Atelier Noir"
            },
            {
                "year": "2019",
                "title": "Master of Architecture (M.Arch), GSD"
            },
            {
                "year": "2016",
                "title": "Bachelor of Fine Arts (Interior Architecture)"
            }
        ],
        "contact": {
            "email": "kaelen@vanearch.com",
            "phone": "+1 (212) 555-0194",
            "office": "48 Mercer Street, New York, NY 10013 / 3-12-8 Aoyama, Minato-ku, Tokyo",
            "instagram": "@vane.architecture",
            "linkedin": "linkedin.com/in/kaelen-vane"
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
        if (nameEl) nameEl.textContent = profile.name || 'Kaelen Vane';

        const titleEl = document.getElementById('profileTitle');
        if (titleEl) titleEl.textContent = profile.title || 'Architect & Interior Designer';

        const bioEl = document.getElementById('profileBio');
        if (bioEl) bioEl.textContent = profile.bio || '';

        // Stats
        const expEl = document.getElementById('statExp');
        if (expEl) expEl.textContent = `${profile.yearsExperience || 12}+`;

        const projEl = document.getElementById('statProj');
        if (projEl) projEl.textContent = `${profile.completedProjects || 38}+`;

        const awardEl = document.getElementById('statAward');
        if (awardEl) awardEl.textContent = `${profile.awardsCount || 7}`;

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
