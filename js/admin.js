/**
 * PortofWeb — Admin CMS Dashboard Logic
 * Project CRUD, profile management, and JSON export/import.
 */

(function () {
    'use strict';

    let projects = [];
    let profile = {};
    const PROJECT_DATA_VERSION = 'project-images-v3';

    // DOM Elements
    const adminProjectList = document.getElementById('adminProjectList');
    const projectCountEl = document.getElementById('projectCount');
    const projectModal = document.getElementById('projectModal');
    const modalProjectTitle = document.getElementById('modalProjectTitle');
    const projectEditForm = document.getElementById('projectEditForm');
    const profileForm = document.getElementById('profileForm');
    const adminToast = document.getElementById('adminToast');
    const btnSaveAll = document.getElementById('btnSaveAll');
    const btnSyncImages = document.getElementById('btnSyncImages');
    const btnExportJson = document.getElementById('btnExportJson');
    const importJsonInput = document.getElementById('importJsonInput');
    const btnResetData = document.getElementById('btnResetData');
    const btnAddNewProject = document.getElementById('btnAddNewProject');
    const btnCloseProjectModal = document.getElementById('btnCloseProjectModal');
    const btnCancelModal = document.getElementById('btnCancelModal');

    /**
     * Show notification toast
     */
    function showToast(msg) {
        if (!adminToast) return;
        adminToast.textContent = msg;
        adminToast.classList.add('show');
        setTimeout(() => {
            adminToast.classList.remove('show');
        }, 3000);
    }

    /**
     * Load initial data
     */
    async function initData() {
        try { projects = await window.portofwebDb.load('projects') || []; } catch (e) { projects = []; }
        try { profile = await window.portofwebDb.load('profile') || {}; } catch (e) { profile = {}; }
        if (!projects.length) {
            const res = await fetch('data/projects.json');
            if (res.ok) projects = await res.json();
        }
        if (!profile.name) {
            const res = await fetch('data/profile.json');
            if (res.ok) profile = await res.json();
        }

        renderProjectsTable();
        populateProfileForm();
    }

    /**
     * Render Project Table
     */
    function renderProjectsTable() {
        if (!adminProjectList) return;
        adminProjectList.innerHTML = '';
        projectCountEl.textContent = projects.length;

        const kineticCountEl = document.getElementById('kineticSelectedCount');
        if (kineticCountEl) {
            kineticCountEl.textContent = projects.filter(p => p.inKinetic).length;
        }

        if (projects.length === 0) {
            adminProjectList.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--text-muted);">No projects found. Click "+ Add New Project" to create one.</td></tr>`;
            return;
        }

        projects.forEach((proj, idx) => {
            const isKinetic = !!proj.inKinetic;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${escapeHtml(proj.coverImage)}" alt="Thumb" class="admin-thumb" onerror="this.src='images/tm-620-com-01.jpg'">
                </td>
                <td>
                    <strong style="color: var(--off-white); font-size: 0.85rem;">${escapeHtml(proj.title)}</strong><br>
                    <span style="color: var(--accent); font-size: 0.65rem;">Spine: ${escapeHtml(proj.spine || '—')}</span>
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn-admin-action ${isKinetic ? 'primary' : ''}" data-action="toggle-kinetic" data-id="${escapeHtml(proj.id)}" title="${isKinetic ? 'Featured in Kinetic Reel (click to remove)' : 'Click to feature in Kinetic Reel (max 7)'}" style="font-size: 0.68rem; padding: 4px 8px; min-width: 64px;">
                        ${isKinetic ? '★ Reel' : '+ Add'}
                    </button>
                </td>
                <td>
                    <span style="background: rgba(255,255,255,0.06); padding: 3px 8px; border: 1px solid var(--border-subtle);">${escapeHtml(proj.category)}</span>
                </td>
                <td>${escapeHtml(proj.type || '—')}</td>
                <td>${escapeHtml(proj.year)} &bull; ${escapeHtml(proj.location || '—')}</td>
                <td>
                    <button type="button" class="btn-admin-action" data-action="up" data-idx="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>&uarr;</button>
                    <button type="button" class="btn-admin-action" data-action="down" data-idx="${idx}" ${idx === projects.length - 1 ? 'disabled style="opacity:0.3"' : ''}>&darr;</button>
                </td>
                <td style="text-align: right;">
                    <button type="button" class="btn-admin-action" data-action="edit" data-id="${escapeHtml(proj.id)}">Edit</button>
                    <button type="button" class="btn-admin-action danger" data-action="delete" data-id="${escapeHtml(proj.id)}">Delete</button>
                </td>
            `;
            adminProjectList.appendChild(tr);
        });

        attachTableEvents();
    }

    /**
     * Attach Project Table Action Listeners
     */
    function attachTableEvents() {
        adminProjectList.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                const id = btn.getAttribute('data-id');
                const idx = parseInt(btn.getAttribute('data-idx'), 10);

                if (action === 'toggle-kinetic') {
                    const proj = projects.find(p => p.id === id);
                    if (!proj) return;
                    const currentlyActive = projects.filter(p => p.inKinetic && p.id !== id).length;
                    if (!proj.inKinetic && currentlyActive >= 7) {
                        showToast('Maximum 7 projects allowed in Kinetic Reel! Uncheck another project first.');
                        return;
                    }
                    proj.inKinetic = !proj.inKinetic;
                    saveToLocal();
                    renderProjectsTable();
                    showToast(proj.inKinetic ? `"${proj.title}" added to Kinetic Reel (7 selected)` : `"${proj.title}" removed from Kinetic Reel`);
                } else if (action === 'delete') {
                    if (confirm('Are you sure you want to delete this project?')) {
                        projects = projects.filter(p => p.id !== id);
                        saveToLocal();
                        renderProjectsTable();
                        showToast('Project removed');
                    }
                } else if (action === 'edit') {
                    openEditModal(id);
                } else if (action === 'up' && idx > 0) {
                    const temp = projects[idx];
                    projects[idx] = projects[idx - 1];
                    projects[idx - 1] = temp;
                    saveToLocal();
                    renderProjectsTable();
                } else if (action === 'down' && idx < projects.length - 1) {
                    const temp = projects[idx];
                    projects[idx] = projects[idx + 1];
                    projects[idx + 1] = temp;
                    saveToLocal();
                    renderProjectsTable();
                }
            });
        });
    }

    /**
     * Populate Profile Form
     */
    function populateProfileForm() {
        if (!profileForm) return;
        document.getElementById('profName').value = profile.name || '';
        document.getElementById('profTitle').value = profile.title || '';
        document.getElementById('profTagline').value = profile.tagline || '';
        document.getElementById('profBio').value = profile.bio || '';
        document.getElementById('profExp').value = profile.yearsExperience || 0;
        document.getElementById('profProjects').value = profile.completedProjects || 0;
        document.getElementById('profAwards').value = profile.awardsCount || 0;
        document.getElementById('profEmail').value = (profile.contact && profile.contact.email) || '';
        document.getElementById('profPhone').value = (profile.contact && profile.contact.phone) || '';
        document.getElementById('profOffice').value = (profile.contact && profile.contact.office) || '';
    }

    /**
     * Save Profile Form
     */
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            profile.name = document.getElementById('profName').value;
            profile.title = document.getElementById('profTitle').value;
            profile.tagline = document.getElementById('profTagline').value;
            profile.bio = document.getElementById('profBio').value;
            profile.yearsExperience = parseInt(document.getElementById('profExp').value, 10) || 0;
            profile.completedProjects = parseInt(document.getElementById('profProjects').value, 10) || 0;
            profile.awardsCount = parseInt(document.getElementById('profAwards').value, 10) || 0;

            if (!profile.contact) profile.contact = {};
            profile.contact.email = document.getElementById('profEmail').value;
            profile.contact.phone = document.getElementById('profPhone').value;
            profile.contact.office = document.getElementById('profOffice').value;

            saveContent('profile', profile, 'Profile updated successfully!');
        });
    }

    /**
     * Open Modal to Add or Edit Project
     */
    function openEditModal(projectId = null) {
        projectEditForm.reset();

        if (projectId) {
            const proj = projects.find(p => p.id === projectId);
            if (!proj) return;
            modalProjectTitle.textContent = 'Edit Project: ' + proj.title;
            document.getElementById('editProjectId').value = proj.id;
            document.getElementById('fTitle').value = proj.title || '';
            document.getElementById('fSpine').value = proj.spine || '';
            document.getElementById('fCategory').value = proj.category || 'Architecture';
            document.getElementById('fType').value = proj.type || '';
            document.getElementById('fYear').value = proj.year || '';
            document.getElementById('fLocation').value = proj.location || '';
            document.getElementById('fArea').value = proj.area || '';
            document.getElementById('fClient').value = proj.client || '';
            document.getElementById('fMaterials').value = proj.materials || '';
            document.getElementById('fCoverImage').value = proj.coverImage || '';
            document.getElementById('fGalleryImages').value = (proj.galleryImages || []).join(', ');
            document.getElementById('fDescription').value = proj.description || '';
            document.getElementById('fDetails').value = proj.details || '';
            const inKineticEl = document.getElementById('fInKinetic');
            if (inKineticEl) inKineticEl.checked = !!proj.inKinetic;
        } else {
            modalProjectTitle.textContent = 'Add New Project';
            document.getElementById('editProjectId').value = '';
            document.getElementById('fYear').value = new Date().getFullYear();
            document.getElementById('fCoverImage').value = 'images/Project/Cesarino Puri/Cesarino Puri (1).png';
            const inKineticEl = document.getElementById('fInKinetic');
            if (inKineticEl) inKineticEl.checked = false;
        }

        projectModal.showModal();
    }

    /**
     * Handle Project Form Submission
     */
    if (projectEditForm) {
        projectEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('editProjectId').value;
            const title = document.getElementById('fTitle').value.trim();
            const spine = document.getElementById('fSpine').value.trim();
            const category = document.getElementById('fCategory').value;
            const type = document.getElementById('fType').value.trim();
            const year = document.getElementById('fYear').value.trim();
            const location = document.getElementById('fLocation').value.trim();
            const area = document.getElementById('fArea').value.trim();
            const client = document.getElementById('fClient').value.trim();
            const materials = document.getElementById('fMaterials').value.trim();
            const coverImage = document.getElementById('fCoverImage').value.trim();
            const galleryImagesStr = document.getElementById('fGalleryImages').value.trim();
            const galleryImages = galleryImagesStr ? galleryImagesStr.split(',').map(s => s.trim()) : [coverImage];
            const description = document.getElementById('fDescription').value.trim();
            const details = document.getElementById('fDetails').value.trim();
            const inKineticEl = document.getElementById('fInKinetic');
            const inKinetic = inKineticEl ? inKineticEl.checked : false;

            if (inKinetic) {
                const otherActive = projects.filter(p => p.inKinetic && p.id !== editId).length;
                if (otherActive >= 7) {
                    showToast('Maximum 7 projects allowed in Kinetic Reel! Uncheck another project first.');
                    return;
                }
            }

            if (editId) {
                // Update existing
                const proj = projects.find(p => p.id === editId);
                if (proj) {
                    proj.title = title;
                    proj.spine = spine;
                    proj.category = category;
                    proj.type = type;
                    proj.year = year;
                    proj.location = location;
                    proj.area = area;
                    proj.client = client;
                    proj.materials = materials;
                    proj.coverImage = coverImage;
                    proj.galleryImages = galleryImages;
                    proj.description = description;
                    proj.details = details;
                    proj.inKinetic = inKinetic;
                }
                showToast('Project updated');
            } else {
                // Create new
                const newId = 'proj-' + String(Date.now()).slice(-4);
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const newProj = {
                    id: newId,
                    slug: slug,
                    title: title,
                    spine: spine,
                    category: category,
                    type: type,
                    year: year,
                    location: location,
                    area: area,
                    client: client,
                    role: 'Lead Architect',
                    materials: materials,
                    coverImage: coverImage,
                    galleryImages: galleryImages,
                    description: description,
                    details: details,
                    inKinetic: inKinetic
                };
                projects.push(newProj);
                showToast('New project created!');
            }

            saveToLocal();
            renderProjectsTable();
            projectModal.close();
        });
    }

    if (btnAddNewProject) {
        btnAddNewProject.addEventListener('click', () => openEditModal());
    }

    if (btnCloseProjectModal) {
        btnCloseProjectModal.addEventListener('click', () => projectModal.close());
    }

    if (btnCancelModal) {
        btnCancelModal.addEventListener('click', () => projectModal.close());
    }

    /**
     * Persistence helpers
     */
    function saveToLocal() {
        saveContent('projects', projects);
    }

    /**
     * Attempt sync to local Python server if running
     */
    async function saveContent(key, data, message) {
        try {
            await window.portofwebDb.save(key, data);
            if (message) showToast(message);
        } catch (e) {
            showToast('Save failed: ' + e.message);
        }
    }

    // Save All Button
    if (btnSaveAll) {
        btnSaveAll.addEventListener('click', () => {
            saveToLocal();
            if (profileForm) {
                profileForm.requestSubmit();
            }
            showToast('Saving changes to Supabase...');
        });
    }

    /**
     * Sync projects with images/Project folder
     */
    async function syncImagesWithServer() {
        showToast('Syncing projects with images/Project...');
        let updatedProjects = null;

        try {
            const res = await fetch('/api/sync-projects', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                if (data.projects && Array.isArray(data.projects)) {
                    updatedProjects = data.projects;
                }
            }
        } catch (e) {
            console.warn('Local server sync endpoint unreachable:', e);
        }

        if (!updatedProjects) {
            try {
                const res = await fetch('data/projects.json?t=' + Date.now());
                if (res.ok) {
                    updatedProjects = await res.json();
                }
            } catch (err) {
                console.warn('Direct fetch failed:', err);
            }
        }

        if (updatedProjects && Array.isArray(updatedProjects)) {
            projects = updatedProjects;
            saveToLocal();
            renderProjectsTable();
            showToast(`Synchronized ${projects.length} projects with images!`);
        } else {
            showToast('Sync failed. Make sure python server.py is running.');
        }
    }

    // Sync Images Button
    if (btnSyncImages) {
        btnSyncImages.addEventListener('click', () => {
            syncImagesWithServer();
        });
    }

    // Export JSON
    if (btnExportJson) {
        btnExportJson.addEventListener('click', () => {
            downloadJsonFile('projects.json', projects);
            setTimeout(() => {
                downloadJsonFile('profile.json', profile);
            }, 300);
            showToast('Exported projects.json and profile.json');
        });
    }

    function downloadJsonFile(filename, data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import JSON
    if (importJsonInput) {
        importJsonInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (Array.isArray(parsed)) {
                        projects = parsed;
                        saveToLocal();
                        renderProjectsTable();
                        showToast(`Imported ${projects.length} projects successfully!`);
                    } else if (parsed.name && parsed.bio) {
                        profile = parsed;
                        saveContent('profile', profile);
                        populateProfileForm();
                        showToast('Imported profile data successfully!');
                    } else {
                        alert('Unrecognized JSON format. Must match projects array or profile object.');
                    }
                } catch (err) {
                    alert('Invalid JSON file: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
    }

    // Reset Defaults
    if (btnResetData) {
        btnResetData.addEventListener('click', async () => {
            if (confirm('Reset all project and profile data back to original defaults?')) {
                localStorage.removeItem('portofweb_projects');
                localStorage.removeItem('portofweb_profile');
                await initData();
                showToast('Reset back to factory defaults');
            }
        });
    }

    /**
     * Tabs logic
     */
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    const tabPanes = document.querySelectorAll('.admin-tab-pane');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Init
    document.addEventListener('DOMContentLoaded', async () => {
        const loginScreen = document.getElementById('loginScreen');
        const adminApp = document.getElementById('adminApp');
        const loginForm = document.getElementById('loginForm');
        const loginError = document.getElementById('loginError');
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        const loginSubmit = loginForm.querySelector('[type="submit"]');
        const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
        let idleTimer;
        let cmsActive = false;
        const endCmsSession = async () => {
            cmsActive = false;
            clearTimeout(idleTimer);
            adminApp.hidden = true;
            loginScreen.hidden = false;
            loginPassword.value = '';
            loginError.textContent = 'Signed out after 5 minutes of inactivity.';
            await window.portofwebDb.signOut();
        };
        const resetIdleTimer = () => {
            if (!cmsActive) return;
            clearTimeout(idleTimer);
            idleTimer = setTimeout(endCmsSession, IDLE_TIMEOUT_MS);
        };
        ['pointerdown', 'keydown', 'input', 'change', 'scroll'].forEach(eventName => {
            adminApp.addEventListener(eventName, resetIdleTimer, { passive: eventName === 'scroll' });
        });
        const openCms = async () => {
            loginScreen.hidden = true;
            adminApp.hidden = false;
            await initData();
            cmsActive = true;
            resetIdleTimer();
        };
        if (!window.portofwebDb.enabled) {
            loginScreen.hidden = false;
            loginError.textContent = 'Add your Supabase URL and anon key in js/supabase-config.js.';
            return;
        }
        if (await window.portofwebDb.session()) {
            await openCms();
        } else {
            loginScreen.hidden = false;
        }
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            loginError.textContent = '';
            loginSubmit.disabled = true;
            loginSubmit.textContent = 'Signing in...';
            try {
                await window.portofwebDb.signIn(loginEmail.value, loginPassword.value);
                await openCms();
            } catch (error) {
                loginError.textContent = /email not confirmed/i.test(error.message)
                    ? 'Confirm your Supabase account email, then sign in again.'
                    : error.message;
            } finally {
                loginSubmit.disabled = false;
                loginSubmit.textContent = 'Sign In';
            }
        });
    });
})();
