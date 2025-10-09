  const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve robots.txt explicitly
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /`);
});

// Example API route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res, next) => {
  const requestedPath = req.path;

  // If it's a known static file, skip to static handler
  if (requestedPath.endsWith('.html') || requestedPath.endsWith('.css') || requestedPath.endsWith('.js')) {
    return next();
  }

  // Otherwise, serve index.html for SPA routing
  res.sendFile(path.join(__dirname, 'public/index.html'), err => {
    if (err) next(err);
  });
});

// 404 handler — unmatched routes
app.use((req, res) => {
  res.redirect(`/error.html?errorcode=404`);
});

// Error handler — thrown errors
app.use((err, req, res, next) => {
  const errorCode = err.status || 500;
  res.redirect(`/error.html?errorcode=${errorCode}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
