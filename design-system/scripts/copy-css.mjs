// Builds the design system's stylesheets into dist/.
//
// dist/styles.css is a FLAT concatenation of tokens + components, not a file of
// @imports: consumers (and the design-sync bundle) get the whole system from one
// stylesheet with no import waterfall. tokens.css and components.css ship
// alongside it for anyone who wants just one half.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'src', 'css');
const dist = join(root, 'dist');
const parts = ['tokens.css', 'components.css'];

mkdirSync(dist, { recursive: true });
for (const f of parts) copyFileSync(join(src, f), join(dist, f));

const flat = parts.map((f) => readFileSync(join(src, f), 'utf8')).join('\n');
writeFileSync(join(dist, 'styles.css'), flat);

console.log(`wrote dist/styles.css (${Math.round(flat.length / 1024)} KB) + ${parts.length} partials`);
