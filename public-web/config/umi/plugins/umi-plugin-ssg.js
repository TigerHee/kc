import path from 'path';
import fs from 'fs';

const rootDir = path.resolve(__dirname, '../../..');
const ssgRootConfigFile = `${rootDir}/.ssgroot`;
let ssgProjectRoot = '';
let ssgMobileProjectRoot = '';
if (fs.existsSync(ssgRootConfigFile)) {
  const ssgRoot = fs.readFileSync(ssgRootConfigFile, 'utf-8').trim();
  console.log(`SSG Root: ${ssgRoot}`);
  ssgProjectRoot = path.join(ssgRoot, '.local/dist/temp/default/public-web');
  ssgMobileProjectRoot = path.join(ssgRoot, '.local/dist/temp/mobile/public-web');
}

export default (api) => {
  api.modifyDevHTMLContent(async (defaultHtml, { req }) => {
    if (!ssgProjectRoot) return defaultHtml;
    const ssgRoot = (!ssgMobileProjectRoot || req.headers['user-agent'].indexOf('Mobile') < 0) ? ssgProjectRoot : ssgMobileProjectRoot;
    const file = path.join(ssgRoot, req.path, '/index.html');
    if (fs.existsSync(file)) {
      console.log(`SSG HTML: ${file}`);
      const content = fs.readFileSync(file, 'utf-8');
      return content;
    } else {
      return defaultHtml;
    }
  });
};
