/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from '@kucoin-base/i18n';
import { goVerifyLegacy } from '@kucoin-gbiz-next/verification';
import { Spin, styled, useSnackbar } from '@kux/mui';
import SafeWordContent from 'components/Account/SafeWord/index';
import { withRouter } from 'components/Router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import { Wrapper } from './style';

const StyledWrapper = styled(Wrapper)`
  height: auto;
  min-height: calc(100vh - 80px);
  width: 100%;
  max-width: 580px;
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0;
    padding: 26px 16px;
    padding-bottom: 56px;
  }
`;
const LoadingWrapper = styled.div`
  position: absolute;
  height: 64px;
  width: 64px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const SafeWordPage = () => {
  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const { message } = useSnackbar();

  // 默认 loading
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    window.history.length > 1 ? window.history.go(-1) : replace('/account/security');
  };

  const handleSubmit = async (values) => {
    try {
      const verifyRes = await goVerifyLegacy({ bizType: 'RV_SET_SAFE_WORD' });
      if (verifyRes) {
        const res = await dispatch({
          type: 'account_security/saveSafewords',
          payload: {
            ...values,
            headers: verifyRes.headers,
          },
        });
        if (res && res.code === '200') {
          message.success(_t('operation.succeed'));
          handleBack();
        }
      }
    } catch (err) {
      // showError 中全局统一处理了 toast 提示
      console.log('err...', err);
    }
  };

  useEffect(() => {
    dispatchRef
      .current({
        type: 'account_security/getSafeWords',
      })
      .catch(() => {
        // 防止接口报错，loading 不消失
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  return (
    <StyledWrapper data-inspector="account_security_safeword">
      {loading ? (
        <LoadingWrapper>
          <Spin />
        </LoadingWrapper>
      ) : (
        <SafeWordContent onSubmit={handleSubmit} onBack={handleBack} />
      )}
    </StyledWrapper>
  );
};

export default withRouter()(injectLocale(SafeWordPage));
