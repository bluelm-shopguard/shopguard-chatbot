const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 8080;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Proxy API requests to the backend
app.use('/v1', createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: { '^/v1': '/v1' },
  onProxyReq: (proxyReq, req, res) => {
    // Log proxy request
    console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error');
  }
}));

// Serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'homepage.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API requests will be proxied to http://localhost:8000`);
});
