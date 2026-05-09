# QA Pro Automation Playground

A self-contained HTML/JS playground that intentionally reproduces the toughest real-world automation challenges — dynamic locators, nested iframes, shadow DOM, async rendering, flaky visibility, and more.

Built for QA engineers and SDETs who want to practise, test, or demo self-healing automation systems.

---

## Live URLs

| Version | URL | Purpose |
|---|---|---|
| **Dynamic** | `yoursite.netlify.app/` | Full chaos — random IDs, nested iframes, timers |
| **Stable** | `yoursite.netlify.app/stable` | Fixed locators — use this to create baseline tests |

> Replace `yoursite.netlify.app` with your actual Netlify domain.

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
├── index.html                  # Dynamic version (auto-deployed by Netlify)
├── server.js                   # Local dev server (not used on Netlify)
├── netlify.toml                # Netlify routing config
│
├── stable/
│   └── index.html              # Stable baseline version → served at /stable
│
├── css/
│   ├── env-simulator.css
│   └── frame-styles.css
│
├── js/
│   ├── dynamic-elements.js     # Chaos: random IDs, moving buttons, stale DOM
│   ├── dynamic-text.js         # Chaos: timers, counters, live timestamps
│   ├── iframe-loader.js        # Chaos: random frame IDs, attribute mutation
│   ├── iframe-context.js       # Chaos: auto-reload, spawn new iframes
│   ├── shadow-dom.js           # Chaos: shadow root rendering
│   └── environment-simulator.js # Controlled: env/locale/browser simulator
│
├── frames/
│   ├── level1.html             # iframe level 1 (contains level 2)
│   ├── level2.html             # iframe level 2 (contains level 3)
│   └── level3.html             # iframe level 3 (deepest)
│
└── assets/
    └── sampleFile.jpeg
```

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
| Form next-button | Randomly hidden among duplicates | All next buttons always visible |
| Chaos JS loaded | `dynamic-elements.js`, `iframe-loader.js`, `iframe-context.js`, `dynamic-text.js`, `shadow-dom.js` | None of these |

---

## Netlify Deployment

Deploys automatically on every push to `main`. No build command required.

The `netlify.toml` at the repo root handles routing:
- `/` → `index.html` (dynamic)
- `/stable` → `stable/index.html` (stable)

The `stable/index.html` contains `<base href="/">` so all shared CSS and JS resolve correctly from the site root.

---

## Recommended Testing Workflow

1. Open `/stable` → write and record your baseline test scripts
2. Run the same scripts against `/` (dynamic version)
3. Observe which locators break and whether your self-healing system recovers them
4. Iterate on your healing logic, repeat from step 2
