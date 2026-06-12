import { expect, test } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testDir, '..', '..');

const projects = [
  {
    name: 'astro-app',
    title: 'Astro app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/astro-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/astro-app', 'build']],
        command: ['pnpm', ['--dir', 'src/astro-app', 'preview', '--host', '127.0.0.1']],
      },
    },
  },
  {
    name: 'bun-app',
    title: 'Bun app',
    modes: {
      production: {
        build: ['pnpm', ['--dir', 'src/bun-app', 'build']],
        static: { root: 'src/bun-app', html: 'index.html' },
      },
    },
  },
  {
    name: 'esbuild-app',
    title: 'ESBuild app',
    modes: {
      dev: {
        command: ['pnpm', ['--dir', 'src/esbuild-app', 'dev']],
        portArgs: (port) => [`--serve=127.0.0.1:${port}`],
      },
      production: {
        build: ['pnpm', ['--dir', 'src/esbuild-app', 'build']],
        static: { root: 'src/esbuild-app', html: 'index.html' },
      },
    },
  },
  {
    name: 'next-app',
    title: 'Next.js app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/next-app', 'dev', '--hostname', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/next-app', 'build']],
        static: { root: 'src/next-app/dist', html: 'index.html' },
      },
    },
  },
  {
    name: 'next-webpack-app',
    title: 'Next.js Webpack app',
    modes: {
      dev: {
        command: ['pnpm', ['--dir', 'src/next-webpack-app', 'dev', '--hostname', '127.0.0.1']],
      },
      production: {
        build: ['pnpm', ['--dir', 'src/next-webpack-app', 'build']],
        static: { root: 'src/next-webpack-app/dist', html: 'index.html' },
      },
    },
  },
  {
    name: 'parcel-app',
    title: 'Parcel app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/parcel-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/parcel-app', 'build']],
        static: { root: 'src/parcel-app/dist', html: 'index.html' },
      },
    },
  },
  {
    name: 'react-router-app',
    title: 'React Router app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/react-router-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/react-router-app', 'build']],
        command: ['pnpm', ['--dir', 'src/react-router-app', 'start', '--host', '127.0.0.1']],
      },
    },
  },
  {
    name: 'rolldown-app',
    title: 'Rolldown app',
    modes: {
      production: {
        build: ['pnpm', ['--dir', 'src/rolldown-app', 'build']],
        static: { root: 'src/rolldown-app', html: 'index.html' },
      },
    },
  },
  {
    name: 'rollup-app',
    title: 'Rollup app',
    modes: {
      production: {
        build: ['pnpm', ['--dir', 'src/rollup-app', 'build']],
        static: { root: 'src/rollup-app', html: 'index.html' },
      },
    },
  },
  {
    name: 'rsbuild-app',
    title: 'Rsbuild app',
    modes: {
      dev: {
        command: ['pnpm', ['--dir', 'src/rsbuild-app', 'dev', '--host', '127.0.0.1']],
      },
      production: {
        build: ['pnpm', ['--dir', 'src/rsbuild-app', 'build']],
        command: ['pnpm', ['--dir', 'src/rsbuild-app', 'preview', '--host', '127.0.0.1']],
      },
    },
  },
  {
    name: 'rspack-app',
    title: 'Rspack app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/rspack-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/rspack-app', 'build']],
        static: { root: 'src/rspack-app/dist', html: 'index.html' },
      },
    },
  },
  {
    name: 'vite-app',
    title: 'Vite app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/vite-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/vite-app', 'build']],
        command: ['pnpm', ['--dir', 'src/vite-app', 'preview', '--host', '127.0.0.1']],
      },
    },
  },
  {
    name: 'vite-ssr-app',
    title: 'Vite SSR app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/vite-ssr-app', 'dev']] },
      production: {
        build: ['pnpm', ['--dir', 'src/vite-ssr-app', 'build']],
        command: ['pnpm', ['--dir', 'src/vite-ssr-app', 'preview']],
      },
    },
  },
  {
    name: 'vite-swc-app',
    title: 'Vite SWC app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/vite-swc-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/vite-swc-app', 'build']],
        command: ['pnpm', ['--dir', 'src/vite-swc-app', 'preview', '--host', '127.0.0.1']],
      },
    },
  },
  {
    name: 'webpack-4-app',
    title: 'Webpack 4 app',
    modes: {
      dev: {
        command: [
          'pnpm',
          ['--dir', 'src/webpack-4-app', 'dev', '--host', '127.0.0.1', '--no-open'],
        ],
      },
      production: {
        build: ['pnpm', ['--dir', 'src/webpack-4-app', 'build']],
        static: { root: 'src/webpack-4-app/dist', html: 'index.html' },
      },
    },
  },
  {
    name: 'webpack-5-app',
    title: 'Webpack 5 app',
    modes: {
      dev: { command: ['pnpm', ['--dir', 'src/webpack-5-app', 'dev', '--host', '127.0.0.1']] },
      production: {
        build: ['pnpm', ['--dir', 'src/webpack-5-app', 'build']],
        static: { root: 'src/webpack-5-app/dist', html: 'index.html' },
      },
    },
  },
];

