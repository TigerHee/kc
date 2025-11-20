import storage from 'tools/storage';

// 获取query参数
export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
    const pair = vars[i].split('=');
    if (pair[0] === variable) { 
      return pair[1];
    }
  }
  return false;
}

// 获取xversion
export function getXversion() {
  const xversion = storage.getItem('kucoinv2__x_version');
  if (!xversion) return;
  return xversion;
}

// 请求合规判断配置接口
export function getFranceKycByRCODE(rcode, callback) {
  const service = '/_api/growth-ucenter/invitation/user-rcode/validate';
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        callback(null, response);
      } else {
        callback(new Error('Request failed'));
      }
    }
  };
  const xversion = getXversion();
  xhr.open('GET', `${service}?rcode=${rcode}${xversion ? `&x-version=${xversion}` : ''}`, true);
  xhr.send();
}

// 检查url list是否包含某个path
export function checkUrlListMath(list, pathName) {
  return !!list.find((path) => {
    return pathName.indexOf(path) >= 0;
  });
}

// 法国合规第二版中，检查指定url、指定rcode 是否在配置中
export function checkFranceV2(francePathV2, rcode, pathName) {
  if (!rcode || !pathName) return;
  try {
    return !!Object.keys(francePathV2).find((path) => {
      const isPathMatch = pathName?.indexOf(path) >= 0;
      if (!isPathMatch) return;
      // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
      const rcodes = francePathV2[path];
      return !!rcodes.find((i) => i === rcode);
    });
  } catch (e) {
    console.error(e);
  }
}
