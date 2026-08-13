// Copies the design system's stylesheets into dist/ alongside the compiled JS.
// styles.css is the single entry: it @imports tokens.css and components.css.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const files = ['styles.css', 'tokens.css', 'components.css'];

mkdirSync(join(root, 'dist'), { recursive: true });
for (const f of files) {
  copyFileSync(join(root, 'src', 'css', f), join(root, 'dist', f));
}
console.log(`copied ${files.length} stylesheets to dist/`);
