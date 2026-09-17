# Portfolio Owner Manual

## What this website includes

This is a static Architecture & Interior Design portfolio with three public-facing areas:

- `index.html` - the main Gallery. It has two ways to browse the same project collection:
  - **Kinetic Reel:** up to five selected projects appear as full-screen expanding image panels. Hover or tap a panel to reveal its summary; select **View Project** for the full project detail.
  - **Grid Gallery:** select **Grid Gallery** in the header to see every project as a card with its cover image, category, year, location, area, client, and short summary. Select any card to open its detail.
- **Project detail:** a pop-up window with the project category and typology, full image gallery, location, gross area, completion year, client, role, materials, design statement, and spatial/tectonic detail. Close it using the close button, Escape, or by selecting outside the window where supported.
- `about.html` - the studio profile: owner biography and practice statistics, architectural manifesto, services, software/BIM toolkit, credentials, contact details, and an inquiry form. The form currently shows a confirmation only; it does not send an email or save inquiries.
- `admin.html` - the content management page for projects and basic profile/contact information.

The navigation on every page links to the Gallery, About Detail, Contact section, and Admin CMS. On smaller screens, the navigation becomes a menu button.

## Managing projects

Open **Admin CMS** and use the **Projects Manager** tab.

- **Add New Project** opens a form for the project title, short spine title, category, typology, year, location, area, client, materials, cover image, gallery images, summary, and detail text.
- **Edit** changes an existing project. **Delete** removes it after confirmation. The reorder controls change the project order used by the grid and fallback reel.
- Enable **Feature in Kinetic Reel Showcase** to put a project in the Kinetic Reel. A maximum of five projects can be selected. If none are selected, the first five projects are used instead.
- Kinetic Reel selections update the Gallery immediately when returning from Admin CMS. If the Gallery is open in another browser tab, its reel updates automatically as well. Refresh the Gallery if it was already open in the same tab before entering Admin CMS.
- **Cover Image Path / URL** is the image shown in the reel and grid. **Additional Gallery Images** accepts comma-separated image paths; these are shown in the project detail. Use paths relative to the website, such as `images/Project/Project Name/image (1).png`.
- **Sync Images Folder** scans `images/Project/`, makes one project per folder, and sets the folder's images as its cover/gallery. It keeps metadata when it can match an existing project by folder, title, or slug. Use it after adding image folders; then review the generated project details in Admin CMS.

## Managing the About page

Use **About Profile Editor** in Admin CMS to change the displayed name, professional title, tagline, biography, practice statistics, public email, telephone, and studio location. Select **Update Profile Information** to save those fields.

The manifesto, services, toolkit, credentials, and social fields are stored in `data/profile.json` and are displayed on the About page, but are not editable in the current Admin form. Edit that JSON file directly, or export it, update it with a text editor, and import it again.

## Saving, backup, and local server

For edits to be written into the website files, start the local server from this folder:

```powershell
python server.py
```

Then open the printed local address (normally `http://localhost:3000/admin.html`). The server writes project changes to `data/projects.json` and profile changes to `data/profile.json`, and synchronizes projects with `images/Project/` when it starts.

Without the server, Admin CMS changes are saved only in that browser's local storage. This includes Kinetic Reel selections: they will work in that browser, but are not reliably shared, backed up, or published. Use **Save Changes** while the server is running.

- **Export JSON Files** downloads `projects.json` and `profile.json` as a backup.
- **Import JSON** accepts either a projects array or a profile object and applies it to the CMS. Run the server and save afterward if the import should update the files on disk.
- **Reset Defaults** clears the browser's local copy and reloads the current JSON files; it does not restore an earlier version of files that were already saved to disk.

## Where content lives

| Content | Location |
| --- | --- |
| Project information and reel selection | `data/projects.json` |
| Profile, manifesto, services, toolkit, credentials, contact details | `data/profile.json` |
| Project photos | `images/Project/<project folder>/` |
| Gallery behaviour and project-detail window | `js/app.js` |
| About-page data and inquiry confirmation | `js/about.js` |
| Admin CMS behaviour | `js/admin.js` |
| Visual styling | `styles.css` |

## Publishing checklist

1. Start the server, sync images if necessary, and complete project/profile edits.
2. Export both JSON files as a backup.
3. Check the Kinetic Reel, Grid Gallery, project detail pop-ups, About page, and mobile navigation.
4. Upload the full site, including `data/` and `images/`, to the hosting service. The Python server is intended for local editing; typical static hosting only needs the HTML, CSS, JavaScript, JSON, and image files.
