/**
 * Owner: brick.fan@kupotech.com
 */

let kycSite = "";
const listener = [];

const onKYCSiteChange = (siteType) => {
  if (!!kycSite) {
    return;
  }
  kycSite = siteType;
  listener.forEach((callback) => callback(siteType));
};

window.onKYCSiteChange = (callback) => {
  if (kycSite) {
    callback(kycSite);
  } else {
    listener.push(callback);
  }
};

export { onKYCSiteChange };
