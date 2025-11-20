/**
 * Owner: willen@kupotech.com
 */
import MobileIocn from 'static/newhomepage/downloadpart/mobile.png';
import PCIcon from 'static/newhomepage/downloadpart/mac.png';
import AppStoreIcon from 'static/newhomepage/downloadpart/APPstore.png';
import AppStore from 'static/newhomepage/downloadpart/ios-appstore.png';
// import BetaAppIcon from 'static/newhomepage/downloadpart/BetaAPP.png';
import DownloadIos from 'static/newhomepage/downloadpart/donwload-ios.png';
// import BetaApp from 'static/newhomepage/downloadpart/ios-betaapp.png';
import GooglePlayIcon from 'static/newhomepage/downloadpart/googleplay.png';
import GooglePlay from 'static/newhomepage/downloadpart/android-googleplay.png';
import APKIcon from 'static/newhomepage/downloadpart/androidapk.png';
// import APK from 'static/newhomepage/downloadpart/android-apk.png';

const data = {
  statistics: [
    {
      num: 'Top 1',
      des: 'card.global.no1',
    },
  ],
  download: {
    title: 'download.anytime.trade',
    des: 'download.app.or.web',
    mobile: MobileIocn,
    pc: PCIcon,
    ios: {
      AppStoreIcon,
      AppStoreImg: AppStore,
      BetaAppIcon: DownloadIos,
      AppStoreUrl: 'https://kucoin.onelink.me/iqEP/vtvi4da4',
      AppStoreUrlByIllegalGp: 'https://kucoin.onelink.me/iqEP/j2tazuba',
      BetaAppUrl: 'https://kucoin.onelink.me/iqEP/vtvi4da4',
    },
    android: {
      GooglePlayIcon,
      GooglePlayImg: GooglePlay,
      APKIcon,
      GooglePlayUrl: 'https://kucoin.onelink.me/iqEP/vtvi4da4',
      APKUrl: 'https://kucoin.onelink.me/iqEP/945mlddo',
      APKUrlByIllegalGp: 'https://kucoin.onelink.me/iqEP/j2tazuba',
    },
  },
};

export default data;
