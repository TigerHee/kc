/**
 * Owner: jesse.shao@kupotech.com
 */
import moment from 'moment';
import JsBridge from 'utils/jsBridge';
import { addLangToPath } from 'utils/lang';
import { KUCOIN_HOST, LANDING_HOST, KUCOIN_HOST_COM, LANDING_HOST_COM } from 'utils/siteConfig';
import Step1Icon from 'assets/luckydrawTurkey/step1.png';
import Step2Icon from 'assets/luckydrawTurkey/step2.png';
import Step3Icon from 'assets/luckydrawTurkey/step3.png';
import bannerImg from 'assets/luckydrawTurkey/banner.png';
import ThumbImg from 'assets/luckydrawTurkey/thumb.png';
import { getHomeUrl, TURKEY_UTM_SOURCE, getLinkByScene } from '../MarketCommon/config';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

// 时间显示:土耳其
const timeFormatTurkey = time => {
  return moment(time)
    .utcOffset(3)
    .format('YYYY-MM-DD HH:mm');
};

export const goPage = options => {
  const { webUrl, h5Url, appUrl, isInApp, isMobile } = options || {};
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: appUrl,
      },
    });
    return;
  }
  const pageUrl = isMobile ? h5Url : webUrl;
  const newWindow = window.open(pageUrl, '_blank');
  newWindow.opener = null;
};