let nextPort = 4100;

for (const project of projects) {
  test.describe(project.name, () => {
    for (const [mode, config] of Object.entries(project.modes)) {
      test(`${mode} renders and handles menu interaction`, async ({ page }, testInfo) => {
        const port = nextPort++;
        const browserLogs = [];

        page.on('console', (message) => {
          browserLogs.push(`[${message.type()}] ${message.text()}`);
        });
        page.on('pageerror', (error) => {
          browserLogs.push(`[pageerror] ${error.stack ?? error.message}`);
        });

        if (config.build) {
          await runCommand(config.build, testInfo);
        }

        const server = config.static
          ? await startStaticServer(config.static, port, testInfo)
          : await startCommandServer(config, port, testInfo);

        try {
          await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
          await expect(page).toHaveTitle(project.title);

          const fixture = page.getByTestId('base-ui-fixture');

          await expect(fixture.getByRole('button', { name: 'Menu' })).toBeVisible();
          await expect(fixture.getByText('No item selected')).toBeVisible();

          await fixture.getByRole('button', { name: 'Menu' }).click();
          await expect(page.getByRole('menuitem', { name: 'Item 2' })).toBeVisible();

          await page.getByRole('menuitem', { name: 'Item 2' }).click();
          await expect(fixture.getByText('Item 2 selected')).toBeVisible();
        } finally {
          if (browserLogs.length > 0) {
            await attachLog(testInfo, `browser-${port}.log`, browserLogs.join('\n'));
          }
          await server.close();
        }
      });
    }
  });
}

async function runCommand([command, args], testInfo) {
  const result = await new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      env: { ...process.env, CI: '1', NO_COLOR: '1' },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';

    child.stdout.on('data', (chunk) => {
      output += chunk;
    });
    child.stderr.on('data', (chunk) => {
      output += chunk;
    });
    child.on('close', (code) => resolve({ code, output }));
  });

  if (result.output) {
    await attachLog(testInfo, `${path.basename(args[1] ?? command)}-build.log`, result.output);
  }

  expect(result.code, result.output).toBe(0);
}

async function startCommandServer(config, port, testInfo) {
  const [command, args] = config.command;
  const portArgs = config.portArgs ? config.portArgs(port) : ['--port', String(port)];
  const fullArgs = [...args, ...portArgs];
  const child = spawn(command, fullArgs, {
    cwd: rootDir,
    env: { ...process.env, CI: '1', NO_COLOR: '1', PORT: String(port) },
    shell: false,
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  let output = '';

  child.stdout.on('data', (chunk) => {
    output += chunk;
  });
  child.stderr.on('data', (chunk) => {
    output += chunk;
  });

  await waitForServer(
    port,
    () => child.exitCode !== null,
    () => output,
  );

  return {
    async close() {
      await stopProcess(child);
      if (output) {
        await attachLog(testInfo, `${path.basename(args[1] ?? command)}-${port}.log`, output);
      }
    },
  };
}

async function startStaticServer(config, port, testInfo) {
  const root = path.join(rootDir, config.root);
  const html = config.html.endsWith('.html')
    ? await fs.promises.readFile(path.join(root, config.html), 'utf8')
    : config.html;

  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', `http://127.0.0.1:${port}`);
      const pathname = decodeURIComponent(url.pathname);

      if (pathname === '/') {
        send(response, 200, 'text/html', html);
        return;
      }

      const requestedPath = path.normalize(path.join(root, pathname));
      if (!requestedPath.startsWith(root) || !fs.existsSync(requestedPath)) {
        send(response, 404, 'text/plain', 'Not found');
        return;
      }

      send(response, 200, contentType(requestedPath), await fs.promises.readFile(requestedPath));
    } catch (error) {
      send(response, 500, 'text/plain', String(error));
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });

  return {
    async close() {
      server.closeIdleConnections?.();
      server.closeAllConnections?.();

      await Promise.race([
        new Promise((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
      await attachLog(testInfo, `static-${port}.log`, `Served ${root} on port ${port}`);
    },
  };
}

function send(response, status, type, body) {
  response.writeHead(status, { 'Content-Type': type });
  response.end(body);
}

function contentType(filePath) {
  switch (path.extname(filePath)) {
    case '.css':
      return 'text/css';
    case '.html':
      return 'text/html';
    case '.js':
      return 'text/javascript';
    case '.json':
      return 'application/json';
    case '.map':
      return 'application/json';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

async function waitForServer(port, hasExited, getOutput) {
  const deadline = Date.now() + 60_000;
  let lastError;

  while (Date.now() < deadline) {
    if (hasExited()) {
      throw new Error(`Server exited before it was reachable.\n\n${getOutput()}`);
    }

    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.status < 500) {
        return;
      }
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for port ${port}.\n${lastError ?? ''}\n\n${getOutput()}`);
}

async function stopProcess(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill('SIGTERM');

  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 5_000)).then(() => {
      if (child.exitCode === null) {
        child.kill('SIGKILL');
      }
    }),
  ]);
}

async function attachLog(testInfo, name, body) {
  await testInfo.attach(name, {
    body,
    contentType: 'text/plain',
  });
}
