export type Command = readonly [command: string, args: readonly string[]];

export interface StaticServerConfig {
  html: string;
  root: string;
}

export interface ProjectMode {
  build?: Command;
  command?: Command;
  portArgs?: (port: number) => string[];
  static?: StaticServerConfig;
}

export interface BrowserProject {
  modes: Record<string, ProjectMode>;
  name: string;
  title: string;
}

export const projects: BrowserProject[] = [
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
