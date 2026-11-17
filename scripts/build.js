// Builds dist/ from js/ and scss/ (replaces the old gulp pipeline).
//
//   scss/console-style.scss -> dist/css/console-style.css       (expanded)
//                           -> dist/css/console-style.min.css   (compressed)
//   js/helpers.js + js/cl.js + js/main.js
//                           -> dist/js/console.js               (concatenated into one IIFE, min CSS inlined at the placeholder)
//                           -> dist/js/console.min.js           (terser)
//
// Usage: `npm run build` (once) or `npm run watch` (rebuild on change).

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const sass = require('sass');
const { minify } = require('terser');

const root = path.join(__dirname, '..');
const p = (...parts) => path.join(root, ...parts);

// The files in js/ are fragments, not modules: they are concatenated in this
// order inside a single IIFE and share its scope. main.js runs at load time and
// uses the objects the other two define, so it must stay last.
const PARTS = ['helpers.js', 'cl.js', 'main.js'];

const PLACEHOLDER = '{{consoleLogStyles}}';

// License notice prepended to both dist/js files, so it travels with the file
// people load from a CDN. Keep the copyright line in sync with LICENSE.
const BANNER = '/*! Console.Log - ISC License - Copyright (c) 2014-2026 Michael Levy and contributors */';

async function build() {
  fs.mkdirSync(p('dist/css'), { recursive: true });
  fs.mkdirSync(p('dist/js'), { recursive: true });

  // CSS
  const scss = p('scss/console-style.scss');
  const css = sass.compile(scss, { style: 'expanded' }).css;
  const minCss = sass.compile(scss, { style: 'compressed' }).css.trim();

  fs.writeFileSync(p('dist/css/console-style.css'), css);
  fs.writeFileSync(p('dist/css/console-style.min.css'), minCss);

  // JS: concatenate the parts inside one IIFE, then inline the minified CSS
  // where the sources have the placeholder.
  const source = '(function() {\n' +
    PARTS.map(function(name) {
      return fs.readFileSync(p('js', name), 'utf8').trimEnd();
    }).join('\n\n') +
    '\n\n})();\n';

  if (!source.includes(PLACEHOLDER)) {
    throw new Error('Placeholder ' + PLACEHOLDER + ' not found in js/' + PARTS.join(', js/'));
  }

  // The placeholder sits inside a single-quoted JS string, so the CSS must be
  // escaped for it (a quote or backslash in the CSS would otherwise break the string).
  const literal = minCss
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n');
  const built = source.replace(PLACEHOLDER, () => literal);

  // Fail the build if the inlined result isn't valid JS (parses only, doesn't run it).
  new vm.Script(built, { filename: 'dist/js/console.js' });

  fs.writeFileSync(p('dist/js/console.js'), BANNER + '\n' + built);

  // `directives: false` keeps the lone '[native code]' string statement in the
  // CL.funcs stubs. Without it terser strips them to `function(){}`, and logging
  // `console` (or a console method) no longer prints "[native code]".
  const min = await minify(built, { compress: { directives: false }, format: { preamble: BANNER } });
  fs.writeFileSync(p('dist/js/console.min.js'), min.code);

  console.log('Built dist/ (css.min: ' + minCss.length + ' B, js: ' + built.length + ' B, js.min: ' + min.code.length + ' B)');
}

build().catch(function(err) {
  console.error(err);
  process.exitCode = 1;
});
