/**
 * Owner: will.wang@kupotech.com
 */

import { _t, _tHTML } from '@/tools/i18n';
import {
  HeaderContainer,
  HeaderContent,
  HeaderHighlightText,
  HeaderLogoBox,
  HeaderMainTitle,
  HeaderParagraph,
  HeaderTitleBox,
} from './Header.styles';
import Logo from './Logo';

export default () => {
  return (
    <HeaderContainer data-inspector="ventures_page_banner">
      <HeaderContent>
        <HeaderTitleBox>
          <HeaderMainTitle>
            {_tHTML('c10b4e0fdd304000ab1d')}
          </HeaderMainTitle>

          <HeaderParagraph>
            {_t('5bd44eada21d4000ae67')}
          </HeaderParagraph>
        </HeaderTitleBox>

        <HeaderLogoBox>
          <Logo />
        </HeaderLogoBox>
      </HeaderContent>
    </HeaderContainer>
  );
};
