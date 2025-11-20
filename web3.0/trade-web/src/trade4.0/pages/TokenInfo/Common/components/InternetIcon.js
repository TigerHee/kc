/**
 * Owner: odan.ou@kupotech.com
 */
import React from 'react';
import { useTheme } from '@emotion/react';
import { styled } from '@/style/emotion';
import twIcon from 'assets/coinDetail/twitter.svg';
import twIconDark from 'assets/coinDetail/twitter.dark.svg';
import tgIcon from 'assets/coinDetail/telegram.svg';
import tgIconDark from 'assets/coinDetail/telegram.dark.svg';
// import yuIcon from 'assets/coinDetail/youtube.svg';
import faIcon from 'assets/coinDetail/facebook.svg';
import faIconDark from 'assets/coinDetail/facebook.dark.svg';
import gitIcon from 'assets/coinDetail/github.svg';
import gitIconDark from 'assets/coinDetail/github.dark.svg';
import rdIcon from 'assets/coinDetail/reddit.svg';
import rdIconDark from 'assets/coinDetail/reddit.dark.svg';
import { eTheme } from '@/utils/theme';
// import mdIcon from 'assets/coinDetail/medium.svg';

const Icon = styled.img`
  width: 20px;
  height: 20px;
  :hover {
    color: ${eTheme('primary')};
  }
`;

const Blank = styled.span`
  display: inline-block;
  margin-bottom: 12px;
`;

const getIcon = (url, isDark = false) => {
  const urlStr = String(url);
  if (urlStr.includes('twitter')) {
    return isDark ? twIconDark : twIcon;
  } else if (urlStr.includes('telegram') || urlStr.includes('t.me')) {
    return isDark ? tgIconDark : tgIcon;
  } else if (urlStr.includes('youtube')) {
    // return yuIcon;
    return false;
  } else if (urlStr.includes('facebook')) {
    return isDark ? faIconDark : faIcon;
  } else if (urlStr.includes('github')) {
    return isDark ? gitIconDark : gitIcon;
  } else if (urlStr.includes('reddit')) {
    return isDark ? rdIconDark : rdIcon;
  } else if (urlStr.includes('medium')) {
    // return mdIcon;
    return false;
  }
  return false;
};

const InternetIcon = (props) => {
  const { url, hideEmpty = false } = props;
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const iconUrl = getIcon(url, isDark);
  if (iconUrl) {
    return <Icon src={iconUrl} />;
  }
  return hideEmpty ? null : <Blank>--</Blank>;
};

export default InternetIcon;
