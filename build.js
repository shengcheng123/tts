const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['static/ts/main.ts'],
  bundle: true,
  outfile: 'static/js/bundle.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
}).catch(() => process.exit(1));