export const handleLogin = (isInApp, supportCookieLogin, loginBackUrl, utm_source) => {
  if (isInApp && supportCookieLogin) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/login',
      },
    });
    return;
  }
  const currentSearch = window.location.search;
  const searchValue = currentSearch
    ? `${currentSearch}&backUrl=${loginBackUrl}`
    : `?backUrl=${loginBackUrl}`;
  const loginUrl = utm_source
    ? getLinkByScene({
        utm_source,
        scene: 'gotoRegister',
        needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/ucenter/signin${searchValue}`),
      })
    : addLangToPath(`${KUCOIN_HOST}/ucenter/signin${searchValue}`);
  window.location.href = loginUrl;
};

// 根据活动 namespace 设置活动状态
export const STATE_TEXT_CONFIG = {
  luckydrawTurkey: {
    NOT_START: 'Çok yakında',
    IN_PROGRESS: 'Etkinlik Devam Ediyor',
    OVER: 'Etkinlik Sona Erdi',
  },
  newTurkey: {
    NOT_START: 'Çok yakında',
    IN_PROGRESS: 'Etkinlik Devam Ediyor',
    OVER: 'Etkinlik Sona Erdi',
  },
};

// 活动日期文案
export const TIME_TEXT_CONFIG = {
  luckydrawTurkey: (startDate, endDate) =>
    `Etkinlik Tarihi: ${timeFormatTurkey(startDate)} - ${timeFormatTurkey(endDate)} (UTC+3)`,
  newTurkey: (startDate, endDate) =>
    `Etkinlik Tarihi: ${timeFormatTurkey(startDate)} - ${timeFormatTurkey(endDate)} (UTC+3)`,
};

// 活动介绍文案
export const INTRO_TEXT_CONFIG = {
  luckydrawTurkey: () =>
    `Yalnızca Türk kullanıcılarımıza özel, her yeni üye olan kullanıcı başına 10$ ödüllü bir etkinlik başlattık. Tek yapmanız gereken aşağıda yer alan basit adımları tamamlamak.`,
  newTurkey: () =>
    'Sadece Türk kullanıcılarımız için yeni kayıt olan ve gerekli şartları sağlayan kullanıcılara 20$ ödül dağıtıyoruz! Tek yapmanız gereken aşağıdaki adımları tamamlamak.',
};

// 视频教程标题
export const TUTORIAL_TITLE_CONFIG = {
  luckydrawTurkey: {
    title: 'Adımları Nasıl Tamamlayabilirim?',
    poster: ThumbImg,
  },
  newTurkey: {
    title: 'Adımları Nasıl Tamamlayabilirim?',
    poster: 'https://assets.staticimg.com/cms/media/5p3ioOMu2npUAmYovSkuahqEGRh4Cqh8DHkIp3XAp.png',
  },
};

// 步骤配置
export const STEPS_CONFIG = {
  luckydrawTurkey: {
    title: 'Etkinliğe Katılım Detayları:',
    list: [
      {
        icon: Step1Icon,
        text: `${window._BRAND_NAME_}'e Kaydolun!`,
        buttonText: 'Hemen Kaydolun',
        webUrl: addLangToPath(`${LANDING_HOST}/register${window.location.search}`),
        h5Url: addLangToPath(`${LANDING_HOST}/register${window.location.search}`),
        appUrl: '/user/register',
        appLoginedMsg: 'Zaten giriş yaptınız, tekrar giriş yapmanıza gerek yok!',
      },
      {
        icon: Step2Icon,
        text: 'Seviye 1 KYC  doğrulamasını tamamlayın',
        buttonText: 'Seviye 1 KYC  doğrulamasını tamamlayın',
        webUrl: addLangToPath(`${KUCOIN_HOST}/account/kyc`),
        h5Url: addLangToPath(`${KUCOIN_HOST}/account/kyc`),
        appUrl: '/user/kyc',
        appLoginedMsg: null,
      },
      {
        icon: Step3Icon,
        text:
          'İlk Para Yatırma İşleminizi Gerçekleştirin. 15 USDT veya eşdeğerinde TRX,BTC,ETH,BNB yatırın',
        buttonText: 'Yatırma İşlemi Gerçekleştirin',
        webUrl: addLangToPath(`${KUCOIN_HOST}/assets/coin`),
        h5Url: addLangToPath(`${KUCOIN_HOST}/assets/coin`),
        appUrl: '/account/deposit',
        appLoginedMsg: null,
      },
    ],
  },
  newTurkey: {
    title: 'Etkinliğe Katılım Detayları:',
    list: [
      {
        icon: Step2Icon,
        text: 'Kaydol ve KYC1 Tamamla',
        buttonText: 'Hemen Kaydolun',
        webUrl: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/account/kyc${window.location.search}`),
        }),
        h5Url: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/account/kyc${window.location.search}`),
        }),
        appUrl: '/user/kyc',
        appLoginedMsg: null,
      },
      {
        icon: Step3Icon,
        text: 'Minimum 20USDT veya Eşdeğerinde USDC,TRX,BTC,ETH,BNB, LUNA Yatır',
        buttonText: 'Yatırma İşlemi Gerçekleştirin',
        webUrl: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/assets/coin${window.location.search}`),
        }),
        h5Url: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/assets/coin${window.location.search}`),
        }),
        appUrl: '/account/deposit',
        appLoginedMsg: null,
      },
      {
        icon: Step1Icon,
        text: 'İstediğin Tutarda Bir Yatırım Yap!',
        buttonText: 'Al/sat',
        webUrl: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/trade${window.location.search}`),
        }),
        h5Url: getLinkByScene({
          utm_source: TURKEY_UTM_SOURCE,
          scene: 'gotoRegister',
          needConvertedUrl: addLangToPath(`${KUCOIN_HOST}/trade${window.location.search}`),
        }),
        appUrl: '/trade',
        appLoginedMsg: null,
      },
    ],
  },
};

// banner配置
export const BANNER_CONFIG = {
  luckydrawTurkey: {
    showFlashLight: true,
    activityName: 'TURKISH_LUCKY_DRAW',
    regToast: {
      NOT_START: {
        type: 'info',
        msg: 'Etkinlik henüz başlamadı.',
      },
      OVER: {
        type: 'info',
        msg: 'Geç kaldın, etkinlik sona erdi!',
      },
      SUCCESS: {
        type: 'success',
        msg: 'Başarıyla Katıldın!',
      },
    },
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/sign-up-rewards-campaign${window.location.search}`),
    ),
    title: '1,500,000 TRY Ödülü Kazanmak için Hemen Kaydolun!',
    subTitle: '(Yalnızca Türk Kullanıcılarına Özel)',
    joinText: {
      true: 'Katıldınız',
      false: 'Şimdi Katılın',
    },
    shareText: 'Arkadaşlarınızı Davet Edin',
    bannerBgImg: bannerImg,
    shareUrl: () => '',
  },
  newTurkey: {
    showFlashLight: true,
    activityName: 'TURKY_NEW',
    regToast: {
      NOT_START: {
        type: 'info',
        msg: 'Etkinlik henüz başlamadı.',
      },
      OVER: {
        type: 'info',
        msg: 'Geç kaldın, etkinlik sona erdi!',
      },
      SUCCESS: {
        type: 'success',
        msg: 'Başarıyla Katıldın!',
      },
    },
    loginBackUrl: encodeURIComponent(
      addLangToPath(`${LANDING_HOST}/turkey-summer-frenzy-tl${window.location.search}`),
    ),
    title: `${window._BRAND_NAME_} Yaz Çılgınlığı! 320 TL Kazanmak İçin Kaydol!`,
    subTitle: '(Yalnızca Türk Kullanıcılar İçin)',
    joinText: {
      true: 'Katıldınız',
      false: 'Şimdi Katılın',
    },
    shareText: 'Arkadaşlarınızı Davet Edin',
    bannerBgImg:
      'https://assets.staticimg.com/cms/media/4Fcay3UNSYxbZtp6Z7nZhLZ2eUzTz0Y8Utnuq4RHy.png',
    homeUrl: getHomeUrl(TURKEY_UTM_SOURCE),
    shareUrl: inviteCode => {
      // rcode utm_source 存储在storage中
      const rcode = queryPersistence.getPersistenceQuery('rcode');
      const utm_source = queryPersistence.getPersistenceQuery('utm_source');
      return getLinkByScene({
        rcode: inviteCode,
        utm_source: TURKEY_UTM_SOURCE,
        scene: 'share',
        needConvertedUrl: addLangToPath(
          `${LANDING_HOST_COM}/turkey-summer-frenzy-tl?utm_source=${utm_source}&rcode=${rcode}`,
        ),
      });
    },
    utmSource: TURKEY_UTM_SOURCE,
  },
};

