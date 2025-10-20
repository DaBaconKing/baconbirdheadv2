global.File = class {};

const express = require('express');
const path = require('path');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_HEADER = 'x-auth-code';
const AUTH_SECRET = 'MGEFDHGIERHGOIUE-/BACON4LIFE';

app.use(cors());

console.log("🔥 BaconBot server.js starting...");

// 🧪 Ping route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// 🖼️ Favicon snatcher
app.get('/api/siteinfo', async (req, res) => {
  console.log("🔥 /api/siteinfo route hit");
  const target = req.query.target;
  const auth = req.headers[AUTH_HEADER];

  if (!target) return res.status(400).json({ error: 'Missing target URL' });
  if (auth !== AUTH_SECRET) return res.status(403).json({ error: 'Unauthorized' });

  try {
    const url = new URL(target);
    if (!/^https?:$/.test(url.protocol)) {
      return res.status(400).json({ error: 'Only http/https URLs are allowed' });
    }

    const htmlRes = await fetch(url.href);
    if (!htmlRes.ok) throw new Error(`Failed to fetch: ${htmlRes.status}`);
    const html = await htmlRes.text();

    const $ = cheerio.load(html);
    const origin = `${url.protocol}//${url.hostname}`;

    const title = $('title').text().trim() || null;
    const description = $('meta[name="description"]').attr('content')?.trim() || null;
    
    const candidates = [
      $('link[rel="icon"]').attr('href'),
      $('link[rel="shortcut icon"]').attr('href'),
      $('link[rel="apple-touch-icon"]').attr('href'),
      `/favicon.ico`
    ].filter(Boolean);

    const resolved = candidates.map(href => {
      if (/^https?:\/\//.test(href)) return href;
      if (href.startsWith('//')) return `${url.protocol}${href}`;
      return `${origin}${href.startsWith('/') ? '' : '/'}${href}`;
    });

    let favicon = null;
    for (const iconURL of resolved) {
      try {
        const iconRes = await fetch(iconURL);
        if (iconRes.ok && iconRes.headers.get('content-type')?.includes('image')) {
          favicon = iconURL;
          break;
        }
      } catch (err) {
        console.warn(`Failed favicon: ${iconURL}`);
      }
    }

    if (!favicon) {
      favicon = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
    }

    res.json({ title, description, favicon });

  } catch (err) {
    console.error(err);
    res.status(500).json({ title: null, description: null, favicon: null });
  }
});

// 🧱 Static files AFTER API routes
app.use(express.static(path.join(__dirname, 'public')));

// 🤖 robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /`);
});

// 🧯 404 handler
app.use((req, res) => {
  res.redirect(`/error.html?errorcode=404`);
});

// 🔥 Error handler
app.use((err, req, res, next) => {
  const errorCode = err.status || 500;

  if (req.path.startsWith('/api/')) {
    console.error(`💥 API error at ${req.path}:`, err);
    res.status(errorCode).json({ error: `Internal error (${errorCode})` });
  } else {
    res.redirect(`/error.html?errorcode=${errorCode}`);
  }
});

console.log("🛠️ About to call app.listen...");
// start like a goood boyyy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🧠 BaconBot server running on port ${PORT}`);
});