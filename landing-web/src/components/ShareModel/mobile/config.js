/**
 * Owner: jesse.shao@kupotech.com
 */
import facebookIcon from 'assets/share/mobile/facebook.svg';
import linkedinIcon from 'assets/share/mobile/linkedin.svg';
import lineIcon from 'assets/share/mobile/line.svg';
// import qqIcon from 'assets/share/mobile/qq.svg';
import telegramIcon from 'assets/share/mobile/telegram.svg';
import twitterIcon from 'assets/share/mobile/twitter.svg';
import vkIcon from 'assets/share/mobile/vk.svg';
// import weiboIcon from 'assets/share/mobile/weibo.svg';

export const getShareBtns = (shareUrl, shareTitle, encode = true) => {
  const _shareUrl = encode ? encodeURIComponent(shareUrl) : shareUrl;
  return [
    {
      name: 'Twitter',
      icon: twitterIcon,
      url: `https://twitter.com/intent/tweet?url=${_shareUrl}&text=${shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Linkedin',
      icon: linkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${_shareUrl}&title=${shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Facebook',
      icon: facebookIcon,
      url: `https://www.facebook.com/sharer.php?u=${_shareUrl}&title=${shareTitle}`,
      gaKey: '',
    },
    // {
    //   name: 'Weibo',
    //   icon: weiboIcon,
    //   url: `http://service.weibo.com/share/share.php?url=${_shareUrl}&appkey=&title=${shareTitle}&pic=&ralateUid=`,
    //   gaKey: '',
    // },
    // {
    //   name: 'QQ',
    //   icon: qqIcon,
    //   url: `http://connect.qq.com/widget/shareqq/index.html?url=${_shareUrl}&title=${shareTitle}&pics=&summary=-&desc=-`,
    //   gaKey: '',
    // },
    {
      name: 'Telegram',
      icon: telegramIcon,
      url: `https://t.me/share/url?url=${_shareUrl}&text=${shareTitle}`,
      gaKey: '',
    },
    {
      name: 'VK',
      icon: vkIcon,
      url: `http://vk.com/share.php?url=${_shareUrl}&comment=${shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Line',
      icon: lineIcon,
      url: `https://lineit.line.me/share/ui?url=${_shareUrl}&text=${shareTitle}`,
      gaKey: '',
    },
    {
      name: 'xx1',
      icon: undefined,
      url: undefined,
      gaKey: '',
    },
    {
      name: 'xx2',
      icon: undefined,
      url: undefined,
      gaKey: '',
    },
  ];
};
