/*
 * Copyright © 2026 Ahsan Ali Khan
 * QA Pro Playground
 * All Rights Reserved.
 *
 * Unauthorized copying, modification, distribution, reverse engineering,
 * or commercial use of this software is prohibited without prior written
 * permission from the copyright owner.
 *
 * Contact: ahsan.ali@webomates.com
 */

/**
 * QA Pro Automation Playground — Dev Server
 *
 * Both routes serve the same index.html.
 * The page detects its own URL and sets window.STABLE_MODE accordingly.
 *
 * Routes:
 *   /         → index.html  (window.STABLE_MODE = false — full chaos)
 *   /stable   → index.html  (window.STABLE_MODE = true  — stable baseline)
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

  /* ─── /stable route — serve the same index.html, URL stays /stable ── */
  if (urlPath === '/stable' || urlPath === '/stable/') {
    return serveFile(res, path.join(ROOT, 'index.html'));
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
