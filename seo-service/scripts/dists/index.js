/**
 * Owner: hanx.wei@kupotech.com
 */
const path = require('path');
const { THEME_DEFAULT, SUPPORT_THEMES } = require('../themes');

const rootDir = path.resolve(__dirname, '../..');
const distRoot = process.env.USE_LOCAL ? `${rootDir}/.local` : rootDir;

const distDirPath = path.resolve(distRoot, './dist');
const distDirDefaultPath = path.join(distDirPath, '/default');
const distDirMobilePath = path.join(distDirPath, '/mobile');
const distDirAppPath = path.join(distDirPath, '/app');
const distCopyDirPath = path.resolve(distRoot, './dist/temp');
const distCopyDirDefaultPath = path.join(distCopyDirPath, '/default');
const distCopyDirMobilePath = path.join(distCopyDirPath, '/mobile');
const distCopyDirAppPath = path.join(distCopyDirPath, '/app');
const tempDistPath = path.resolve(distRoot, './tempDist');
const tempDistDefaultPath = path.join(tempDistPath, '/default');
const tempDistMobilePath = path.join(tempDistPath, '/mobile');
const tempDistAppPath = path.join(tempDistPath, '/app');

const themeDistConfigs = {};
for (const theme of SUPPORT_THEMES) {
  if (theme !== THEME_DEFAULT) {
    themeDistConfigs[theme] = {
      distDirPath,
      distDirDefaultPath: path.join(distDirPath, `/default-${theme}`),
      distDirMobilePath: path.join(distDirPath, `/mobile-${theme}`),
      distDirAppPath: path.join(distDirPath, `/app-${theme}`),
      distCopyDirPath,
      distCopyDirDefaultPath: path.join(distCopyDirPath, `/default-${theme}`),
      distCopyDirMobilePath: path.join(distCopyDirPath, `/mobile-${theme}`),
      distCopyDirAppPath: path.join(distCopyDirPath, `/app-${theme}`),
      tempDistPath,
      tempDistDefaultPath: path.join(tempDistPath, `/default-${theme}`),
      tempDistMobilePath: path.join(tempDistPath, `/mobile-${theme}`),
      tempDistAppPath: path.join(tempDistPath, `/app-${theme}`),
    };
  } else {
    themeDistConfigs[theme] = {
      distDirPath,
      distDirDefaultPath,
      distDirMobilePath,
      distDirAppPath,
      distCopyDirPath,
      distCopyDirDefaultPath,
      distCopyDirMobilePath,
      distCopyDirAppPath,
      tempDistPath,
      tempDistDefaultPath,
      tempDistMobilePath,
      tempDistAppPath,
    };
  }
}

module.exports = themeDistConfigs;
