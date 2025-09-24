const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // Library for parsing HTML
const { URL } = require('url');

const app = express();
const port = 3000;

app.get('/get-favicon', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('URL query parameter is required.');
  }

  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.origin;

    // First, check the default location: /favicon.ico
    const defaultFaviconUrl = `${domain}/favicon.ico`;
    try {
      await axios.head(defaultFaviconUrl);
      return res.status(200).send(defaultFaviconUrl);
    } catch (e) {
      // If default favicon not found, parse the HTML
    }

    // Second, parse the HTML for a <link> tag
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const link = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');

    if (link) {
      const faviconUrl = new URL(link, domain).href;
      return res.status(200).send(faviconUrl);
    }

    // Third, fall back to a public service if nothing is found
    // This is a great, robust alternative to the above logic
    // const publicFaviconService = `https://s2.googleusercontent.com/s2/favicons?domain=${domain}`;
    // return res.status(200).send(publicFaviconService);

    res.status(404).send('Favicon not found.');

  } catch (error) {
    console.error('Error fetching favicon:', error);
    res.status(500).send('An error occurred while fetching the favicon.');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
