import facebookIcon from '../../asset/facebook.svg';
import linkedinIcon from '../../asset/linkedin.svg';
import lineIcon from '../../asset/line.svg';
import telegramIcon from '../../asset/telegram1.svg';
import twitterIcon from '../../asset/twitter1.svg';
import vkIcon from '../../asset/vk.svg';
import copy from '../../asset/copy.svg';
import copyDark from '../../asset/copy_dark.svg';
import save from '../../asset/save.svg';
import saveDark from '../../asset/save_dark.svg';

export const getShareBtns = (shareUrl, shareTitle, { isDark = false } = {}) => {
  const _shareUrl = encodeURIComponent(shareUrl);
  const _shareTitle = encodeURIComponent(shareTitle);
  return [
    {
      id: 'Telegram',
      name: 'Telegram',
      icon: telegramIcon,
      url: `https://t.me/share/url?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'Facebook',
      name: 'Facebook',
      icon: facebookIcon,
      url: `https://www.facebook.com/sharer.php?u=${_shareUrl}&t=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'Twitter',
      name: 'X(Twitter)',
      icon: twitterIcon,
      url: `https://twitter.com/intent/tweet?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'Linkedin',
      name: 'Linkedin',
      icon: linkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${_shareUrl}&title=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'VK',
      name: 'VK',
      icon: vkIcon,
      url: `http://vk.com/share.php?url=${_shareUrl}&comment=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'Line',
      name: 'Line',
      icon: lineIcon,
      url: `https://lineit.line.me/share/ui?url=${_shareUrl}&text=${_shareTitle}`,
      gaKey: '',
    },
    {
      id: 'Save',
      name: 'Save',
      icon: isDark ? saveDark : save,
      url: ``,
      gaKey: '',
    },
    {
      id: 'Copy',
      name: 'Copy',
      icon: isDark ? copyDark : copy,
      url: ``,
      gaKey: '',
    },
  ];
};