// 条款文案
export const CON_CONFIG = {
  luckydrawTurkey: {
    title: 'Şartlar & Koşullar:',
    conditions: [
      '1. Kampanya katılım adımlarını tamamlayan ilk 10.000 Türk kullanıcı, USDT (150 TL= 10 USDT) şeklinde olmak üzere her biri 150 TL almaya hak kazanacaktır.',
      '2. Katılımcılar, ödüllere hak kazanabilmek için 3 adımı tamamlamalıdır.',
      `3. Tüm ödüller kazananların ${window._BRAND_NAME_} hesabına USDT şeklinde dağıtılacak ve para birimi değeri etkinliğin son gününde ödül dağıtım oranına göre hesaplanacaktır.`,
      '4. Tüm ödüller, etkinlik sona erdikten sonra 7-14 iş günü içerisinde kazananların hesaplarına yatırılacaktır.',
      `5. ${window._BRAND_NAME_}, kara para aklama işlemleri veya hesapların yasadışı toplu kaydı, sahte hesap oluşturma veya piyasa manipülasyonu gibi anormal kullanıcı katılımını diskalifiye etme hakkına sahiptir.`,
      '6. Kampanya süresi 14 gün ile sınırlıdır.',
      '7. Bu etkinlik yalnızca Türk kullanıcıların katılımına açıktır.',
      `8. Yalnızca yeni kullanıcıların ${window._BRAND_NAME_} dışından yaptığı para yatırmalarda/transferlerde geçerlidir. ${window._BRAND_NAME_} içerisinde yapılan transfer sayılmaz.`,
    ],
  },
  newTurkey: {
    title: 'Şartlar & Koşullar:',
    conditions: [
      '1. Kampanyaya katılım adımlarını tamamlayan ilk 5.000 Türk yeni kullanıcının her biri 20 ABD Doları (20 ABD Doları = 320 TL) almaya hak kazanacak.',
      '2. Katılımcılar, katılım hakkı kazanabilmek için yukarıdaki adımları tamamlamalı ve "Katıl" butonuna tıklamalıdır.',
      '3. Tüm ödüller etkinlik bitiminden sonra 7 ila 14 iş günü arasında USDT olarak dağıtılacaktır. 4.Etkinlik yalnızca Türk kullanıcılara özel olup sadece 10 gün devam edecektir.',
      '4. Etkinlik yalnızca Türk kullanıcılara özel olup sadece 10 gün devam edecektir.',
      `5. Sadece ${window._BRAND_NAME_}'e dışarıdan yapılan transferler geçerli olup ${window._BRAND_NAME_} içerisinde yapılan transferler geçerli değildir.`,
      '6. Katılımcılar etkinlik süresince yatırdıkları 20 USDT veya eşdeğerindeki varlığı çekemezler ve USDT,USDC, BTC, ETH, BNB, TRX, ve LUNA yatırma işlemlerinde geçerli olan coinlerdir. Eğer katılımcı bir başka kripto para yatırırsa geçerli olmayacaktır.',
      `7. ${window._BRAND_NAME_}, kara para aklama veya yasadışı toplu hesap kaydı, sahte hesap oluşturma veya piyasa manipülasyonu gibi anormal kullanıcı katılımını diskalifiye etme hakkını saklı tutar.`,
    ],
  },
};

// 社群链接
export const COM_LINK = {
  newTurkey: {
    title: `${window._BRAND_NAME_} Türkiye'yi Takip Et!`,
    conditions: [
      {
        title: `${window._BRAND_NAME_} Uygulamasını İndirin >>> `,
        link: addLangToPath(`${KUCOIN_HOST_COM}/download`),
      },
      {
        title: "Twitter'da Bizi Takip Edin >>> ",
        link: 'https://twitter.com/KuCoinTurkey',
      },
      {
        title: 'YouTube Kanalımıza Abone Olun >>> ',
        link: 'https://www.youtube.com/c/KuCoinT%C3%BCrkiye/videos',
      },
    ],
  },
};
