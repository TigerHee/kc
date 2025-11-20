/**
 * Owner: jesse.shao@kupotech.com
 */
import facebookIcon from 'assets/share_dark/pc/facebook.svg';
import linkedinIcon from 'assets/share_dark/pc/linkedin.svg';
import lineIcon from 'assets/share_dark/pc/line.svg';
import telegramIcon from 'assets/share_dark/pc/telegram.svg';
import twitterIcon from 'assets/share_dark/pc/twitter.svg';
import vkIcon from 'assets/share_dark/pc/vk.svg';

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
  ];
};
