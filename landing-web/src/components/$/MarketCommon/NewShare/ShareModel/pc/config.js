/**
 * Owner: jesse.shao@kupotech.com
 */
import facebookIcon from 'assets/share/mobile/facebook.svg';
import linkedinIcon from 'assets/share/mobile/linkedin.svg';
import lineIcon from 'assets/share/mobile/line.svg';
import telegramIcon from 'assets/share/mobile/telegram.svg';
import twitterIcon from 'assets/share/mobile/twitter.svg';
import vkIcon from 'assets/share/mobile/vk.svg';
import copy from 'assets/share/mobile/copy.svg';
import save from 'assets/share/mobile/save.svg';

export const getShareBtns = (shareUrl, shareTitle) => {
  const _shareUrl = encodeURIComponent(shareUrl);
  const _shareTitle = encodeURIComponent(shareTitle);
  return [
    {
      name: 'Twitter',
      icon: twitterIcon,
      url: `https://twitter.com/intent/tweet?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Linkedin',
      icon: linkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${_shareUrl}&title=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Facebook',
      icon: facebookIcon,
      url: `https://www.facebook.com/sharer.php?u=${_shareUrl}&title=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Telegram',
      icon: telegramIcon,
      url: `https://t.me/share/url?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'VK',
      icon: vkIcon,
      url: `http://vk.com/share.php?url=${_shareUrl}&comment=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Line',
      icon: lineIcon,
      url: `https://lineit.line.me/share/ui?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      name: 'Save',
      icon: save,
      url: ``,
      gaKey: '',
    },
    {
      name: 'Copy',
      icon: copy,
      url: ``,
      gaKey: '',
    },
  ];
};
