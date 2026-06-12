import fs from 'fs';
import glob from 'fast-glob';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface RunOptions {
  bundle?: string;
  html?: string;
  name?: string;
  workspace?: boolean;
}

interface AnalysisResult {
  files: number;
  name: string;
  source: string;
  size: number;
  treeShaking: TreeShakingResult;
}

const TreeShakingResult = {
  AllGood: Symbol('AllGood'),
  WithUnusedParts: Symbol('WithUnusedParts'),
  WithUnusedComponents: Symbol('WithUnusedComponents'),
  NoFilesFound: Symbol('NoFilesFound'),
} as const;

type TreeShakingResult = (typeof TreeShakingResult)[keyof typeof TreeShakingResult];

function analyzeFiles(options: {
  cwd?: string;
  files: string[];
  name?: string;
  source: string;
}): AnalysisResult {
  const files = Array.from(new Set(options.files)).sort();
  let totalSize = 0;
  let hasUnnecessaryComponents = false;
  let hasUnnecessaryParts = false;

  files.forEach((file) => {
    const filePath = options.cwd ? path.join(options.cwd, file) : file;
    const fileSize = fs.statSync(filePath).size / 1024;
    totalSize += fileSize;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    hasUnnecessaryComponents ||= fileContent.includes('PreviewCard');
    hasUnnecessaryParts ||= fileContent.includes('MenuCheckboxItem');
  });

  return {
    files: files.length,
    name: options.name ?? options.source,
    source: options.source,
    size: totalSize,
    treeShaking:
      files.length === 0
        ? TreeShakingResult.NoFilesFound
        : hasUnnecessaryComponents
          ? TreeShakingResult.WithUnusedComponents
          : hasUnnecessaryParts
            ? TreeShakingResult.WithUnusedParts
            : TreeShakingResult.AllGood,
  };
}

function analyzeBundle(options: { bundle: string; cwd?: string; name?: string }): AnalysisResult {
  return analyzeFiles({
    cwd: options.cwd,
    files: glob.sync(options.bundle, { cwd: options.cwd }),
    name: options.name,
    source: options.bundle,
  });
}

function formatTreeShaking(result: TreeShakingResult) {
  switch (result) {
    case TreeShakingResult.AllGood:
      return '🟢 All good';
    case TreeShakingResult.WithUnusedParts:
      return '🟡 Includes unused component parts';
    case TreeShakingResult.WithUnusedComponents:
      return '🔴 Includes unused components';
    case TreeShakingResult.NoFilesFound:
      return '⚪ No files found';
  }
}

