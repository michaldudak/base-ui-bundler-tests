import { expect, type Page, type TestInfo } from '@playwright/test';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command, ProjectMode, StaticServerConfig } from '../projects.js';

const supportDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(supportDir, '..', '..', '..');

let nextPort = 4100;

interface RunningServer {
  close: () => Promise<void>;
}

interface ServerContext {
  url: string;
}

export async function withProjectServer(
  {
    config,
    page,
    testInfo,
  }: {
    config: ProjectMode;
    page: Page;
    testInfo: TestInfo;
  },
  testBody: (context: ServerContext) => Promise<void>,
) {
  const port = nextPort++;
  const browserLogs = captureBrowserLogs(page);

  if (config.build) {
    await runCommand(config.build, testInfo);
  }

  const server = config.static
    ? await startStaticServer(config.static, port, testInfo)
    : await startCommandServer(config, port, testInfo);

  try {
    await testBody({ url: `http://127.0.0.1:${port}/` });
  } finally {
    if (browserLogs.length > 0) {
      await attachLog(testInfo, `browser-${port}.log`, browserLogs.join('\n'));
    }
    await server.close();
  }
}

function captureBrowserLogs(page: Page) {
  const browserLogs: string[] = [];

  page.on('console', (message) => {
    browserLogs.push(`[${message.type()}] ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    browserLogs.push(`[pageerror] ${error.stack ?? error.message}`);
  });

  return browserLogs;
}

async function runCommand([command, args]: Command, testInfo: TestInfo) {
  const result = await new Promise<{ code: number | null; output: string }>((resolve) => {
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

async function startCommandServer(
  config: ProjectMode,
  port: number,
  testInfo: TestInfo,
): Promise<RunningServer> {
  if (!config.command) {
    throw new Error('Command server config is missing a command.');
  }

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

async function startStaticServer(
  config: StaticServerConfig,
  port: number,
  testInfo: TestInfo,
): Promise<RunningServer> {
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

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve());
  });

  return {
    async close() {
      server.closeIdleConnections?.();
      server.closeAllConnections?.();

      await Promise.race([
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        }),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
      await attachLog(testInfo, `static-${port}.log`, `Served ${root} on port ${port}`);
    },
  };
}

function send(response: http.ServerResponse, status: number, type: string, body: string | Buffer) {
  response.writeHead(status, { 'Content-Type': type });
  response.end(body);
}

function contentType(filePath: string) {
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

async function waitForServer(port: number, hasExited: () => boolean, getOutput: () => string) {
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

async function stopProcess(child: ReturnType<typeof spawn>) {
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

async function attachLog(testInfo: TestInfo, name: string, body: string) {
  await testInfo.attach(name, {
    body,
    contentType: 'text/plain',
  });
}
