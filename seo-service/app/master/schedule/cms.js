/**
 * Owner: hanx.wei@kupotech.com
 */
const checkAnnouncementUpdate = require('./announcement');
// const checkBlogUpdate = require('./blog'); // seo-web 整体定时触发 lambda，不再定时检查博客更新

async function checkCmsUpdate() {
  const _checkNewsUpdate = checkAnnouncementUpdate.bind(this);
  await _checkNewsUpdate();
}

module.exports = checkCmsUpdate;
