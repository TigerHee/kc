/**
 * Owner: will.wang@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { BigCard } from './Card';
import {
  FuncSmCard,
  FundCardContainer,
  FundContent,
  FundParagraph,
  FundSectionContainer,
  FundSmCardContainer,
  Fundtitle,
} from './FundSection.styles';
import trcgDark from 'static/ventures/logos/trcg_dark.svg';
import trcgLight from 'static/ventures/logos/trcg_light.svg';
import { _t } from '@/tools/i18n';

export default () => {
  const theme = useTheme();
  const currentTheme = theme.currentTheme;
  const isDark = currentTheme === 'dark';

  const trcgLogo = isDark ? trcgDark : trcgLight;

  return (
    <FundSectionContainer>
      <FundContent>
        <Fundtitle>
          {_t('d637b3a566894000a742')}
        </Fundtitle>
        <FundParagraph>
          {_t('babf517cd7614000a650')}
        </FundParagraph>

        <FundCardContainer>
          <BigCard />

          <FundSmCardContainer>
            <FuncSmCard
              img={<img src={require('static/ventures/logos/ivc_logo.png')} alt="ivc" />}
              title={'IVC'}
              desc={_t('c25f2a1fc8ad4000a4ed')}
              href="https://www.ivcrypto.io/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            />
            <FuncSmCard
              img={<img src={trcgLogo} alt="trcg" />}
              title={'TRCG'}
              desc={_t('087f119ac6bd4000aa0d')}
              href="https://www.trgc.io/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            />
          </FundSmCardContainer>
        </FundCardContainer>
      </FundContent>
    </FundSectionContainer>
  );
};
