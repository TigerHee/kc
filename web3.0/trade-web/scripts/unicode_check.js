const walk = require('walk');
const path = require('path');
const fs = require('fs');
const commentRegex = require('comment-regex')();

const root = path.join(__dirname, '..', 'src');

const fileIgnore = [
  // `${root}/pages/OpenContract/meta.js`,
  // `${root}/pages/OpenContract/children/Index/Question.js`,
  // `${root}/pages/Contract/components/BaseDetail/meta.js`,
  // `${root}/pages/Contract/components/BaseExponen/meta.js`,
  // `${root}/pages/Contract/components/BaseGuide/meta.js`,
];

const codeMap = {};

function stripComments(string) {
  return string.replace(commentRegex, '');
}

const walker = walk.walk(root, {
  followLinks: false,
  filters: ['assets', 'components/TradingView/studies'],
});

walker.on('file', (roots, stat, next) => {
  if (path.extname(stat.name) === '.js') {
    const filePath = `${roots}/${stat.name}`;
    fs.readFile(filePath, (err, file) => {
      if (!err) {
        if (fileIgnore.indexOf(filePath) === -1) {
          let context = file.toString();
          context = stripComments(context);
          const unicodeRangeReg = /([\u4e00-\u9fa5]+)/gm;
          const matched = context.match(unicodeRangeReg);
          if (matched) {
            codeMap[filePath] = matched;
          }
        }
      }
    });
  }
  next();
});

walker.on('end', () => {
  const codeJson = JSON.stringify(codeMap);
  fs.writeFile(path.join(__dirname, '..', 'unicode.zh_CN.json'), codeJson, () => {
    console.log('write unicode.zh_CN.json success !');
  });
});
