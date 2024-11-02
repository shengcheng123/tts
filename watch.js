const esbuild = require('esbuild');

esbuild.context({
  entryPoints: ['static/ts/main.ts'],
  bundle: true,
  outfile: 'static/js/bundle.js',
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
}).then(ctx => {
  ctx.watch();
  console.log('Watching...');
}).catch(() => process.exit(1));
