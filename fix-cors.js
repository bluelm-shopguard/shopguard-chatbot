/**
 * This script updates the API endpoint in system-settings.js to use the proxy server
 * Run this with: node fix-cors.js
 */

const fs = require('fs');
const path = require('path');

// Path to system-settings.js
const systemSettingsPath = path.join(__dirname, 'src', 'data', 'system-settings.js');

// Read the file
fs.readFile(systemSettingsPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  
  // Replace direct backend URL with proxy URL
  const updatedData = data.replace(
    /endpoint: "http:\/\/localhost:8000\/v1\/chat\/completions"/g, 
    'endpoint: "http://localhost:8080/v1/chat/completions"'
  );
  
  // Write the file back
  fs.writeFile(systemSettingsPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('API endpoint updated to use proxy server (localhost:8080)');
  });
});

// Create a CORS proxy server file if it doesn't exist
const proxyServerPath = path.join(__dirname, 'server.js');

// Check if server.js already exists
if (!fs.existsSync(proxyServerPath)) {
  // Create the proxy server file
  const proxyServerContent = `const express = require('express');
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
    console.log(\`Proxying request to: \${req.method} \${proxyReq.path}\`);
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
  console.log(\`Server running at http://localhost:\${PORT}\`);
  console.log(\`API requests will be proxied to http://localhost:8000\`);
});`;

  fs.writeFile(proxyServerPath, proxyServerContent, 'utf8', (err) => {
    if (err) {
      console.error('Error creating proxy server file:', err);
      return;
    }
    console.log('Proxy server file created');
  });
}

console.log('\nTo start the proxy server, run:');
console.log('  npm run proxy\n');
console.log('Make sure your backend server is running at http://localhost:8000');
