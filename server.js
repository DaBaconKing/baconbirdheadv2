const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Constants
const AUTH_HEADER = 'x-auth-code';
const AUTH_SECRET = 'MGEFDHGIERHGOIUE-/BACON4LIFE';
const ALLOWED_HOST = 'http.cat';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /`);
});

// 🧪 Ping
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// 🖼️ Favicon Snatcher
app.get('/api/favicon', async (req, res) => {
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

    const title = $('title').text().trim() || null;
    const description = $('meta[name="description"]').attr('content')?.trim() || null;

    res.json({ title, description, favicon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ title: null, description: null, favicon: null });
  }
});

// 📦 FilePuller3000v2 (Proxy with whitelist)
app.get('/api/filepull', async (req, res) => {
  const target = req.query.target;
  if (!target) return res.status(400).send('Missing target URL');

  try {
    const url = new URL(target);
    if (!/^https?:$/.test(url.protocol)) {
      return res.status(400).send('Only http/https URLs are allowed');
    }

    if (url.hostname !== ALLOWED_HOST) {
      return res.status(403).send('Domain not allowed');
    }

    const response = await fetch(url.href);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    res.set('content-type', contentType);
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching target URL');
  }
});

// 🧯 404 handler
app.use((req, res) => {
  res.redirect(`/error.html?errorcode=404`);
});

// 🧯 Error handler
app.use((err, req, res, next) => {
  const errorCode = err.status || 500;
  res.redirect(`/error.html?errorcode=${errorCode}`);
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🔥 BaconBot API running on port ${PORT}`);
});
