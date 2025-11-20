const fs = require('fs');
const path = require('path');

module.exports = function(config) {
  return async function(ctx, next) {
    const host = ctx.request.header.host;
    const ua = ctx.request.header['user-agent'];
    const url = new URL(`http://${host}${ctx.request.url}`);
    const projectName = url.searchParams.get('usessg');
    let theme = url.searchParams.get('theme');
    if (!(Object.values(config.globalSupportThemes).includes(theme))) {
      theme = config.globalSupportThemes.THEME_DEFAULT;
    }
    const projectConfig = config.projectConfigs[projectName];
    if (projectName && projectConfig) {
      let ssgRoot = projectConfig.distConfig[theme].projectDistPath;
      if (ua.indexOf('Mobile') !== -1) {
        ssgRoot = projectConfig.distConfig[theme].projectMobileDistPath;
      }
      if (ua.toLowerCase().indexOf('kucoin') !== -1) {
        ssgRoot = projectConfig.distConfig[theme].projectAppDistPath;
      }
      const filepath = path.join(ssgRoot, url.pathname, '/index.html');
      if (fs.existsSync(filepath)) {
        const content = fs.readFileSync(filepath, 'utf-8');
        ctx.status = 200;
        ctx.body = content;
        return;
      }
    }
    await next();
  };
};
