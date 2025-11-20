/**
 * Owner: iron@kupotech.com
 */
const fs = require('fs');

const filePath = `${process.cwd()}/src/`;
const exec = require('child_process').execSync;

fs.watch(filePath, { recursive: true }, (event, filename) => {
  if (filename && event === 'change') {
    exec('npm run compile', { stdio: 'inherit' });
  }
});
