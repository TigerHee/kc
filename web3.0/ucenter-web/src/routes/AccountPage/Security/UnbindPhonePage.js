/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Box, styled, useResponsive, useSnackbar } from '@kux/mui';
import ChangeResult from 'components/Account/SecurityForm/ChangeResult';
import SecurityModule from 'components/Account/SecurityForm/SecurityModule';
import { tenantConfig } from 'config/tenant';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Back from 'src/components/common/Back';
import withMultiSiteForbiddenPage from 'src/hocs/withMultiSiteConfig';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { saTrackForBiz, trackClick } from 'utils/ga';
import { replace } from 'utils/router';
import { AlertContent } from './style';

const bizType = 'UNBIND_PHONE';

// --- 样式 start ---
const Wrapper = styled.div`
  max-width: 580px;
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

const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  margin: 0 0 16px 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

// --- 样式 end ---

const configKey = 'phoneBindOpt';

const UnbindPhonePage = () => {
  useLocale();
  const { message } = useSnackbar();
  const dispatch = useDispatch();
  const confirmLoading = useSelector(
    (state) => state.loading.effects['account_security/unbindPhone'],
  );

  const responsive = useResponsive();
  const isH5 = !responsive.sm;

  useEffect(() => {
    saTrackForBiz({}, ['UnbindPhone', '1']);
  }, []);

  // 提交失败，更新安全校验实例，使可以重新校验
  const [updator, updaterUpdator] = useState(0);
  const [resultModalProps, updaterResultModalProps] = useState(null);

  const onSuccess = useCallback(() => {
    trackClick(['UnbindPhone', '1']);
    dispatch({
      type: 'account_security/unbindPhone',
    })
      .then((res) => {
        const { status, riskCode } = res.data;
        if (status === 'success') {
          replace('/account/security');
          message.success(_t('mTXYg7jycgqNTcv6w1D6wf'));
          dispatch({ type: 'user/pullUser' });
        } else {
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
            vertical: true, // 确保兼容确认按钮的长文案
            title: _t('u8y4P5oCbPncQPR9FVSJnT'),
            ...(!isWarnRisk ? { cancelText: null } : {}),
            titleForDialog: false,
            iconType: isWarnRisk ? 'warning' : 'error',
            onCancel: () => updaterResultModalProps(null),
            content: isWarnRisk
              ? _t('1BjexMxsfCFkUhVLvFN4wd')
              : isRejectRisk
              ? _t('uuTW72t38WLbXW8GozABUH')
              : null,
            okText: isWarnRisk ? _t('e2gTG6rHS35mvQuKFA3cHJ') : _t('poolx.ac.modal.cancel'),
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
    <div data-inspector="account_security_unbind_phone">
      <Wrapper>
        <Back />
        <Box style={{ height: isH5 ? '24px' : '52px' }} />
        <StyledTitle>{_t('soXJ7Z5jrJVDSe2TAB5SYP')}</StyledTitle>
        <SecurityModule
          bizType={bizType}
          updator={updator}
          onSuccess={onSuccess}
          confirmLoading={confirmLoading}
          warning={
            <AlertContent>
              <span>
                1.&nbsp;
                {tenantConfig.account.securityVerifyTip(_t)}
              </span>
              <span>2.&nbsp;{_t('3564f09d2d424000a2db')}</span>
            </AlertContent>
          }
        />
      </Wrapper>
      <ChangeResult vertical {...resultModalProps} />
    </div>
  );
};

export default memo(
  withMultiSiteForbiddenPage(UnbindPhonePage, 'securityConfig', configKey, '/account/security'),
);
