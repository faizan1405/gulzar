// Patch next-auth v5 beta to use next/server.js (Next.js 16 renamed the export).
// Runs automatically after `npm install` via the "postinstall" script in package.json.
const fs = require('fs');
const path = require('path');

const targets = [
  'node_modules/next-auth/lib/env.js',
  'node_modules/next-auth/lib/index.js',
];

let patched = 0;
for (const rel of targets) {
  const file = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  const updated = original.replace(/from "next\/server"/g, 'from "next/server.js"');
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf8');
    patched += 1;
    console.log(`[patch-next-auth] patched ${rel}`);
  }
}
if (patched === 0) {
  console.log('[patch-next-auth] no changes needed');
}
