/**
 * Owner: garuda@kupotech.com
 */

import facebookIcon from '@/assets/share/facebook.svg';

import lineIcon from '@/assets/share/line.svg';

import linkedinIcon from '@/assets/share/linkedin.svg';

import telegramIcon from '@/assets/share/telegram1.svg';

import twitterIcon from '@/assets/share/twitter1.svg';

import vkIcon from '@/assets/share/vk.svg';

export const getShareButton = ({ shareUrl, shareTitle, isMobile }) => {
  if (typeof shareUrl !== 'string' || typeof shareTitle !== 'string') {
    throw new Error('shareUrl and shareTitle must be strings');
  }

  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareTitle = encodeURIComponent(shareTitle);

  const baseShare = [
    {
      id: 'Telegram',
      name: 'Telegram',
      icon: telegramIcon,
      url: `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedShareTitle}`,
    },

    {
      id: 'Facebook',
      name: 'Facebook',
      icon: facebookIcon,
      url: `https://www.facebook.com/sharer.php?u=${encodedShareUrl}&t=${encodedShareTitle}`,
    },

    {
      id: 'Twitter',
      name: 'X(Twitter)',
      icon: twitterIcon,
      url: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedShareTitle}`,
    },

    {
      id: 'Linkedin',
      name: 'Linkedin',
      icon: linkedinIcon,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}&title=${encodedShareTitle}`,
    },
  ];

  const lineShare = {
    id: 'Line',
    name: 'Line',
    icon: lineIcon,
    url: `https://lineit.line.me/share/ui?url=${encodedShareUrl}&text=${encodedShareTitle}`,
  };

  if (isMobile) {
    return [...baseShare, lineShare];
  } else {
    return [
      ...baseShare,
      {
        id: 'VK',
        name: 'VK',
        icon: vkIcon,
        url: `http://vk.com/share.php?url=${encodedShareUrl}&comment=${encodedShareTitle}`,
      },
      lineShare,
    ];
  }
};
