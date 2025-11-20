/**
 * Owner: borden@kupotech.com
 */
import jsonp from 'utils/httpAxios/jsonp';

export function getLang(name, dir = 'locale', mergeCallback = (d) => d) {
  return new Promise((resolve) => {
    jsonp(
      `${_PUBLIC_PATH_}${dir}/${name}.js`,
      {
        name: '_KC_PAGE_LANG_LOADER',
      },
      (lang, data) => {
        console.log('load lang ==>', dir);
        const oldData = _KC_LOCALE_DATA[lang] ?? {};
        _KC_LOCALE_DATA[lang] = { ...oldData, ...mergeCallback(data) };
        resolve();
      },
    );
  });
}
