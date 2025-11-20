import { SDK_MANIFEST_MAP } from './consts';

export default function(config, onLoad, onError) {
  (function(para) {
    var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script',x = null,y = null;
    if(typeof(w['sensorsDataAnalytic201505']) !== 'undefined') {
        return false;
    }
    w['sensorsDataAnalytic201505'] = n;
    w[n] = w[n] || function(a) {return function() {(w[n]._q = w[n]._q || []).push([a, arguments]);}};
    var ifs = ['use', 'track','quick','register','registerPage','registerOnce','trackSignup', 'trackAbtest', 'setProfile','setOnceProfile','appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify','login','logout','trackLink','clearAllRegister','getAppStatus','setItem','deleteItem'];
    for (var i = 0; i < ifs.length; i++) {
      w[n][ifs[i]] = w[n].call(null, ifs[i]);
    }
    if (!w[n]._t) {
      x = d.createElement(s), y = d.getElementsByTagName(s)[0];
      x.async = 1;
      x.src = p;
      if(SDK_MANIFEST_MAP[p]){
        x.integrity = SDK_MANIFEST_MAP[p];
        x.crossOrigin = 'anonymous';
      }
      x.setAttribute('charset','UTF-8');
      x.onload = onLoad;
      x.onerror = onError;
      w[n].para = para;
      y.parentNode.insertBefore(x, y);
    }
  })(config);
}
