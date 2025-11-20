/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { LoginNoLayout as LoginComponent } from '@kucoin-gbiz-next/entrance';
import { px2rem, styled, useResponsive, useSnackbar, useTheme } from '@kux/mui';
import { $loginKey } from 'components/Entrance/const';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SITE_FORCE_REDIRECT } from 'src/constants';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { push } from 'utils/router';
import siteConfig from 'utils/siteConfig';

const BottomText = styled.div`
  font-size: ${px2rem(14)};
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  margin-top: 20px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  // min-height: 810px;
  padding: 0 24px;
  min-width: 375px;
`;

const CustomWrapper = styled.div`
  margin-bottom: ${px2rem(40)};
`;

const CustomTitle = styled.div`
  font-size: ${px2rem(34)};
  margin-bottom: ${px2rem(20)};
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;
const CustomSubTitle = styled.div`
  font-size: 14px;
  line-height: 24px;
  color: ${(props) => props.theme.colors.text60};
  & span > span {
    color: ${(props) => props.theme.colors.primary};
  }
`;
export default () => {
  useLocale();
  const { KUCOIN_HOST } = siteConfig;
  const theme = useTheme();
  const dispatch = useDispatch();
  const rv = useResponsive();
  const { message } = useSnackbar();

  const invitationCode = useSelector((state) => state.oauth.invitationCode);

  const goSignUp = useCallback(() => {
    const href = window.location.href;
    const backUrl = encodeURIComponent(href);
    const url = `/ucenter/signup?backUrl=${backUrl}${
      invitationCode ? `&rcode=${invitationCode}` : ''
    }`;
    window.location.href = addLangToPath(url);
  }, [invitationCode]);

  return (
    <Wrapper>
      <div style={{ width: rv.md ? 480 : '100%' }}>
        <LoginComponent
          theme={theme.currentTheme}
          loginKey={$loginKey}
          showLoginSafeWord
          onSuccess={(data) => {
            message.success(_t('operation.succeed'));
            dispatch({
              type: 'user/pullUser',
              payload: {
                callback: (code) => {
                  // 如果报错站点不一致，则刷新页面
                  if (SITE_FORCE_REDIRECT === code) {
                    window.location.reload();
                  }
                },
              },
            });
          }}
          onForgetPwdClick={() => {
            const url = `${KUCOIN_HOST}/ucenter/reset-password`;
            window.location.href = url;
          }}
          verifyCanNotUseClick={(token) => {
            push(`/ucenter/reset-security/token/${token}`);
          }}
          customTitle={
            <CustomWrapper>
              <CustomTitle>{_t('9hKWxf1jDuDQ6z85SSJri3')}</CustomTitle>
              <CustomSubTitle>{_tHTML('3568xM5Xxp8mrcGSvfHMpQ')}</CustomSubTitle>
            </CustomWrapper>
          }
        />
      </div>
      <BottomText onClick={goSignUp}>{_t('qHy6XJWBFKKigXS3GZ7LXG')}</BottomText>
    </Wrapper>
  );
};
