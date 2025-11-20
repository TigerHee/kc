/**
 * Owner: will.wang@kupotech.com
 */
import { useTheme } from '@kux/mui';
import {
  OurAdvantedgesBanner,
  OurAdvantedgesBannerCard,
  OurAdvantedgesBannerCardBox,
  OurAdvantedgesBannerCardImg,
  OurAdvantedgesBannerCardParagraph,
  OurAdvantedgesBannerCardTitle,
  OurAdvantedgesBannerParagraph,
  OurAdvantedgesBannerTitle,
} from './OurAdvantedgesBanner.style';
import img1Dark from 'static/about-us/dark/security_first.svg';
import img2Dark from 'static/about-us/dark/innovative_trading.svg';
import img3Dark from 'static/about-us/dark/global_empowerment.svg';
import img4Dark from 'static/about-us/dark/kc_eco.svg';

import img1Light from 'static/about-us/light/security_first.svg';
import img2Light from 'static/about-us/light/innovative_trading.svg';
import img3Light from 'static/about-us/light/global_empowerment.svg';
import img4Light from 'static/about-us/light/kc_eco.svg';
import { _t } from '@/tools/i18n';

const imgMap = {
  light: {
    img1: img1Light,
    img2: img2Light,
    img3: img3Light,
    img4: img4Light,
  },
  dark: {
    img1: img1Dark,
    img2: img2Dark,
    img3: img3Dark,
    img4: img4Dark,
  },
};

export default () => {
  const theme = useTheme();
  const imgs = imgMap[theme.currentTheme];

  return (
    <OurAdvantedgesBanner data-inspector="about_us_info">
      <OurAdvantedgesBannerTitle>
        {_t('24e8b825a97b4000a553')}
      </OurAdvantedgesBannerTitle>
      <OurAdvantedgesBannerParagraph>
        {_t('f4857287756d4000affb')}
      </OurAdvantedgesBannerParagraph>

      <OurAdvantedgesBannerCardBox>
        <OurAdvantedgesBannerCard>
          <OurAdvantedgesBannerCardImg src={imgs.img1} alt="banner img" />
          <OurAdvantedgesBannerCardTitle>
            {_t('4e0b5341981e4000a9af')}
          </OurAdvantedgesBannerCardTitle>
          <OurAdvantedgesBannerCardParagraph>
            {_t('7762b1cabbcf4000a1cd')}
          </OurAdvantedgesBannerCardParagraph>
        </OurAdvantedgesBannerCard>

        <OurAdvantedgesBannerCard>
          <OurAdvantedgesBannerCardImg src={imgs.img2} alt="banner img" />
          <OurAdvantedgesBannerCardTitle>
            {_t('5eedfcd04c8e4000a152')}
          </OurAdvantedgesBannerCardTitle>
          <OurAdvantedgesBannerCardParagraph>
            {_t('2bc2d33b535b4000ac09')}
          </OurAdvantedgesBannerCardParagraph>
        </OurAdvantedgesBannerCard>

        <OurAdvantedgesBannerCard>
          <OurAdvantedgesBannerCardImg src={imgs.img3} alt="banner img" />
          <OurAdvantedgesBannerCardTitle>
            {_t('c979d478b8ab4000a0c8')}
          </OurAdvantedgesBannerCardTitle>
          <OurAdvantedgesBannerCardParagraph>
            {_t('185af89739e74000aace')}
          </OurAdvantedgesBannerCardParagraph>
        </OurAdvantedgesBannerCard>

        <OurAdvantedgesBannerCard>
          <OurAdvantedgesBannerCardImg src={imgs.img4} alt="banner img" />
          <OurAdvantedgesBannerCardTitle>
            {_t('026968b084d24000a02b')}
          </OurAdvantedgesBannerCardTitle>
          <OurAdvantedgesBannerCardParagraph>
            {_t('0df6bb1fff2e4000af72')}
          </OurAdvantedgesBannerCardParagraph>
        </OurAdvantedgesBannerCard>
      </OurAdvantedgesBannerCardBox>
    </OurAdvantedgesBanner>
  );
};
