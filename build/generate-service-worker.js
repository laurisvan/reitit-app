// Inside of build.js:
const workboxBuild  = require('workbox-build');

const swDest = 'dist/sw.js';
workboxBuild.injectManifest({
  swSrc: 'src/sw.js',
  swDest,
  globDirectory: 'dist',
  globPatterns: ['**/*.{js,png,html,css}']
  // Other configuration options...
}).then(({count, size}) => {
  console.log(`Generated ${swDest}, which will precache ${count} files, totaling ${size} bytes.`);
});