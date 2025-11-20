/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Box, useResponsive, useSnackbar } from '@kux/mui';
import ChangeResult from 'components/Account/SecurityForm/ChangeResult';
import SecurityModule from 'components/Account/SecurityForm/SecurityModule';
import { tenantConfig } from 'config/tenant';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Back from 'src/components/common/Back';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import { replace } from 'utils/router';
import { AlertContent, StyledTitle, Wrapper } from './style';

const bizType = 'UNBIND_EMAIL';

// --- 样式 end ---

const configKey = 'emailBindOpt';

export const Context = React.createContext(null);
// export default memo(() => {
const UnbindEmailPage = () => {
  useLocale();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const confirmLoading = useSelector(
    (state) => state.loading.effects['account_security/unbindEmail'],
  );

  const responsive = useResponsive();
  const isH5 = !responsive.sm;

  // 提交失败，更新安全校验实例，使可以重新校验
  const [updator, updaterUpdator] = useState(0);
  const [resultModalProps, updaterResultModalProps] = useState(null);

  useEffect(() => {
    saTrackForBiz({}, ['UnbindEmail', '1']);
  }, []);

  const onSuccess = useCallback(() => {
    trackClick(['UnbindEmail', '1']);
    dispatch({
      type: 'account_security/unbindEmail',
    })
      .then((res) => {
        const { status, riskCode } = res.data;
        if (status === 'success') {
          replace('/account/security');
          message.success(_t('mTXYg7jycgqNTcv6w1D6wf'));
          dispatch({ type: 'user/pullUser' });
        } else {
          // 命中风控
          updaterUpdator((state) => ({
            updator: state.updator + 1,
          }));
          const isWarnRisk = riskCode === 'warn';
          const isRejectRisk = riskCode === 'reject';
          if (!isWarnRisk && !isRejectRisk) {
            return;
          }
          updaterResultModalProps({
            open: true,
            onOk: () => {
              if (isWarnRisk) {
                const newWindow = window.open('/support');
                if (newWindow) {
                  newWindow.opener = null;
                }
              } else {
                updaterResultModalProps(null);
              }
            },
            onCancel: () => updaterResultModalProps(null),
            title: _t('u8y4P5oCbPncQPR9FVSJnT'),
            titleForDialog: false,
            iconType: isWarnRisk ? 'warning' : 'error',
            content: isWarnRisk
              ? _t('cj5ZFpdVmC9M9xV38aeA7P')
              : isRejectRisk
              ? _t('mzwaCvtXUkMy9GFB2GzHJ8')
              : null,
            okText: isWarnRisk ? _t('e2gTG6rHS35mvQuKFA3cHJ') : _t('poolx.ac.modal.cancel'),
            cancelText: isWarnRisk ? _t('poolx.ac.modal.cancel') : null, // warn状态才展示cancel按钮
          });
        }
      })
      .catch((e) => {
        if (e?.code === '40106') {
          replace('/account/security');
          return;
        }
        updaterUpdator((state) => ({
          updator: state.updator + 1,
        }));
      });
  }, []);

  return (
    <div data-inspector="account_security_unbind_email">
      <Wrapper>
        <Back />
        <Box style={{ height: isH5 ? '24px' : '52px' }} />
        <StyledTitle>{_t('aadEGFLFUT46uXHQaw4jPX')}</StyledTitle>
        <SecurityModule
          bizType={bizType}
          updator={updator}
          onSuccess={onSuccess}
          confirmLoading={confirmLoading}
          warning={
            <AlertContent>
              <span>1.{tenantConfig.account.topTip(_t)}</span>
              <span> 2.{_t('1DUFyXFrtG1i2v36CK9gJW')}</span>
            </AlertContent>
          }
        />
      </Wrapper>
      <ChangeResult vertical {...resultModalProps} />
    </div>
  );
};

export default memo(
  withMultiSiteForbiddenPage(UnbindEmailPage, 'securityConfig', configKey, '/account/security'),
);
