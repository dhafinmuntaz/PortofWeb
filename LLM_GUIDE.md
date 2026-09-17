# Token-Efficient Coding & Editing with Local LLMs

This guide explains how this codebase is architected so that your **local coding LLM** (such as Qwen 2.5-Coder, DeepSeek-Coder, Llama 3 / CodeLlama via Ollama, LM Studio, Cursor, Continue.dev, or Aider) uses **80–90% fewer context tokens** when reading, editing, and writing code.

---

## 1. How the Codebase Minimizes Context Window Usage

When coding with local models (typically constrained to 8k–16k context and slower inference on consumer GPUs), large monolithic files cause context overflow, high latency, and hallucinations.

Here is how this project is structured for maximum local LLM efficiency:

| Architectural Optimization | Why It Saves Local LLM Tokens |
|---|---|
| **Zero Dead Code** | Removed 400+ lines of legacy CSS and unused template scripts. Every line in the repo serves an active function. |
| **Unified, Sectioned CSS (`styles.css`)** | Instead of scanning multiple 16KB stylesheets, styles are consolidated into 10 numbered sections. Your local LLM can target `Section 3 (Header & Nav)` without ingesting other sections. |
| **Isolated Vanilla JS Modules** | Logic is partitioned into `js/app.js` (gallery), `js/about.js` (profile), and `js/admin.js` (CMS). An LLM modifying gallery behavior only loads `app.js` (~1,200 tokens), never the admin code. |
| **Semantic, Clean HTML** | Lightweight markup with zero nested `<div>` soup. `index.html` is only ~800 tokens, meaning the LLM can read the entire DOM structure instantly. |
| **Decoupled Data (`data/*.json`)** | When editing portfolio content, the LLM modifies JSON files (~80 tokens) instead of rewriting HTML structures (~3,500 tokens). |
| **Pre-Configured Context (`.cursorrules` & `AGENTS.md`)** | Directly instructs your local model to output minimal replacement diffs rather than wasting time and tokens regurgitating entire files. |

---

## 2. File Map for Local Coding LLMs

Whenever you prompt your local coding LLM, point it directly to the target file:

```text
PortofWeb/
├── .cursorrules          <-- Read automatically by Cursor/Continue/Aider
├── AGENTS.md             <-- Instructions for AI coding assistants
├── index.html            <-- Main gallery markup (Kinetic Reel + Grid)
├── about.html            <-- Editorial architect profile & contact
├── admin.html            <-- CMS dashboard markup
├── styles.css            <-- Single stylesheet (Sections 1-10)
├── js/
│   ├── app.js            <-- Gallery rendering, kinetic reel, modal dialog
│   ├── about.js          <-- Profile dynamic hydration
│   └── admin.js          <-- Admin CRUD, save, export, import
├── data/
│   ├── projects.json     <-- Architecture project database
│   └── profile.json      <-- Architect bio, philosophy, credentials
└── server.py             <-- Local Python server with disk sync
```

---

## 3. Best Prompting Patterns for Local Coding LLMs

To conserve tokens and speed up local inference, use these targeted prompt patterns:

### Example A: Editing Styles
> **Prompt**: *"In `styles.css` Section 3, make the `.nav a` button padding slightly more compact and change the active background to a darker accent. Output ONLY the modified CSS rule."*  
> **Token Cost**: ~120 tokens total (vs 3,000+ tokens if the model rewrites the stylesheet).

### Example B: Modifying JS Logic
> **Prompt**: *"In `js/app.js`, update the `openProjectDialog` function to display the gross area before the location. Provide only the updated function."*  
> **Token Cost**: ~180 tokens total.

### Example C: Updating the Layout
> **Prompt**: *"In `index.html`, add an aria-label to the filter pills container. Output only the updated line."*  
> **Token Cost**: ~50 tokens total.

---

## 4. Section Anchors in `styles.css`

When editing CSS with a local LLM, reference these section numbers in your prompt:
- **Section 1**: Design Tokens & Variables (`:root`)
- **Section 2**: Reset & Base Typography
- **Section 3**: Proportional Header & Navbar
- **Section 4**: Top View Switcher & Category Filters
- **Section 5**: Kinetic Reel Showcase (Horizontal Panels)
- **Section 6**: Grid Gallery View & Cards
- **Section 7**: Project Detail Modal (`<dialog>`)
- **Section 8**: About Me Detail Layout
- **Section 9**: Admin CMS Dashboard
- **Section 10**: Responsive Breakpoints
