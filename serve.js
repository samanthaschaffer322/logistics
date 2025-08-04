#!/usr/bin/env node

// Simple static file server for Cloudflare Pages with HTTPS redirect
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
  // Add security headers
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Handle HTTPS redirect for production
  const forwardedProto = req.headers['x-forwarded-proto'];
  if (forwardedProto && forwardedProto !== 'https' && process.env.NODE_ENV === 'production') {
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    res.writeHead(301, { Location: httpsUrl });
    res.end();
    return;
  }

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
        // Serve 404 page if available, otherwise generic 404
        const notFoundPath = path.join(OUT_DIR, '404.html');
        if (fs.existsSync(notFoundPath)) {
          fs.readFile(notFoundPath, (err, notFoundContent) => {
            if (!err) {
              res.writeHead(404, { 'Content-Type': 'text/html' });
              res.end(notFoundContent, 'utf-8');
            } else {
              res.writeHead(404);
              res.end('Page not found');
            }
          });
        } else {
          res.writeHead(404);
          res.end('Page not found');
        }
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
  console.log(`🔒 Security headers enabled`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Server shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
