# Owner Guide: Low-Token Local LLM Coding

Use this guide with Ollama, LM Studio, Cursor, Continue, Aider, or any local coding model. The goal is to give the model only the information needed for one small change.

## Read this first

- Read `.cursorrules` first. It is the shortest source of truth for file locations and coding rules.
- Make one task per prompt. Do not combine design, content, bug fixes, and deployment in one request.
- Ask for a targeted diff, never a whole-file rewrite.
- Tell the model which exact file and function or CSS selector it may change.

## Current live architecture

| Need | File / service |
| --- | --- |
| Home reel and grid | `index.html`, `js/app.js` |
| About page | `about.html`, `js/about.js` |
| Protected CMS | `admin.html`, `js/admin.js` |
| All styling | `styles.css` |
| Live project/profile data | Supabase table `site_content` |
| Supabase browser setup | `js/supabase-config.js`, `js/supabase.js` |
| SQL schema | `supabase/schema.sql` |
| Initial fallback/seed content | `data/projects.json`, `data/profile.json` |
| Static project images | `images/Project/<project name>/` |
| Hosting | GitHub Pages workflow: `.github/workflows/deploy-pages.yml` |

The public pages should read Supabase first. Do not add browser `localStorage` as a content source. Do not put the Supabase service-role key in any website file.

## Small prompt template

```text
Read .cursorrules. Change only [FILE], specifically [FUNCTION / SELECTOR].
Goal: [ONE clear result].
Keep the current vanilla JavaScript/CSS architecture.
Return only the targeted diff and a one-line verification step.
Do not read or rewrite unrelated files.
```

Examples:

```text
Read .cursorrules. In styles.css, change only the Grid Gallery card spacing.
Return only the CSS rules changed. Do not modify HTML or JavaScript.
```

```text
Read .cursorrules. In js/app.js, change only the Kinetic Reel maximum from 7 to 8.
Update matching validation text in js/admin.js and admin.html only. Return targeted diffs.
```

```text
Read .cursorrules. Add one project by editing data/projects.json only.
Do not reformat the rest of the array and do not touch images or code.
```

## Rules that save the most tokens

1. Never paste the full website, CSS file, image list, or JSON dataset into a prompt.
2. Ask the model to use `rg` for a precise search, then read only the matched section.
3. Limit changes to one to three files. If more files are needed, ask the model to explain why first.
4. For CSS, name the selector and the numbered CSS section.
5. For JavaScript, name the function and preserve the IIFE pattern and `escapeHtml()` for dynamic HTML.
6. For CMS changes, preserve Supabase calls through `window.portofwebDb`; do not create a second database client.
7. For a visual issue, provide one screenshot plus the target selector instead of asking the model to inspect every file.
8. Request one small browser check after the edit, not a full test suite unless behavior changed broadly.

## Avoid these prompts

| Avoid | Use instead |
| --- | --- |
| “Improve the whole website” | “In `styles.css`, make `.project-card` shadow softer.” |
| “Check all code for bugs” | “Check only `loadProjects()` for a Supabase loading error.” |
| “Rewrite the admin page” | “Add a logout button next to `#btnSaveAll`.” |
| “Make it faster” | “Reduce repeated fetches in `js/app.js`; do not change markup.” |

## Before publishing

Ask the model to run only these compact checks:

```text
1. rg for the old value/text that was replaced.
2. git diff --check.
3. Confirm `js/supabase-config.js` contains only the public URL and anon key.
4. Confirm GitHub Pages deployment completes after push.
```

Do not commit `.env` files, passwords, or Supabase service-role keys. The public anon key is expected in this static website.
