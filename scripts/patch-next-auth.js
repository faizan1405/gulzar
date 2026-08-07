// Patch next-auth v5 beta to use the `.js` suffixes for the
// `next/headers`, `next/server`, `next/navigation` modules.
// Next.js 16 (in this project) only exposes those modules with the
// `.js` extension in their package export map. The official next-auth
// v5 line still references the bare specifiers, which causes a
// "Cannot find module 'next/headers'" server-side ESM error and
// surfaces in the UI as:
//   "Server Error: There is a problem with the server configuration."
//
// Runs automatically after `npm install` via the "postinstall" script
// in package.json. Idempotent — safe to run multiple times.

const fs = require('fs');
const path = require('path');

// Files inside next-auth that import from "next/*"
const targets = [
  'node_modules/next-auth/lib/index.js',
  'node_modules/next-auth/lib/env.js',
  'node_modules/next-auth/lib/actions.js',
];

// The modules next-auth imports that Next.js 16 only ships with a `.js` suffix.
const replacements = [
  { from: /from "next\/headers"/g, to: 'from "next/headers.js"' },
  { from: /from "next\/server"/g, to: 'from "next/server.js"' },
  { from: /from "next\/navigation"/g, to: 'from "next/navigation.js"' },
];

let patched = 0;
for (const rel of targets) {
  const file = path.resolve(__dirname, '..', rel);
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');
  const original = content;
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    patched += 1;
    console.log(`[patch-next-auth] patched ${rel}`);
  }
}

if (patched === 0) {
  console.log('[patch-next-auth] no changes needed');
} else {
  console.log(`[patch-next-auth] ${patched} file(s) patched`);
}