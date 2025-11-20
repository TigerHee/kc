/**
 * Owner: eli.xiang@kupotech.com
 */
import videoPreviewJPG from 'static/ucenter/login_left_banner.jpg';
import resetPasswordBg from 'static/ucenter/resetPassword.png';
// import regBanner1 from 'static/ucenter/signUp/reg_left_banner_1.png';
// import regBanner2 from 'static/ucenter/signUp/reg_left_banner_2.png';

const ImagePathnameMap = {
  // '/ucenter/signup': [
  //   { href: regBanner1, type: 'image/png' },
  //   { href: regBanner2, type: 'image/png' },
  // ],
  '/ucenter/signin': [{ href: videoPreviewJPG, type: 'image/jpg' }],
  'ucenter/reset-password': [{ href: resetPasswordBg, type: 'image/jpg' }],
};

export default function preloadImage(pathname) {
  const match = ImagePathnameMap[pathname];
  match?.forEach(({ href, type }) => {
    if (href && type && document) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.fetchPriority = 'high';
      link.as = 'image';
      link.type = type;
      link.onload = () => {
        link.remove();
      };
      link.onerror = () => {
        link.remove();
      };
      document.head.appendChild(link);
    }
  });
}
