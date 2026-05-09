/**
 * QA Pro Automation Playground — Dev Server
 *
 * Routes:
 *   /         → dynamic version (index.html + all chaos JS)
 *   /stable   → stable version  (stable/index.html — no dynamic JS, iframes inlined)
 *
 * Run:   node server.js
 * Then open:
 *   http://localhost:3000/         ← dynamic (chaos mode)
 *   http://localhost:3000/stable   ← stable  (baseline for tests)
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;   // folder that contains server.js

/* ── MIME types ─────────────────────────────────────────── */
const MIME = {
  '.html' : 'text/html; charset=utf-8',
  '.css'  : 'text/css',
  '.js'   : 'application/javascript',
  '.png'  : 'image/png',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.svg'  : 'image/svg+xml',
  '.ico'  : 'image/x-icon',
  '.json' : 'application/json',
  '.woff' : 'font/woff',
  '.woff2': 'font/woff2',
};

/* ── Serve a file, 404 on missing ───────────────────────── */
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found: ' + filePath);
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}

/* ── Request handler ────────────────────────────────────── */
const server = http.createServer((req, res) => {

  // Strip query string and decode URI
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  /* ─── /stable route ──────────────────────────────────── */
  if (urlPath === '/stable' || urlPath === '/stable/') {
    return serveFile(res, path.join(ROOT, 'stable', 'index.html'));
  }

  if (urlPath.startsWith('/stable/')) {
    // Assets requested by stable page (e.g. /stable/css/env-simulator.css)
    const relative = urlPath.slice('/stable/'.length);  // "css/env-simulator.css"
    const inStable = path.join(ROOT, 'stable', relative);
    const inRoot   = path.join(ROOT, relative);

    // Prefer a file inside stable/, fall back to the shared root asset
    fs.access(inStable, fs.constants.F_OK, (err) => {
      if (!err) return serveFile(res, inStable);
      serveFile(res, inRoot);
    });
    return;
  }

  /* ─── Default (dynamic) route ────────────────────────── */
  if (urlPath === '/') urlPath = '/index.html';

  serveFile(res, path.join(ROOT, urlPath));
});

/* ── Start ──────────────────────────────────────────────── */
server.listen(PORT, () => {
  console.log('\n🚀  QA Pro Automation Playground');
  console.log('─────────────────────────────────────────');
  console.log(`   Dynamic (chaos) → http://localhost:${PORT}/`);
  console.log(`   Stable baseline → http://localhost:${PORT}/stable`);
  console.log('─────────────────────────────────────────\n');
});
