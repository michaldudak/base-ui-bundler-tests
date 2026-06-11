import fs from 'fs';
import glob from 'fast-glob';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface RunOptions {
  bundle: string;
  name?: string;
}

function run(options: RunOptions) {
  console.log(`Project: ${options.name ?? options.bundle}`);
  const files = glob.sync(options.bundle);
  if (files.length === 0) {
    console.error('No files found');
    return;
  }

  console.log(
    `Found ${files.length} file${files.length > 1 ? 's' : ''} matching the provided pattern.`,
  );

  let totalSize = 0;
  let hasUnnecessaryComponents = false;
  const unusedNamespaceParts = new Set<string>();
  let hasTabsPrehydrationScript = false;
  let hasSliderPrehydrationScript = false;

  files.forEach((file) => {
    const fileSize = fs.statSync(file).size / 1024;
    totalSize += fileSize;

    const fileContent = fs.readFileSync(file, 'utf-8');
    hasUnnecessaryComponents ||= fileContent.includes('PreviewCard');
    if (
      fileContent.includes('TabsPanel') ||
      fileContent.includes('tabpanel') ||
      fileContent.includes('data-hidden')
    ) {
      unusedNamespaceParts.add('Tabs.Panel');
    }
    if (fileContent.includes('SliderValue') || fileContent.includes('aria-live')) {
      unusedNamespaceParts.add('Slider.Value');
    }
    hasTabsPrehydrationScript ||= fileContent.includes(
      'document.currentScript.previousElementSibling',
    );
    hasSliderPrehydrationScript ||= fileContent.includes('currentScript?.parentElement');
  });

  console.log(`Bundle size: ${totalSize.toFixed().padStart(3)} kiB`);
  console.log(
    `Tree shaking: ${hasUnnecessaryComponents ? '🔴 includes unused components' : unusedNamespaceParts.size > 0 ? '🟡 includes unused namespace parts' : '🟢 all good'}`,
  );
  if (unusedNamespaceParts.size > 0) {
    console.log(`Unused namespace parts: ${Array.from(unusedNamespaceParts).join(', ')}`);
  }
  console.log(
    `Prehydration scripts: ${hasTabsPrehydrationScript || hasSliderPrehydrationScript ? '🔴 includes real script text' : '🟢 stubs only'}`,
  );
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
          demandOption: true,
        })
        .option('name', {
          description: 'Name of the project.',
        });
    },
    run,
  )
  .help()
  .strict(true)
  .version(false)
  .parse();
