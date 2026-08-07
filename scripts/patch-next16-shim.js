/**
 * Patches next-auth v5 + Next.js 16 incompatibility.
 *
 * next-auth v5 references a vendored React contexts module under
 * `next/dist/server/route-modules/app-route/vendored/contexts/` that
 * Next.js 16 removed during its route-module restructuring.  Auth
 * routes fail to load with `MODULE_UNPARSABLE` until these files
 * exist, so this script writes the missing stubs.
 *
 * Re-run after every `npm install` that touches `next` or `next-auth`.
 */
const fs = require('node:fs');
const path = require('node:path');

const CONTEXT_DIR = path.join(
  process.cwd(),
  'node_modules',
  'next',
  'dist',
  'server',
  'route-modules',
  'app-route',
  'vendored',
  'contexts',
);

fs.mkdirSync(CONTEXT_DIR, { recursive: true });

const appRouterContext = `// Compatibility shim for Next.js 16 - written by scripts/patch-next16-shim.js
const _sym = (n) => Symbol(n);
export const GlobalLayoutRouterContext = _sym('global-layout-router-context');
export const LayoutRouterContext = _sym('layout-router-context');
export const TemplateContext = _sym('template-context');
export const ErrorBoundaryContext = _sym('error-boundary-context');
export const NotFoundBoundaryContext = _sym('not-found-boundary-context');
export const MissingSlotContext = _sym('missing-slot-context');
export const ServerInsertedHTMLContext = _sym('server-inserted-html-context');
export const AppRouterContext = _sym('app-router-context');
export const HeadManagerContext = _sym('head-manager-context');
export const AppSegmentContext = _sym('app-segment-context');
export const ActionQueueContext = _sym('action-queue-context');
export const RedirectBoundaryContext = _sym('redirect-boundary-context');
export const MetadataContext = _sym('metadata-context');
export const StaticGenerationContext = _sym('static-generation-context');
export const InterceptionRouteSpecificContext = _sym('interception-route-specific-context');
export const ScrollAndFocusContext = _sym('scroll-and-focus-context');
export const ViewportContext = _sym('viewport-context');
`;

const hooksClientContext = `// Compatibility shim - see scripts/patch-next16-shim.js
const _sym = (n) => Symbol(n);
export const HooksClientContext = _sym('hooks-client-context');
`;

const serverInsertedHtml = `// Compatibility shim - see scripts/patch-next16-shim.js
export { ServerInsertedHTMLContext } from './app-router-context.js';
`;

const files = {
  'app-router-context.js': appRouterContext,
  'hooks-client-context.js': hooksClientContext,
  'server-inserted-html.js': serverInsertedHtml,
};

let written = 0;
for (const [name, content] of Object.entries(files)) {
  const target = path.join(CONTEXT_DIR, name);
  fs.writeFileSync(target, content);
  written++;
}

console.log(`[patch-next16-shim] wrote ${written} shim file(s) to ${CONTEXT_DIR}`);