/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import noop from 'lodash-es/noop';
import { Box, Tabs, Tab } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import clsx from 'clsx';
import { kcsensorsManualTrack } from 'tools/sensors';
import useMultiSiteConfig from 'hooks/useMultiSiteConfig';
import ScanLogin from './ScanLogin';
import AccountLogin from './AccountLogin';
import { useLang } from '../../hookTool';
import { ACCOUNT_LOGIN_TAB_KEY, SUB_ACCOUNT_LOGIN_TAB_KEY, SCAN_LOGIN_TAB_KEY } from '../constants';
import { NoSSG } from '../../common/tools';
import { TUserResponse, useLoginStore } from '../model';
import styles from './index.module.scss';

type InputAccountProps = {
  inputAccountTitleClassName?: string;
  loginKey?: string;
  onSuccess?: (data: TUserResponse | null) => void;
  onForgetPwdClick?: () => void;
  signOrDownClick?: () => void;
  customTitle?: React.ReactNode;
  forgetBottom?: React.ReactNode;
  withDrawer?: boolean;
};

const InputAccount: React.FC<InputAccountProps> = (props) => {
  const {
    inputAccountTitleClassName = '',
    loginKey,
    onSuccess = noop,
    onForgetPwdClick = noop,
    signOrDownClick,
    customTitle,
    forgetBottom,
    withDrawer,
  } = props;
  const isSm = useIsMobile();
  const { t } = useLang();

  const [tabKey, setTabKey] = useState<string>(
    [ACCOUNT_LOGIN_TAB_KEY, SUB_ACCOUNT_LOGIN_TAB_KEY, SCAN_LOGIN_TAB_KEY].includes(loginKey as any)
      ? (loginKey as string)
      : ACCOUNT_LOGIN_TAB_KEY,
  );

  // zustand
  const update = useLoginStore((s) => s.update);

  const { multiSiteConfig } = useMultiSiteConfig();

  const supportEmailAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('email');
  const supportPhoneAccount = multiSiteConfig?.accountConfig?.accountTypes?.includes('phone');
  const supportBoth = supportEmailAccount && supportPhoneAccount;

  const getAccountLabel = () => {
    if (supportBoth) return t('dy9jB3DZ7dQkbTXPLbgBNt');
    if (supportEmailAccount) return t('5e072c122d574000a8ba');
    if (supportPhoneAccount) return t('2fc5c2928fd74000a09f');
    return t('dy9jB3DZ7dQkbTXPLbgBNt');
  };

  const handleTabChange = (_e: React.SyntheticEvent, key: string) => {
    setTabKey(key);
    update?.({
      loginErrorTip: '',
      loginErrorCode: null as any,
    });
    if (key === ACCOUNT_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        { spm: [withDrawer ? 'sideAccountLogin' : 'account', withDrawer ? 'account' : '1'] },
        'page_click',
      );
    } else if (key === SUB_ACCOUNT_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        { spm: [withDrawer ? 'sideSubAccountLogin' : 'subAccount', withDrawer ? 'subAccount' : '1'] },
        'page_click',
      );
    } else if (key === SCAN_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        { spm: [withDrawer ? 'sideScanQRLogin' : 'scanQRLogin', withDrawer ? 'scanQRLogin' : '1'] },
        'page_click',
      );
    }
  };

  useEffect(() => {
    update?.({ scanLoginShow: tabKey === SCAN_LOGIN_TAB_KEY });
  }, [tabKey, update]);

  useEffect(() => {
    kcsensorsManualTrack({ spm: ['signinLogin', '1'] });
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box style={{ flex: 1, minHeight: '540px' }}>
        <div className={clsx(styles.titleContainer)}>
          {customTitle || (
            <div className={clsx(styles.title, withDrawer && styles.titleWithDrawer, inputAccountTitleClassName)}>
              {t('login')}
            </div>
          )}
        </div>
        {/* 大屏不确定用户应该显示二维码还是账号登录，生成ssg可能会导致闪烁，所以禁用ssg */}
        {/* 小屏禁用扫码登录，始终使用账号登录，可以生成ssg模板 */}
        <NoSSG byPass={isSm}>
          <section
            className={clsx(styles.tabsContainer)}
            onClick={(e) => {
              e.stopPropagation();
              (e.nativeEvent as any).stopPropagation?.();
            }}
          >
            <Tabs value={tabKey} onChange={handleTabChange} size={isSm ? 'xsmall' : 'medium'}>
              <Tab
                value={ACCOUNT_LOGIN_TAB_KEY}
                label={getAccountLabel()}
                data-inspector="signin_account_login_tab"
              />
              {multiSiteConfig?.accountConfig?.supportSubAccount && (
                <Tab
                  value={SUB_ACCOUNT_LOGIN_TAB_KEY}
                  label={t('ad13710a3e784000a6b7')}
                  data-inspector="signin_sub_account_login_tab"
                />
              )}
              {!isSm && (
                <Tab
                  value={SCAN_LOGIN_TAB_KEY}
                  label={t('2952a79c17584000a14f')}
                  data-inspector="signin_qrcode_icon"
                />
              )}
            </Tabs>
          </section>
          {tabKey === SCAN_LOGIN_TAB_KEY ? (
            <ScanLogin onSuccess={onSuccess} forgetBottom={forgetBottom} />
          ) : (
            <AccountLogin
              key={tabKey}
              tabKey={tabKey}
              onSuccess={onSuccess}
              onForgetPwdClick={onForgetPwdClick}
              forgetBottom={forgetBottom}
              signOrDownClick={signOrDownClick}
              withDrawer={withDrawer}
            />
          )}
        </NoSSG>
      </Box>
    </Box>
  );
};

export default InputAccount;