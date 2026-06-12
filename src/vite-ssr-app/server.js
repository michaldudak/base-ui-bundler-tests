import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const port = Number(process.env.PORT ?? 4173);
const root = import.meta.dirname;
const clientDir = path.join(root, 'dist/client');
const template = await fsp.readFile(path.join(clientDir, 'index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://localhost:${port}`);

  if (url.pathname.startsWith('/assets/')) {
    const assetPath = path.join(clientDir, url.pathname);
    if (assetPath.startsWith(path.join(clientDir, 'assets')) && fs.existsSync(assetPath)) {
      response.writeHead(200, {
        'Content-Type': contentTypes[path.extname(assetPath)] ?? 'application/octet-stream',
      });
      fs.createReadStream(assetPath).pipe(response);
      return;
    }
  }

  const html = template.replace('<!--ssr-outlet-->', render());
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end(html);
});

server.listen(port, () => {
  console.log(`Vite SSR fixture listening on http://localhost:${port}`);
});
