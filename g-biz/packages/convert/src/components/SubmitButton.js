/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { styled, Button } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import useIsSymbolDisabled from '../hooks/form/useIsSymbolDisabled';
import useContextSelector from '../hooks/common/useContextSelector';
import withAuth from '../hocs/withAuth';

const Container = styled.div`
  position: relative;
`;
const Flag = styled.div`
  top: 0;
  left: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 130%;
  padding: 3px 10px;
  position: absolute;
  border-top-left-radius: 24px;
  border-bottom-right-radius: 24px;
  color: ${(props) => props.theme.colors.overlay};
  background: ${({ theme: { currentTheme, colors } }) =>
    currentTheme === 'dark' ? colors.cover : colors.primary};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 10px;
    @media screen and (-webkit-min-device-pixel-ratio: 0) {
      /* zoom: 0.83; */
      font-size: 12px;
    }
  }
`;

const AuthButton = withAuth(({ children, disabled, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');
  const isLogin = useContextSelector((state) => Boolean(state.user));
  return (
    <Button
      fullWidth
      size="large"
      disabled={isLogin && disabled}
      {...(isLogin ? { htmlType: 'submit' } : null)}
      {...otherProps}
      data-inspector="convert_form_submit_button"
    >
      {isLogin ? children : _t('31pkhNAP8zVjGmSNeEpduX')}
    </Button>
  );
});
const SubmitButton = ({ children, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');
  const isSymbolDisabled = useIsSymbolDisabled();
  return (
    <Container {...otherProps}>
      <Flag>{_t('5UoUji8yQgm9qSDZjADU5i')}</Flag>
      <AuthButton disabled={isSymbolDisabled}>
        {isSymbolDisabled ? _t('19ae9caf668a4000ab6b') : children}
      </AuthButton>
    </Container>
  );
};

export default SubmitButton;
