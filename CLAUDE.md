# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A dependency-free, drop-in script that replaces `window.console` with an on-page console panel, for mobile browsers and browsers without a console. There is no test suite (`npm test` is a placeholder that exits 1) and no standalone lint script; JSHint only runs as part of the gulp `js` task.

## Commands

```
npm install        # dev deps only; node_modules is gitignored
npx gulp           # default: full build, then BrowserSync serving demo.html + watch
npx gulp dist      # one-shot build: css -> js-style -> js
npx gulp css       # scss -> dist/css/console-style.css and .min.css
npx gulp js-style  # js/console.js -> dist/js/console.js with minified CSS inlined
npx gulp js        # jshint + uglify dist/js/console.js -> dist/js/console.min.js
```

The toolchain is old (gulp 3, gulp-sass 2 / node-sass, uglify 1.x). Gulp 3 is known to fail on Node 12+, so if `gulp` errors on install or startup, use an older Node rather than assuming the code is broken. The shipped JS must stay ES5 because uglify 1.x can't parse ES6, and the library targets IE8+.

## Build pipeline (the non-obvious part)

Source and output are different files, and the output is committed:

- **Edit only `js/console.js` and `scss/console-style.scss`.** Everything under `dist/` is generated, but is checked in. Rebuild with `gulp dist` and commit `dist/` alongside source changes. The README CDN link points at `dist/js/console.min.js` on a git tag.
- `js/console.js` contains the literal placeholder `'{{consoleLogStyles}}'` (in `CL.init`). The `js-style` task replaces it with the contents of `dist/css/console-style.min.css` and writes `dist/js/console.js`. The `js` task then minifies that generated file, not the one in `js/`. So CSS changes only reach the JS after `css` -> `js-style` -> `js`, in that order. `gulp dist` does this via `run-sequence`.
- The CSS that ships is the cssnano-minified version. cssnano rewrites `z-index`, so `.CL { z-index: 999999999 }` in the SCSS ships as `z-index:2` in `console-style.min.css` and in the inlined JS. Check the `.min.css` output when changing stacking or other values cssnano may normalize.
- `demo.html` loads `dist/js/console.js?200`, not `js/console.js`. Running the demo without a build, or with a stale `dist/`, shows old code.
- The demo only shows the panel if the console is not natively supported, the UA is mobile, or `?override` is on the script URL. On desktop, add `?override` to the script `src` or emulate a mobile device.

## Architecture

All runtime code is one IIFE in `js/console.js` with two namespaces and some shared IIFE-scoped state.

- `Helpers`: DOM and utility functions (`create`, `addClass`/`removeClass`/`hasClass`, `isMobile`, `isIE8or9`, `getWinH`) plus `ObjString`. `ObjString` is a modified Crockford `JSON.stringify` that prints unquoted keys, then turns `\n` into `<br>` and spaces into `&nbsp;`. It also patches `String/Number/Boolean.prototype.toJSON` globally.
- `CL`: the UI controller. `init` calls `setup` (builds the DOM), `insertRules` (injects CSS), `scriptParams` (reads the query string), `setHeight`, `toggle` and `bindEvents`. `CL.funcs` holds stub "native code" functions that are printed when the user logs `console` or `console.log`.
- At the bottom, the activation check (`typeof console !== 'object' || Helpers.isMobile() || CL.override()`) decides whether to run `CL.init()` and then assign `window.console` and `window.onerror`. Everything after that sits inside this `if`, including the shared `var`s.

Things that are easy to get wrong:

- **Implicit per-entry state.** `entryClass`, `isError`, `isExec`, `consoleError`, `consoleAssert` and `sym` are shared variables, not arguments. `console.error`, `warn` and `assert` set these flags and then delegate to `console.log`. `log` builds the `<li>` and calls `CL.newLog()`, which resets every flag. New console methods or entry types must follow the same set-flags -> `log` -> `newLog` flow, or flags will leak into the next entry. `executeCode` (the in-page input box) uses the same trick, setting `sym` to `>` or `<` before each `console.log` and calling `eval` on the input.
- **Output is HTML strings.** `log` builds an HTML string per argument (`CL.syntax` adds color spans using regexes over `ObjString` or `printHTML` output) and assigns it with `innerHTML`. Escaping happens in `printHTML` and the syntax regexes, so changes there can break or open up markup.
- **Sentinel `%CL%ML101417`.** `window.console.ID` and the `ID` locals in each method carry this string, and `log` tests for it with a regex. It is how logging `console` or `console.log` is detected and swapped for the `CL.funcs` stubs, which avoids dumping the real functions. Don't remove the `ID` locals or rename the sentinel without updating those checks.
- **CSS injection is a naive parser.** `insertRules` splits the minified CSS string on `}` and `{` and calls `insertRule` on `document.styleSheets[last]` (the `<style>` that `setup` appends). Only flat `selector{rules}` blocks work. `@media`, `@keyframes` and other nested at-rules in the SCSS would be mangled.
- **Query-string options** are read from the `<script>` tag's own `src` (matched by `/console(\.min)?\.js/`). `scriptParams` handles a numeric value (height), `hide`, and `timestamp`. `timestamp` is not mentioned in the README. `CL.override()` separately checks for `override`. Height must be >= 90 and <= window height - 150, otherwise it falls back to a third of the window height.
