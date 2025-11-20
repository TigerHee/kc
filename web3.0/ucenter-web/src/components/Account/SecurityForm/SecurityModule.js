/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Alert, Box, Spin, styled, useResponsive, useTheme } from '@kux/mui';
import SecurityAuthForm from 'components/Account/SecurityForm/SecurityAuthForm';
import { memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { push } from 'utils/router';

const Wrapper = styled.div``;

const FormBox = styled.section`
  min-height: 100px;
`;

const AlertWrapper = styled.div`
  .KuxAlert-description {
    margin: 0px;
  }
`;

export default memo(({ bizType, warning, onSuccess, ...props }) => {
  useLocale();
  const theme = useTheme();
  const dispatch = useDispatch();
  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const loading = useSelector((state) => state.loading.effects['security_new/get_verify_type']);

  // 显示校验交易密码的界面
  const [allowTypes, updateAllowTypes] = useState([]);

  useEffect(() => {
    dispatch({
      type: 'security_new/get_verify_type',
      payload: { bizType },
    })
      .then((data) => {
        console.log('security_new/get_verify_type data:', data);
        updateAllowTypes(data);
        if (!data?.length) {
          onSuccess();
        }
      })
      .catch((e) => {
        if (e?.code === '40106') {
          push('/account/security');
        }
      });
  }, []);

  return (
    <Wrapper isDark={theme.currentTheme === 'dark'}>
      {!!warning && (
        <>
          <AlertWrapper>
            <Alert type="warning" description={warning} />
          </AlertWrapper>
          <Box style={{ height: isH5 ? '20px' : '40px' }} />
        </>
      )}

      <Spin spinning={loading} data-testid="spinner">
        <FormBox>
          <SecurityAuthForm
            showTip
            passError
            showAlert={false}
            bizType={bizType}
            showAbnormalInfo
            showTitle={false}
            switchAble={false}
            onSuccess={onSuccess}
            allowTypes={allowTypes}
            type="withdraw_password"
            submitBtnTxt={_t('7oFkVW86phUwcUdqMDVGX3')}
            {...props}
          />
        </FormBox>
      </Spin>
    </Wrapper>
  );
});
