/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { checkAvailable, goVerifyLegacy } from '@kucoin-gbiz-next/verification';
import { Alert, Box, Spin, styled, useResponsive, useSnackbar, useTheme } from '@kux/mui';
import BindPhoneForm, { BIZ_TYPES } from 'components/Account/SecurityForm/BindPhoneForm';
import ChangeResult from 'components/Account/SecurityForm/ChangeResult';
import SecurityModule from 'components/Account/SecurityForm/SecurityModule';
import { tenantConfig } from 'config/tenant';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Back from 'src/components/common/Back';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import { AlertContent } from './style';

const AccountSecurityPhone = styled.div`
  ${({ loading }) => {
    return loading
      ? `
        min-width: 100%;
        min-height: 100%;
        display: flex;
        justify-content: center;
        .KuxSpin-root {
          align-self: center;
        }
      `
      : '';
  }};
  .KuxAlert-description {
    margin-top: 0;
  }
`;

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

// --- 样式 start ---
const Wrapper = styled.div`
  max-width: 520px;
  height: auto;
  margin: 26px auto 88px auto;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 24px 16px 88px 16px;
  }
  [dir='rtl'] & {
    .KuxAlert-icon {
      padding-right: unset;
      padding-left: 8px;
    }
  }
`;

// --- 样式 end ---

const configKey = 'phoneBindOpt';

const ModifyPhonePage = () => {
  useLocale();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { countryList } = useSelector((state) => state.homepage);

  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const [resultModalProps, updaterResultModalProps] = useState(null);

  const [headers, setHeaders] = useState(null);
  const [loading, setLoading] = useState(false);
  const { phoneValidate = false } = user ?? {};
  const [bizType, setBizType] = useState(
    phoneValidate ? BIZ_TYPES.UPDATE_PHONE : BIZ_TYPES.BIND_PHONE,
  );
  const { currentTheme } = useTheme();
  const [originalProcess, setOriginalProcess] = useState(false);

  const goBack = () =>
    window.history.length > 1 ? window.history.go(-1) : replace('/account/security');
  const handleApiVerify = async () => {
    try {
      const res = await goVerifyLegacy({ bizType: BIZ_TYPES.UPDATE_PHONE_V2, theme: currentTheme });
      if (res) {
        setHeaders(res.headers);
      } else {
        goBack();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(
    () => {
      if (phoneValidate) {
        // 有绑定手机号，检查新流程是否可用，异步，需要loading
        setLoading(true);
        (async () => {
          try {
            const available = await checkAvailable(BIZ_TYPES.UPDATE_PHONE_V2);
            setLoading(false);
            if (available) {
              // 新流程可用，bizType设置为新流程
              setBizType(BIZ_TYPES.UPDATE_PHONE_V2);
              handleApiVerify();
            } else {
              setOriginalProcess(true);
            }
          } catch (err) {
            message.error(err.message);
          }
        })();
      } else {
        // 没有绑定手机号，不需要loading，直接走老的流程
        setOriginalProcess(true);
      }
    },
    [
      /** 不需要依赖，期望只执行一次 */
    ],
  );

  const handleFail = useCallback(
    (err) => {
      if (err && err.code === '40006') {
        if (bizType === BIZ_TYPES.UPDATE_PHONE_V2) {
          handleApiVerify();
        } else {
          setOriginalProcess(true);
        }
      }
    },
    [bizType, handleApiVerify],
  );

  const handleSuccess = useCallback(
    (res) => {
      const isWarnRisk = res?.data?.riskCode === 'warn';
      const isRejectRisk = res?.data?.riskCode === 'reject';
      if (isWarnRisk || isRejectRisk) {
        // 命中风控
        updaterResultModalProps({
          open: true,
          onOk: () => {
            if (isWarnRisk) {
              const newWindow = window.open('/support');
              newWindow.opener = null;
            } else {
              updaterResultModalProps(null);
            }
          },
          onCancel: () => updaterResultModalProps(null),
          title: _t('4igBLirWPx4UacVKBbuk2D'),
          titleForDialog: false,
          iconType: isWarnRisk ? 'warning' : 'error',
          content: isWarnRisk
            ? _t('8a525f34ec884000a685')
            : isRejectRisk
            ? _t('c7e105a6ae0d4000ac63')
            : null,
          okText: isWarnRisk ? _t('e2gTG6rHS35mvQuKFA3cHJ') : _t('poolx.ac.modal.cancel'),
          cancelText: isWarnRisk ? _t('poolx.ac.modal.cancel') : null, // warn状态才展示cancel按钮
        });
        return;
      }
      window.history.go(-1);
      message.success(user?.phoneValidate ? _t('m8ynkPYombBvH55s6nYyWu') : _t('operation.succeed'));
    },
    [user?.phoneValidate, message],
  );

  return (
    <AccountSecurityPhone loading={loading} data-inspector="account_security_phone">
      <SecurityVerifyModal visible={originalProcess} showTopTip={true}>
        <SecurityModule
          bizType={bizType}
          onSuccess={() => {
            setOriginalProcess(false);
          }}
          onCancel={goBack}
          onError={(error) => {}}
          submitBtnTxt={_t('xiTx5vKPMTgXB5nJ8bSdkP')}
        />
      </SecurityVerifyModal>
      {!loading ? (
        <Wrapper>
          <Back />
          <Box style={{ height: isH5 ? '24px' : '52px' }} />
          <StyledTitle>
            {user?.phoneValidate ? _t('437KygCfkQmF89XXDeduKr') : _t('phone.bind')}
          </StyledTitle>
          {user?.phoneValidate && (
            <>
              <Box style={{ height: '16px' }} />
              <Alert
                type="warning"
                description={
                  <AlertContent>
                    <span>
                      1.&nbsp;
                      {tenantConfig.account.topTip(_t)}
                    </span>
                    <span>2.&nbsp;{_t('3564f09d2d424000a2db')}</span>
                  </AlertContent>
                }
              />
            </>
          )}
          <Box marginTop={isH5 ? '32px' : '40px'}>
            <BindPhoneForm
              showTitle={false}
              showAlert={false}
              bizType={bizType}
              dispatch={dispatch}
              onSuccess={handleSuccess}
              onError={handleFail}
              isUpdate={user?.phoneValidate}
              countryList={countryList}
              headers={headers}
            />
          </Box>
        </Wrapper>
      ) : (
        <Spin spinning type="brand" />
      )}
      <ChangeResult vertical {...resultModalProps} />
    </AccountSecurityPhone>
  );
};

export default memo(
  withMultiSiteForbiddenPage(ModifyPhonePage, 'securityConfig', configKey, '/account/security'),
);
