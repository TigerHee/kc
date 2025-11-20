/**
 * Owner: roger@kupotech.com
 */
import { ICIphoneOutlined, ICMacOutlined } from '@kux/icons';

const getPlatformIcon = (platform = 'unknown', icons = null) => {
  const ICONS = {
    // chrome: 'chrome-fill',
    // firefox: 'firefox-fill',
    // android: 'android-fill',
    // iphone: 'appleblack-fill',
    // ie: 'ie-fill',
    // safari: 'safari-fill',
    unknown: () => {
      return <ICMacOutlined />;
    },
    'kucoin web': () => {
      return <ICMacOutlined />;
    },
    'iphone app': () => {
      return <ICIphoneOutlined />;
    },
    'android app': () => {
      return <ICIphoneOutlined />;
    },
  };

  let pl = 'unknown';

  const r = Object.keys(icons || ICONS).filter((icon) => {
    return (platform || '').toLowerCase().indexOf(icon) > -1;
  });
  if (r.length) {
    pl = r[0] || pl;
  }
  return ICONS[pl]();
};

export default getPlatformIcon;
