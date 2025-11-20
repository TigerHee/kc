/**
 * Owner: tiger@kupotech.com
 */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import head from 'lodash/head';
import { useSelector } from 'react-redux';
import { Box, styled, Spin, Alert, Tabs, Tab, useResponsive } from '@kux/mui';
import { ICArrowRight2Outlined, ICSecurityOutlined } from '@kux/icons';
import GFA from './GFA';
import SMS from './SMS';
import Email from './Email';
import { NAMESPACE, RISK_TAG } from '../constants';
import { useLang } from '../../hookTool';
import { getTrackingSource, kcsensorsClick } from '../../common/tools';

const Back = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
  span {
    margin-left: 7px;
  }
  svg {
    transform: rotate(180deg);
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: ${(props) => (props.withDrawer ? '36px' : '40px')};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  word-break: break-word;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled(Box)`
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    margin-bottom: 32px;
  }
`;

const SwichValidation = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;

const SafeWordBox = styled(Box)`
  .safeword {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    gap: 8px;
    background: rgba(102, 221, 140, 0.12);
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.primary};
  }
  .safewordTips {
    font-weight: 400;
    font-size: 14px;
    line-height: 130%;
    color: ${({ theme }) => theme.colors.text60};
    margin-top: 16px;
    margin-bottom: 0;
  }
`;

const RiskAlert = styled(Box)`
  margin-bottom: 24px;
`;

const TabsContainer = styled.section`
  margin-bottom: 16px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
  }
`;

export default function ValidateForm(props) {
  const {
    onSuccess,
    verifyCanNotUseClick,
    showLoginSafeWord,
    isSub = false,
    trackingConfig = {},
    withDrawer,
    onBack,
  } = props;
  const { needValidations, loginSafeWord, riskTag, email, phone } = useSelector((state) => {
    return state[NAMESPACE];
  });
  const validateLoading = useSelector((state) => state.loading.effects[`${NAMESPACE}/validate`]);
  const { t } = useLang();
  const headValidation = head(needValidations);
  const defaultTabKey = head(headValidation);
  const { warnText } = RISK_TAG[riskTag] || {};
  const rv = useResponsive();
  const isSm = !rv?.sm;

  const [tabKey, setTabKey] = useState(defaultTabKey);
  const [otherValidations, setOtherValidations] = useState([]);
  const [isAutoSendCode, setAutoSendCode] = useState(true); // 是否自动发送验证码
  const sensorsRef = useRef(null);
  const trackSourceParam = getTrackingSource(trackingConfig);

  // 验证方式
  const validations = {
    google_2fa: {
      name: 'g2fa.code',
      title: t('g9AA6y4U7gBkED1JLzhXtb'), // 请输入谷歌验证器中的6位数字验证码
      render(props = {}) {
        return <GFA {...props} trackResultParams={{ source: trackSourceParam }} />;
      },
    },
    my_sms: {
      name: 'sQWHYNwfMXUanwNvN72djq',
      title: t('qibEqVh37GMhHZZgS2qa8C', { phone }), // 请输入手机短信中的6位数字验证码
      render(props = {}) {
        return (
          <SMS
            {...props}
            trackResultParams={{ source: trackSourceParam }}
            isAutoSendCode={isAutoSendCode}
          />
        );
      },
    },
    my_email: {
      name: '17YNCBHndz3qnRkgirKhm7',
      title: t('tc5F484DDZqStzY4p3QYCp', { email }),
      render(props = {}) {
        return (
          <Email
            {...props}
            trackResultParams={{ source: trackSourceParam }}
            isAutoSendCode={isAutoSendCode}
          />
        );
      },
    },
  };

  // 返回
  const goback = useCallback(() => {
    onBack?.();
  }, []);

  useEffect(() => {
    if (sensorsRef.current) {
      kcsensorsClick(['switch_login_verify', '1'], {
        type: tabKey,
        source: String(needValidations),
        mode: 'v2',
      });
    }
  }, [tabKey, needValidations]);

  // 处理切换验证方式
  const onSwitchType = () => {
    sensorsRef.current = 1;
    kcsensorsClick([withDrawer ? 'sideswitch' : 'switch', '1']);

    setAutoSendCode(false);

    const curOtherValidations = needValidations.filter((i) => !i.includes(tabKey));

    if (needValidations?.length < 3) {
      setTabKey(curOtherValidations[0][0]);
    } else if (tabKey === 'google_2fa') {
      setTabKey(curOtherValidations[0][0]);
      setOtherValidations(curOtherValidations);
    } else {
      setTabKey('google_2fa');
    }
  };

  const isShowTab = useMemo(() => {
    return needValidations?.length === 3 && tabKey !== 'google_2fa';
  }, [needValidations, tabKey]);

  return (
    <Spin spinning={!!validateLoading} size="small">
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex="1">
          {/* 返回 */}
          <Box display="flex" mb={isSm ? 24 : 40} mt={isSm ? -16 : 0}>
            <Back onClick={goback}>
              <ICArrowRight2Outlined size="16" />
              <span> {t('8RcupwHqYraGhrjT8kAzG7')}</span>
            </Back>
          </Box>
          {/* 邮箱短信切换 */}
          {isShowTab && (
            <TabsContainer>
              <Tabs
                value={tabKey}
                onChange={(e, val) => setTabKey(val)}
                size={isSm ? 'small' : 'medium'}
              >
                {otherValidations.map((item) => {
                  const value = item[0];
                  return <Tab value={value} label={t(validations[value].name)} key={value} />;
                })}
              </Tabs>
            </TabsContainer>
          )}
          {/* title */}
          <Title withDrawer={withDrawer}>{validations[tabKey].title}</Title>
          {/* 通过此验证来证实您确实是该账号的所有者 */}
          <Subtitle>{t('tbMcSBnCx53jbCNjJpCuRf')}</Subtitle>

          {!!warnText && (
            <RiskAlert>
              <Alert title={t(warnText)} closable={false} type="warning" showIcon />
            </RiskAlert>
          )}

          {/* 验证方式 */}
          <>
            {validations[tabKey].render({
              validationType: tabKey.toUpperCase(),
              onSuccess,
              verifyCanNotUseClick,
              isSub,
            })}
          </>

          {/* 切换验证 */}
          {needValidations && needValidations.length > 1 ? (
            <Box display="flex" mt={24}>
              <SwichValidation onClick={onSwitchType}>
                {t('xcCmZ5VozosTsoC5igZNot')}
              </SwichValidation>
            </Box>
          ) : null}

          {/* 安全语 */}
          {showLoginSafeWord ? (
            <SafeWordBox mt={24}>
              <p className="safeword">
                <ICSecurityOutlined size="20" />
                <span>{loginSafeWord || t('login.safe.word')}</span>
              </p>
              <p className="safewordTips">
                {loginSafeWord ? t('has.login.safe.word.tips') : t('no.login.safe.word.tips')}
              </p>
            </SafeWordBox>
          ) : null}
        </Box>
      </Box>
    </Spin>
  );
}
