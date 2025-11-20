const fs = require('fs');
const path = require('path');
const lessToJs = require('less-vars-to-js');

module.exports = (theme = 'dark') => {
  const themePath = path.join(__dirname, `./src/themes/${theme}.less`);
  return lessToJs(fs.readFileSync(themePath, 'utf8'));
};
