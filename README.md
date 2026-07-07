<!--
  Copyright © 2026 Ahsan Ali Khan
  QA Pro Playground — All Rights Reserved.
  See LICENSE file for full terms.
-->

# QA Pro Automation Playground

> **⚠️ Proprietary Software — All Rights Reserved**
> QA Pro Playground is proprietary software owned exclusively by **Ahsan Ali Khan**.
> Unauthorized copying, distribution, modification, or commercial use is strictly prohibited.
> See [`LICENSE`](./LICENSE) for full terms.
> Contact: ahsan.ali.khan.tech@gmail.com

A self-contained HTML/JS playground that intentionally reproduces the toughest real-world automation challenges — dynamic locators, nested iframes, shadow DOM, async rendering, flaky visibility, and more.

Built for QA engineers and SDETs who want to practise, test, or demo self-healing automation systems.

---

## Live URLs

| Version | URL | Purpose |
|---|---|---|
| **Dynamic** | [qa-pro-playground-dev.netlify.app/](https://qa-pro-playground-dev.netlify.app/) | Full chaos — random IDs, nested iframes, timers |
| **Stable** | [qa-pro-playground-dev.netlify.app/stable](https://qa-pro-playground-dev.netlify.app/stable) | Fixed locators — use this to create baseline tests |

---

## Run Locally

Requires [Node.js](https://nodejs.org/) (no npm install needed — uses built-in modules only).

```bash
node server.js
```

Then open:
- `http://localhost:3000/` — dynamic version
- `http://localhost:3000/stable` — stable version

---

## Project Structure

```
/
├── index.html                          # Single source of truth — serves both dynamic and stable
├── server.js                           # Local dev server (not used on Netlify)
├── netlify.toml                        # Netlify routing — /stable rewrites to index.html
├── LICENSE                             # Proprietary — All Rights Reserved
├── NOTICE                              # Ownership declaration
├── .gitignore
├── locator-break-reproduction-guide.html  # 150-category manual test guide
│
├── css/
│   ├── env-simulator.css               # Styles for Environment Simulator section
│   └── frame-styles.css                # Styles for iframe/frame pages
│
├── js/
│   ├── dynamic-elements.js             # Chaos: random IDs, moving buttons, stale DOM
│   ├── dynamic-text.js                 # Chaos: timers, counters, live timestamps
│   ├── iframe-loader.js                # Chaos: random frame IDs, attribute mutation
│   ├── iframe-context.js               # Chaos: auto-reload, spawn new iframes
│   ├── shadow-dom.js                   # Chaos: shadow root rendering
│   ├── environment-simulator.js        # Controlled: env/locale/browser simulator
│   ├── new-scenarios.js                # Category B & C sections engine (MAP pattern)
│   ├── canvas-chart.js                 # Canvas-based chart rendering
│   ├── svg-graph.js                    # SVG graph rendering
│   ├── lazy-load.js                    # Lazy-load / intersection observer scenarios
│   └── level2-behavior.js              # Behaviour injected into iframe level 2
│
├── frames/
│   ├── frameset.html                   # Top-level frameset page
│   ├── fset-actions.html               # Frameset: actions panel
│   ├── fset-dashboard.html             # Frameset: dashboard panel
│   ├── fset-login.html                 # Frameset: login panel
│   ├── fset-table.html                 # Frameset: table panel
│   ├── level1.html                     # iframe level 1 (contains level 2)
│   ├── level2.html                     # iframe level 2 (contains level 3)
│   └── level3.html                     # iframe level 3 (deepest)
│
├── scenarios/
│   ├── INDEX.html                      # Scenario index / launcher
│   └── Scenario-NNN/                   # Individual scenario folders (005–119)
│
├── stable/
│   └── index.html                      # Stable mode entry point
│
├── selenium-tests/                     # Java + Maven Selenium test suite
│   ├── pom.xml
│   └── src/
│
└── assets/
    └── sampleFile.jpeg
```

> There is **no separate stable HTML file**. Both `/` and `/stable` serve the same `index.html`. The page detects its own URL and switches behaviour accordingly (see How Stable Mode Works below).

---

## Sections & What They Test

| Section | Dynamic challenge |
|---|---|
| **Dynamic Elements** | Button ID, class, text, colour, and position change on a timer |
| **Dynamic Tables** | Sortable/filterable table with column toggle and inline edit |
| **Forms** | Multi-step form with validation, subtabs, file upload, and review |
| **Slow & Disappearing** | Full-page spinner → random delay → data appears then disappears |
| **Alerts** | Custom + browser alerts with random delays |
| **Dynamic Text** | 13 output modes — counters, live time, status flows, random results |
| **iFrame** | 3 levels deep, auto-reload every 40s, frame ID randomised on each reload |
| **Shadow DOM** | 10 shadow root scenarios — open, closed, nested, dynamic, disappearing |
| **Environment Simulator** | Same UI renders differently per env / locale / browser / feature flag |
| **Framework-Style Attributes** | Vue/React auto-generated `data-v-*` and `__reactFiber$*` attrs rotate every 8s |
| **Toast Notifications** | Dynamic toast IDs, rapid-fire stacking, delayed triggers, persistent toasts |
| **Tooltips** | DOM-injected tooltips — appear/disappear, not in initial DOM |
| **Keyboard & Modal** | Keyboard shortcut triggers, modal with focus trap and dynamic content |
| **Drag & Drop** | Draggable tiles with `data-dragging` state attributes |
| **Canvas & SVG** | Canvas chart and SVG graph with dynamic node/edge attributes |
| **Lazy Load** | Intersection-observer-driven content — elements only exist after scroll |
| **Autocomplete** | 35s simulated API delay, per-keystroke debounce, `data-loading` state |
| **Tree View** | Collapsible nodes, `data-expanded` toggling, nested children |
| **Virtual List** | 10,000-row virtual scroll — only ~20 rows in DOM at any time |
| **Clipboard & File** | Clipboard read/write, hidden file input, drag-to-upload zone |
| **Network States** | Retry logic, `data-status` cycling through loading/success/error/retry |
| **Calendar / Date Picker** | Native and custom pickers, `data-selected-date` attribute updates |
| **Multi-Select & Dependent Dropdowns** | Native multi-select `data-selected`, custom chip multi-select, async Country→City, 3-level cascade |
| **Session-Based Attributes** | Login state ID swap, cart `data-cart-count`, role panel `data-current-role`, visit counter, session expiry timer |

---

## How Stable Mode Works

Both `/` and `/stable` serve the same `index.html`. The very first script in `<head>` sets a global flag:

```js
window.STABLE_MODE = window.location.pathname.startsWith('/stable');
```

Every JS file and inline script checks this flag before running any chaos. No build step, no separate file to maintain — add a feature once and it automatically works in both modes.

| File | What it does in stable mode |
|---|---|
| `dynamic-elements.js` | Skips `DynamicLab.init()` entirely |
| `dynamic-text.js` | Shows a fixed representative string per dropdown option — no timers |
| `iframe-loader.js` | Returns immediately — no attribute mutation or ID randomisation |
| `iframe-context.js` | Returns immediately — no auto-reload or frame spawning |
| `shadow-dom.js` | Uses a plain `<div>` instead of a shadow root for all 10 scenarios |
| `index.html` (inline) | Hides real `<iframe>` and shows inlined Level 1 / 2 / 3 content as divs |

---

## Stable vs Dynamic — Key Differences

The stable version (`/stable`) is **identical in structure and labels** to the dynamic version but with all chaos removed. Use it to write your baseline tests, then run the same tests against the dynamic version to verify your self-healing automation.

| What changes | Dynamic | Stable |
|---|---|---|
| Element IDs / classes | Randomised every few seconds | Fixed forever |
| Button labels | Randomly cycle through variants | Single fixed label |
| Delayed / disabled buttons | Hidden or disabled on load | Visible and enabled immediately |
| Duplicate buttons | Grow up to 6 then reset | One button only |
| Catch Me button | Moves around the screen at 600ms | Stays in place |
| iFrames | 3 levels deep, IDs change, auto-reload | Zero iframes — content inlined as `<div>` |
| Dynamic Text output | Timers, intervals, random values | Fixed representative string per mode |
| Shadow DOM | Actual shadow roots | Plain DOM elements, same labels |
| Form next-button (Stage 1) | Hidden until username + password fields are valid | Always **visible** — disabled until valid, never hidden |
| Form next-button (randomised) | Randomly hidden among duplicate buttons | All next buttons always visible |

---

## Netlify Deployment

Deploys automatically on every push. No build command required.

The `netlify.toml` rewrites both routes to the same `index.html`:
- `/` → dynamic mode (`window.STABLE_MODE = false`)
- `/stable` → stable mode (`window.STABLE_MODE = true`)

To add a new feature, edit `index.html` (HTML section + sidebar entry), add an init function to `js/new-scenarios.js`, and wire it into the MAP object.

---

## Legal

Copyright © 2026 Ahsan Ali Khan. All Rights Reserved.
This software is proprietary. See [`LICENSE`](./LICENSE) for full terms.
Contact: ahsan.ali.khan.tech@gmail.com