function extractOption(script: string, option: 'bundle' | 'html' | 'name') {
  const match = script.match(new RegExp(`--${option}(?:=|\\s+)(?:"([^"]*)"|'([^']*)'|(\\S+))`));
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function getAttribute(tag: string, attribute: string) {
  const match = tag.match(
    new RegExp(`\\s${attribute}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+)))?`, 'i'),
  );
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? (match ? '' : undefined);
}

function resolveHtmlAsset(options: { asset: string; cwd?: string; htmlFile: string }) {
  const cleanAsset = options.asset.split(/[?#]/)[0];
  if (
    cleanAsset === '' ||
    cleanAsset.startsWith('http://') ||
    cleanAsset.startsWith('https://') ||
    cleanAsset.startsWith('data:') ||
    cleanAsset.startsWith('blob:')
  ) {
    return undefined;
  }

  const htmlDir = path.dirname(options.htmlFile);
  const siteRoot = htmlDir;
  const assetPath = cleanAsset.startsWith('/')
    ? path.join(siteRoot, cleanAsset)
    : path.join(htmlDir, cleanAsset);

  return path.normalize(assetPath);
}

function collectStaticImportDependencies(options: {
  cwd?: string;
  file: string;
  files: Set<string>;
}) {
  const filePath = options.cwd ? path.join(options.cwd, options.file) : options.file;
  if (!fs.existsSync(filePath)) {
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const importPatterns = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\bimport\s*["']([^"']+)["']/g,
  ];

  importPatterns.forEach((pattern) => {
    for (const match of fileContent.matchAll(pattern)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) {
        continue;
      }

      const dependencyPath = path.normalize(path.join(path.dirname(options.file), specifier));
      if (!dependencyPath.endsWith('.js') || options.files.has(dependencyPath)) {
        continue;
      }

      options.files.add(dependencyPath);
      collectStaticImportDependencies({
        cwd: options.cwd,
        file: dependencyPath,
        files: options.files,
      });
    }
  });
}

function collectHtmlScripts(options: { cwd?: string; html: string }) {
  const htmlFiles = glob.sync(options.html, { cwd: options.cwd });
  const scriptFiles = new Set<string>();

  htmlFiles.forEach((htmlFile) => {
    const htmlPath = options.cwd ? path.join(options.cwd, htmlFile) : htmlFile;
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    const tags = htmlContent.match(/<script\b[^>]*>|<link\b[^>]*>|<astro-island\b[^>]*>/gi) ?? [];

    tags.forEach((tag) => {
      if (tag.startsWith('<script')) {
        if (getAttribute(tag, 'nomodule') !== undefined) {
          return;
        }

        const src = getAttribute(tag, 'src');
        if (!src) {
          return;
        }

        const scriptFile = resolveHtmlAsset({ asset: src, cwd: options.cwd, htmlFile });
        if (scriptFile) {
          scriptFiles.add(scriptFile);
        }
        return;
      }

      if (tag.startsWith('<link')) {
        const rel = getAttribute(tag, 'rel');
        const as = getAttribute(tag, 'as');
        if (rel !== 'modulepreload' && !(rel === 'preload' && as === 'script')) {
          return;
        }

        const href = getAttribute(tag, 'href');
        if (!href) {
          return;
        }

        const scriptFile = resolveHtmlAsset({ asset: href, cwd: options.cwd, htmlFile });
        if (scriptFile) {
          scriptFiles.add(scriptFile);
        }
        return;
      }

      ['before-hydration-url', 'component-url', 'renderer-url'].forEach((attribute) => {
        const asset = getAttribute(tag, attribute);
        if (!asset) {
          return;
        }

        const scriptFile = resolveHtmlAsset({ asset, cwd: options.cwd, htmlFile });
        if (scriptFile) {
          scriptFiles.add(scriptFile);
        }
      });
    });
  });

  Array.from(scriptFiles).forEach((file) => {
    collectStaticImportDependencies({
      cwd: options.cwd,
      file,
      files: scriptFiles,
    });
  });

  return Array.from(scriptFiles);
}

function analyzeHtml(options: { cwd?: string; html: string; name?: string }) {
  return analyzeFiles({
    cwd: options.cwd,
    files: collectHtmlScripts({ cwd: options.cwd, html: options.html }),
    name: options.name,
    source: options.html,
  });
}

function printTable(results: AnalysisResult[]) {
  console.table(
    results.map((result) => ({
      Project: result.name,
      Files: result.files,
      Size: result.files === 0 ? '-' : `${result.size.toFixed()} kiB`,
      'Tree shaking': formatTreeShaking(result.treeShaking),
    })),
  );
}

function runWorkspace() {
  const packageJsonFiles = glob.sync('src/*/package.json');
  const results = packageJsonFiles
    .flatMap((packageJsonFile) => {
      const packageDir = path.dirname(packageJsonFile);
      const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, 'utf-8'));
      const analyzeScript = packageJson.scripts?.['analyze-bundle'];
      if (!analyzeScript) {
        return [];
      }

      const html = extractOption(analyzeScript, 'html');
      const bundle = extractOption(analyzeScript, 'bundle');
      if (!html && !bundle) {
        throw new Error(`Could not find --bundle or --html in ${packageJsonFile}`);
      }

      const analyzeOptions = {
        cwd: packageDir,
        name: extractOption(analyzeScript, 'name') ?? packageJson.name,
      };

      return html
        ? analyzeHtml({
            ...analyzeOptions,
            html,
          })
        : analyzeBundle({
            ...analyzeOptions,
            bundle: bundle!,
          });
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  printTable(results);
}

function run(options: RunOptions) {
  if (options.workspace) {
    runWorkspace();
    return;
  }

  if (!options.bundle && !options.html) {
    throw new Error('Missing required argument: bundle or html');
  }

  const result = options.html
    ? analyzeHtml({
        html: options.html,
        name: options.name,
      })
    : analyzeBundle({
        bundle: options.bundle!,
        name: options.name,
      });

  console.log(`Project: ${result.name}`);
  if (result.files === 0) {
    console.error('No JavaScript files found');
    return;
  }

  console.log(
    `Found ${result.files} JavaScript file${result.files > 1 ? 's' : ''} from ${result.source}.`,
  );

  console.log(`Bundle size: ${result.size.toFixed().padStart(3)} kiB`);
  console.log(`Tree shaking: ${formatTreeShaking(result.treeShaking)}`);
}

yargs(hideBin(process.argv))
  .command<RunOptions>(
    '$0',
    'Analyzes a bundle file',
    (command) => {
      return command
        .option('bundle', {
          description: 'Path or glob to the built bundle file(s).',
          type: 'string',
        })
        .option('html', {
          description:
            'Path or glob to built HTML file(s) whose referenced JavaScript should be measured.',
          type: 'string',
        })
        .option('name', {
          description: 'Name of the project.',
        })
        .option('workspace', {
          description: 'Analyze all workspace package analyze-bundle scripts and print a table.',
          type: 'boolean',
          default: false,
        });
    },
    run,
  )
  .help()
  .strict(true)
  .version(false)
  .parse();
