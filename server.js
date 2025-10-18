const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /`);
});

// API route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// 404 for unmatched routes
app.use((req, res) => {
  res.redirect(`/error.html?errorcode=404`);
});



// Error handler
app.use((err, req, res, next) => {
  const errorCode = err.status || 500;
  res.redirect(`/error.html?errorcode=${errorCode}`);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
