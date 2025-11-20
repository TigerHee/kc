/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled, useTheme } from '@kux/mui';
import _noop from 'lodash/noop';
import freezingIconDark from 'static/account/freezing-new-dark.svg';
import freezingIcon from 'static/account/freezing-new.svg';
import { _t } from 'tools/i18n';
import { Desc, IconWrapper, LogOut, Title } from './styled';

const Wrapper = styled.div`
  width: 100vw;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  padding-top: 80px;
  align-items: center;
`;

export default ({ logout = _noop }) => {
  useLocale();
  const theme = useTheme();
  return (
    <Wrapper>
      <IconWrapper>
        <img
          src={theme.currentTheme === 'light' ? freezingIcon : freezingIconDark}
          alt="freezing-icon"
        />
      </IconWrapper>
      <div style={{ marginTop: '32px' }}>
        <Title>{_t('osQ4aYcG6fazfTLcst7jDu')}</Title>
        <Desc>{_t('application.submited')}</Desc>
      </div>
      <LogOut onClick={logout}>
        <span>{_t('logout')}</span>
      </LogOut>
    </Wrapper>
  );
};
