import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.FRONTEND_PORT || 8080;
const BACKEND_URL = 'http://localhost:3002';

console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);

const server = createServer(async (req, res) => {
  const url = req.url;
  
  // Proxy API requests to backend
  if (url.startsWith('/api') || url.startsWith('/uploads')) {
    try {
      const response = await fetch(`${BACKEND_URL}${url}`, {
        method: req.method,
        headers: req.headers
      });
      
      res.writeHead(response.status, response.headers);
      response.body.pipeTo(new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        }
      }));
    } catch (error) {
      res.writeHead(500);
      res.end('Backend not available');
    }
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, 'dist', url === '/' ? 'index.html' : url);
  
  // Handle client-side routing - if file doesn't exist, serve index.html
  if (!existsSync(filePath)) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }

  try {
    const content = await readFile(filePath);
    const ext = path.extname(filePath);
    
    // Set content type
    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    if (ext === '.json') contentType = 'application/json';
    if (ext === '.png') contentType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    if (ext === '.gif') contentType = 'image/gif';
    if (ext === '.svg') contentType = 'image/svg+xml';
    
    res.setHeader('Content-Type', contentType);
    res.writeHead(200);
    res.end(content);
  } catch (error) {
    res.writeHead(404);
    res.end('File not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Frontend server running on http://localhost:${PORT}`);
  console.log(`🔗 Proxying API requests to: ${BACKEND_URL}`);
  console.log(`📊 Backend status: ${BACKEND_URL}`);
});