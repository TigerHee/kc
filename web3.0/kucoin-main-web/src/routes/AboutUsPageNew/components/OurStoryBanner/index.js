/**
 * Owner: will.wang@kupotech.com
 */

import { useTheme } from '@kux/mui';
import {
  OurStoryBannerSubContent,
  OurStoryBannerSubContentCard,
  OurStoryBannerSubContentCardParagraph,
  OurStoryBannerSubContentCardTitle,
  OurStoryBannerWrapper,
  OurStoryBannerWrapperBg,
  OurStoryContent,
  OurStoryContentParagraph,
  OurStoryContentParagraphBox,
  OurStoryContentTitle,
} from './OurStoryBanner.style';
import leftBgLight from 'static/about-us/light/about_us_illustration_2_light.svg';
import rightBgLight from 'static/about-us/light/about_us_illustration_1_light.svg';
import leftBgDark from 'static/about-us/dark/about_us_illustration_2_dark.svg';
import rightBgDark from 'static/about-us/dark/about_us_illustration_1_dark.svg';
import { _t } from '@/tools/i18n';

const imgMap = {
  light: {
    leftBg: leftBgLight,
    rightBg: rightBgLight,
  },
  dark: {
    leftBg: leftBgDark,
    rightBg: rightBgDark,
  },
};

export default () => {
  const theme = useTheme();
  const imgs = imgMap[theme.currentTheme];

  return (
    <OurStoryBannerWrapperBg data-inspector="about_us_story">
      <OurStoryBannerWrapper id="aboutus_story_banner">
        <OurStoryContent>
          <OurStoryContentTitle>{_t('aboutus.story')}</OurStoryContentTitle>

          <OurStoryContentParagraphBox>
            <OurStoryContentParagraph>
              {_t('e0bdc1ffdeaf4000aed7')}
            </OurStoryContentParagraph>
            <OurStoryContentParagraph>
              {_t('7b43d074282b4000a338')}
            </OurStoryContentParagraph>
            <OurStoryContentParagraph>
              {_t('8891a013712e4000a472')}
            </OurStoryContentParagraph>
          </OurStoryContentParagraphBox>
        </OurStoryContent>

        <OurStoryBannerSubContent>
          <OurStoryBannerSubContentCard bg={imgs.leftBg}>
            <OurStoryBannerSubContentCardTitle>
              {_t('f5cfd00af36a4000a820')}
            </OurStoryBannerSubContentCardTitle>
            <OurStoryBannerSubContentCardParagraph>
              {_t('6a1ac3fe9f8f4000ab62')}
            </OurStoryBannerSubContentCardParagraph>
          </OurStoryBannerSubContentCard>

          <OurStoryBannerSubContentCard bg={imgs.rightBg}>
            <OurStoryBannerSubContentCardTitle>
              {_t('9adf29707ebc4000a467')}
            </OurStoryBannerSubContentCardTitle>
            <OurStoryBannerSubContentCardParagraph>
              {_t('931d0a8829fa4000aab0')}
            </OurStoryBannerSubContentCardParagraph>
          </OurStoryBannerSubContentCard>
        </OurStoryBannerSubContent>
      </OurStoryBannerWrapper>
    </OurStoryBannerWrapperBg>
  );
};
