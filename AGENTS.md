# Coding Guidelines for LLM Agents

## Architecture Overview
This is a lightweight Architecture & Interior Design portfolio website with zero build steps and zero npm dependencies:
- Static HTML5 (`index.html`, `about.html`, `admin.html`)
- Unified CSS (`styles.css`)
- Modular vanilla JavaScript (`js/app.js`, `js/about.js`, `js/admin.js`)
- JSON data store (`data/projects.json`, `data/profile.json`)
- Python 3 local server (`server.py`)

## Token Efficiency Instructions
When pair programming or editing code:
1. **Targeted Diffs**: Never rewrite entire files. Provide only targeted replacement chunks.
2. **Consult `.cursorrules`**: Use the directory map to locate targets immediately without exploratory file searches.
3. **Keep Files Compact**:
   - Avoid adding large third-party dependencies.
   - Use native browser APIs (`<dialog>`, `IntersectionObserver`, `fetch`).
   - Group related CSS rules logically inside `styles.css`.

