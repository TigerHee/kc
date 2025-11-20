/**
 * Owner: ella.wang@kupotech.com
 */
import Linkedin from 'static/mining-pool/linkedin.svg';
import Twitter from 'static/mining-pool/twitter.svg';
import Facebook from 'static/mining-pool/facebook.svg';
import Vk from 'static/mining-pool/vk.svg';
import LineImg from 'static/mining-pool/line.svg';
import Telegram from 'static/mining-pool/telegram.svg';

export const getShareList = (shareUrl, shareTitle) => {
  return [
    {
      name: 'Linkedin',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${encodeURI(
        shareTitle,
      )}`,
      gaKey: 'web_click_share_linkedin',
      contentType: 'Linkedin', // 神策埋点携带参数
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURI(shareTitle)}`,
      gaKey: 'web_click_share_twitter',
      contentType: 'Twitter', // 神策埋点携带参数
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer.php?u=${shareUrl}&title=${encodeURI(shareTitle)}`,
      gaKey: 'web_click_share_facebook',
      contentType: 'Facebook', // 神策埋点携带参数
    },
    {
      name: 'Telegram',
      icon: Telegram,
      url: `https://t.me/share/url?url=${shareUrl}&text=${encodeURI(shareTitle)}`,
      gaKey: 'web_click_share_telegram',
      contentType: 'Telegram', // 神策埋点携带参数
    },
    {
      name: 'VK',
      icon: Vk,
      url: `http://vk.com/share.php?url=${shareUrl}&comment=${encodeURI(shareTitle)}`,
      gaKey: 'web_click_share_vk',
      contentType: 'VK', // 神策埋点携带参数
    },
    {
      name: 'Line',
      icon: LineImg,
      url: `https://lineit.line.me/share/ui?url=${shareUrl}&text=${encodeURI(shareTitle)}`,
      gaKey: 'web_click_share_line',
      contentType: 'Line', // 神策埋点携带参数
    },
  ];
};
