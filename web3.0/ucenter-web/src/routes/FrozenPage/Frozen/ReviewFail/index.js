/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, styled, useTheme } from '@kux/mui';
import _noop from 'lodash/noop';
import freezingIconDark from 'static/account/freezing-new-dark.svg';
import freezingIcon from 'static/account/freezing-new.svg';
import { _t } from 'tools/i18n';
import { Error, IconWrapper, LogOut, Title } from './styled';

const Wrapper = styled.div`
  width: 100vw;
  min-height: calc(100vh - 80px);
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding-top: 80px;
`;

const ReviewFail = (props) => {
  const { reason, logout = _noop } = props;
  useLocale();
  const theme = useTheme();

  const handleApply = () => {
    props.onApply();
  };

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
        <Error style={{ marginTop: '13px' }}>{_t('unfreeze.failed')}</Error>
        <Error style={{ marginTop: '8px' }}>{reason}</Error>
      </div>
      <Button
        size="large"
        style={{ maxWidth: '280px', marginTop: '32px' }}
        type="primary"
        onClick={handleApply}
      >
        {_t('reapply.unfreeze')}
      </Button>
      <LogOut onClick={logout}>
        <span>{_t('logout')}</span>
      </LogOut>
    </Wrapper>
  );
};

export default ReviewFail;
