# Peapod Calculator Tool

Educational MCA lender qualification estimator with weighted underwriting confidence scoring.

## Run locally

ES modules and `fetch()` require a local HTTP server (opening `index.html` directly will not load lender data).

```bash
npx serve .
```

Then open the URL shown (typically `http://localhost:3000`).

## GitHub Pages

Deployed under a project subdirectory (e.g. `https://peapodfinance.github.io/Version2.0/`):

- `BASE_PATH` in `js/constants.js` resolves asset URLs to `/Version2.0/data/...`
- A `<base href>` tag in `index.html` fixes CSS/JS module paths when the URL has no trailing slash

## Architecture

```
peapod-calculator/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js              # Entry point, form handling
│   ├── scoringEngine.js    # Weighted score calculation
│   ├── lenderService.js    # JSON loading, sorting
│   ├── uiRenderer.js       # DOM rendering
│   ├── explanationEngine.js
│   ├── utils.js
│   └── constants.js
├── data/lenders.json
└── components/disclaimer.html
```

## Scoring

- Minimum metrics: `min(applicant / required, 1.25)`
- NSFs: `min(required / max(applicant, 1), 1.25)`
- Industry restricted: score capped at 35
- Categories: Strong (90+), Likely (75–89), Possible (60–74), Unlikely (0–59)

## Regenerate lender data

```bash
node scripts/generate-lenders.mjs
```
