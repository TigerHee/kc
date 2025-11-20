/**
 * Owner: will.wang@kupotech.com
 */

import { ICArrowRight2Outlined } from '@kux/icons';
import { ApplyButton, Desc, FooterSectionContainer, Title } from './Footer.styles';
import { useResponsive } from '@kux/mui';
import { _t } from '@/tools/i18n';

export default () => {
  const responsive = useResponsive();
  const isSm = !responsive.sm;

  return (
    <FooterSectionContainer>
      <Title>{_t('23a3d14b6cf34000a882')}</Title>

      <Desc>
        {_t('3a1d43481cdb4000a587')}&nbsp;
        <a 
          href="mailto:KCBP@corp.kucoin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hl-text">
            KCBP@corp.kucoin.com
        </a>&nbsp;{_t('d16b36fbb31b4000a406')}&nbsp;
        <a
          href="https://twitter.com/KuCoinVentures"
          target="_blank"
          rel="noopener noreferrer"
          className="hl-text"
          >
          Twitter
        </a>
      </Desc>

      <ApplyButton as="a" href="mailto:KCBP@corp.kucoin.com" size={isSm ? "basic" : "large"} endIcon={<ICArrowRight2Outlined />}>{_t('e2fd47cd88394000a1c3')}</ApplyButton>
    </FooterSectionContainer>
  );
};
