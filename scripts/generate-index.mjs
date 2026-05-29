import fs from 'fs';
import path from 'path';

const outDir = path.resolve('dist', 'client');
const assetsDir = path.join(outDir, 'client', 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error('assets directory not found:', assetsDir);
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const jsFile = files.find((f) => /^index-.*\.js$/.test(f) || /^main-.*\.js$/.test(f));
const cssFile = files.find((f) => /^styles-.*\.css$/.test(f));

if (!jsFile) {
  console.error('Could not find main JS file in', assetsDir);
  process.exit(1);
}

const relJs = path.posix.join('client', 'assets', jsFile);
const relCss = cssFile ? path.posix.join('client', 'assets', cssFile) : null;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>FlowBudget</title>
    ${relCss ? `<link rel="stylesheet" href="./${relCss}">` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./${relJs}"></script>
  </body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), html);
console.log('Wrote', path.join(outDir, 'index.html'));
