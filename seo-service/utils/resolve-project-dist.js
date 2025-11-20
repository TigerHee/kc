const path = require('path');

module.exports = (distDirName, rootDistConfigs) => {
  const projectThemeDistConfigs = {};
  for (const theme in rootDistConfigs) {
    const themeDistConfig = rootDistConfigs[theme];
    projectThemeDistConfigs[theme] = {
      projectDistPath: path.join(themeDistConfig.distDirDefaultPath, `/${distDirName}`),
      projectDistCopyPath: path.join(themeDistConfig.distCopyDirDefaultPath, `/${distDirName}`),
      projectTempDistPath: path.join(themeDistConfig.tempDistDefaultPath, `/${distDirName}`),
      projectMobileDistPath: path.join(themeDistConfig.distDirMobilePath, `/${distDirName}`),
      projectMobileDistCopyPath: path.join(themeDistConfig.distCopyDirMobilePath, `/${distDirName}`),
      projectMobileTempDistPath: path.join(themeDistConfig.tempDistMobilePath, `/${distDirName}`),
      projectAppDistPath: path.join(themeDistConfig.distDirAppPath, `/${distDirName}`),
      projectAppDistCopyPath: path.join(themeDistConfig.distCopyDirAppPath, `/${distDirName}`),
      projectAppTempDistPath: path.join(themeDistConfig.tempDistAppPath, `/${distDirName}`),
    };
  }
  return projectThemeDistConfigs;
};
