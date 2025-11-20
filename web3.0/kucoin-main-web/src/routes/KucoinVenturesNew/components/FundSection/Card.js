/**
 * Owner: will.wang@kupotech.com
 */

import { styled, useTheme } from '@kux/mui';
import { FundBigCard } from './FundSection.styles';
import { ICArrowRight2Outlined } from '@kux/icons';
import hashkeyLightLogo from 'static/ventures/logos/hashkey_logo.png';
import hashkeyDarkLogo from 'static/ventures/logos/hashkey_dark.png';
import { _t } from '@/tools/i18n';

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  color: ${props => props.theme.colors.text};
`;

const Logo = styled.img`
  width: 145px;
  height: 44.069px;
  flex-shrink: 0;
  aspect-ratio: 145/44.07;
  object-fit: contain;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 92px;
    height: 28px;
  }
`;

const Bottom = styled.div``;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  margin-bottom: 12px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    margin-bottom: 8px;
  }
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.text40};
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

export const BigCard = () => {
  const theme = useTheme();
  const currentTheme = theme.currentTheme;
  const isDark = currentTheme === 'dark';

  const hashkeyLogo = isDark ? hashkeyDarkLogo : hashkeyLightLogo;

  return (
    <FundBigCard href="https://hashkey.capital/" target="_blank" rel="nofollow noopener noreferrer">
      <Top className="top-logo">
        <Logo src={hashkeyLogo} alt="hashkey" />
        <ICArrowRight2Outlined size={24} />
      </Top>
      <Bottom>
        <Title>Hashkey Capital</Title>
        <Description>
          {_t('6ad997ad569f4000a532')}
        </Description>
      </Bottom>
    </FundBigCard>
  );
};
