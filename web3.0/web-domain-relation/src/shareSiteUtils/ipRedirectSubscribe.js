/**
 * Owner: brick.fan@kupotech.com
 */

// IP 定向弹窗展示
let ipSite = "";
const listener = [];

const onIPSiteChange = (siteType) => {
  ipSite = siteType;
  listener.forEach((callback) => callback(siteType));
};

window.onIPSiteChange = (callback) => {
  if (ipSite) {
    callback(ipSite);
  } else {
    listener.push(callback);
  }
};

export { onIPSiteChange };
