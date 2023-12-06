const express = require('express');
const cors = require('cors');
const app = express();

// Initialize an array to store URL objects
const urlDatabase = [];
let id = 1;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' directory
app.use('/public', express.static(`${process.cwd()}/public`));

// Endpoint to handle URL shortening
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  // Check if the URL is valid
  const urlPattern = /^(https?:\/\/)?(www\.)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
  if (!urlPattern.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Store the URL in the database
  const shortUrl = id++;
  urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

  // Respond with the original and short URLs
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to handle URL redirection
app.get('/api/shorturl/:shortUrl', function(req, res) {
  const { shortUrl } = req.params;

  // Find the corresponding original URL
  const urlEntry = urlDatabase.find(entry => entry.short_url == shortUrl);

  if (!urlEntry) {
    return res.status(404).json({ error: 'short url not found' });
  }

  // Redirect to the original URL
  res.redirect(urlEntry.original_url);
});

// Set up the server
const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
