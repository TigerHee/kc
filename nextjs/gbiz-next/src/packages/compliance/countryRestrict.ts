/**
 * Owner: willen@kupotech.com
 */
import remoteEvent from 'tools/remoteEvent';
import storage from 'tools/storage';
import addLangToPath from 'tools/addLangToPath';

export default function run() {
  if (typeof window === 'undefined') return;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          const bizCode = +res?.code;
          // 业务码不为200时清空上次存储的国家code
          if (bizCode !== 200) storage.removeItem('ip_country_code');
          // 业务码为200时存储国家code
          if (bizCode === 200) {
            const countryCode = res?.data?.countryCode ?? null;
            storage.setItem('ip_country_code', countryCode);
            remoteEvent.emit(remoteEvent.evts.GET_IP_COUNTRY_CODE, countryCode);
          } else if (bizCode === 50003) {
            // 50003为网关返回的CDN封禁标识，直接跳转
            if (res?.url) {
              // 当前url和跳转url相同时，不跳转
              const currentPathname = window.location.pathname;
              const redirectUrl = new URL(res.url);
              // currentPathname可能带有语言前缀，以后缀匹配为准
              if (currentPathname.endsWith(redirectUrl.pathname)) return;
              // 尝试从localstorage中取语言
              window.location.replace(addLangToPath(res.url));
            }
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        // 接口异常时清空上次存储的国家code
        storage.removeItem('ip_country_code');
      }
    }
  };
  xhr.open('GET', '/_api/universal-core/ip/country');
  xhr.send();
}

run();


