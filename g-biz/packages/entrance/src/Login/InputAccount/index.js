/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import noop from 'lodash/noop';
import { useDispatch } from 'react-redux';
import { Box, styled, Tabs, Tab, useResponsive } from '@kux/mui';
import { kcsensorsManualTrack } from '@utils/sensors';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import ScanLogin from './ScanLogin';
import AccountLogin from './AccountLogin';
import { useLang } from '../../hookTool';
import {
  NAMESPACE,
  ACCOUNT_LOGIN_TAB_KEY,
  SUB_ACCOUNT_LOGIN_TAB_KEY,
  SCAN_LOGIN_TAB_KEY,
} from '../constants';
import { NoSSG } from '../../common/tools';

const TitleContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 31px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 24px;
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: ${(props) => (props.withDrawer ? '36px' : '40px')};
  line-height: 130%;
  margin-top: 0;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const TabsContainer = styled.section`
  margin-bottom: 32px;
`;

function InputAccount(props = {}) {
  const {
    classes = {},
    loginKey,
    onSuccess = noop,
    onForgetPwdClick = noop,
    signOrDownClick,
    customTitle,
    forgetBottom,
    withDrawer,
  } = props;
  const rv = useResponsive();
  const isSm = !rv?.sm;
  const { t } = useLang();

  const [tabKey, setTabKey] = useState(
    [ACCOUNT_LOGIN_TAB_KEY, SUB_ACCOUNT_LOGIN_TAB_KEY, SCAN_LOGIN_TAB_KEY].includes(loginKey)
      ? loginKey
      : ACCOUNT_LOGIN_TAB_KEY,
  );

  const dispatch = useDispatch();

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

  const handleTabChange = (event, key) => {
    setTabKey(key);
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        loginErrorTip: '',
        loginErrorCode: null,
      },
    });
    if (key === ACCOUNT_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        {
          spm: [withDrawer ? 'sideAccountLogin' : 'account', withDrawer ? 'account' : '1'],
        },
        'page_click',
      );
    } else if (key === SUB_ACCOUNT_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        {
          spm: [withDrawer ? 'sideSubAccountLogin' : 'subAccount', withDrawer ? 'subAccount' : '1'],
        },
        'page_click',
      );
    } else if (key === SCAN_LOGIN_TAB_KEY) {
      kcsensorsManualTrack(
        {
          spm: [withDrawer ? 'sideScanQRLogin' : 'scanQRLogin', withDrawer ? 'scanQRLogin' : '1'],
        },
        'page_click',
      );
    }
  };

  useEffect(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        scanLoginShow: tabKey === SCAN_LOGIN_TAB_KEY,
      },
    });
  }, [dispatch, tabKey]);

  // 登陆组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signinLogin', '1'],
    });
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box style={{ flex: 1, minHeight: '540px' }}>
        <TitleContainer>
          {customTitle || (
            <Title className={classes.title} withDrawer={withDrawer}>
              {t('login')}
            </Title>
          )}
        </TitleContainer>
        {/* 大屏不确定用户应该显示二维码还是账号登录，生成ssg可能会导致闪烁，所以禁用ssg */}
        {/* 小屏禁用扫码登录，始终使用账号登录，可以生成ssg模板 */}
        <NoSSG byPass={isSm}>
          <TabsContainer
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopPropagation();
            }}
          >
            <Tabs value={tabKey} onChange={handleTabChange} size={isSm ? 'xsmall' : 'medium'}>
              <Tab
                value={ACCOUNT_LOGIN_TAB_KEY}
                label={getAccountLabel()}
                data-inspector="signin_account_login_tab"
              />
              {multiSiteConfig?.accountConfig?.supportSubAccount && ( // 是否支持子账号登录
                <Tab
                  value={SUB_ACCOUNT_LOGIN_TAB_KEY}
                  label={t('ad13710a3e784000a6b7')}
                  data-inspector="signin_sub_account_login_tab"
                />
              )}
              {/* 小屏禁用扫码登陆 */}
              {!isSm && (
                <Tab
                  value={SCAN_LOGIN_TAB_KEY}
                  label={t('2952a79c17584000a14f')}
                  data-inspector="signin_qrcode_icon"
                />
              )}
            </Tabs>
          </TabsContainer>
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
}

export default InputAccount;
