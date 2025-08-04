#!/usr/bin/env node

// Simple static file server for Cloudflare Pages
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'out');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let filePath = path.join(OUT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Handle SPA routing - serve index.html for non-file requests
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // If still not found, serve index.html (SPA fallback)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(OUT_DIR, 'index.html');
  }

  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ LogiAI server running on port ${PORT}`);
  console.log(`🚀 Serving static files from: ${OUT_DIR}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
