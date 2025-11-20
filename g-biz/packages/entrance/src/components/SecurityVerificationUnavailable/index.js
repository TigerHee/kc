/**
 * Owner: corki.bai@kupotech.com
 * 验证方式不可用的弹窗，包含了每个验证类型的未收到的提示，以及不可用的入口
 * 验证方式根据验证方式来渲染，如邮箱，短信，谷歌验证
 * feature1:点击发送语音验证码成功后，会关闭所有Modal
 */

import { ICArrowRightOutlined } from '@kux/icons';
import { Dialog, Divider, MDialog, styled, ThemeProvider, useResponsive, useTheme } from '@kux/mui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { useTranslation } from '@tools/i18n';
import storage from '@utils/storage';
import addLangToPath from '@tools/addLangToPath';
import { useCountDown } from '../../hookTool';
import DidNotReceiveCode from '../NewVoiceCode/NotReceiveDialog';
import NewVoiceCodeV2 from '../NewVoiceCode/v2';

const CustomDialog = styled(Dialog)`
  & .KuxModalHeader-root {
    min-height: 90px;
    height: auto !important;
    padding: 32px 32px 24px;
  }
  & .KuxModalFooter-root {
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
  }
`;
const Content = styled.section`
  padding-bottom: 48px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px;
    padding-bottom: 34px;
  }
`;

const TypeContent = styled.div`
  & + & {
    margin-top: 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid ${(props) => props.theme.colors.cover12};
  ${(props) => props.theme.breakpoints.down('sm')} {
    border: none;
    padding: 0px;
    height: 48px;
  }
`;

const TypeInfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 14px;
  line-height: 130%;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 12px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 4px;
    padding-top: 8px;
  }
`;

const TypeName = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
`;

const ArrowIcon = styled(ICArrowRightOutlined)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.icon60};
`;

const initConfig = {
  my_email: {
    title: () => 'email',
    unavailable: (_t) => _t('323b3696b8044000aef2'),
    checkLabel: (_t) => _t('b9d2ddd6e9fb4000ae7b'),
    checkModalOpen: false,
  },
  my_sms: {
    title: () => 'phone',
    unavailable: (_t) => _t('c37faf26fbbe4000a231'),
    checkLabel: (_t) => _t('6f643b6277344000ae61'),
    checkModalOpen: false,
  },
  google_2fa: {
    title: (_t) => _t('g2fa.code'),
    unavailable: (_t) => _t('42bf96f8d65d4000a016'),
  },
};

export const SecurityVerificationUnavailable = ({
  namespace,
  open,
  onCancel = () => {},
  validations = [],
  onSendVoice = () => {},
  verifyCanNotUseClick,
  isSub = false,
  trackingConfig = {},
  finishUpgrade = false,
  phone = '',
  email = '',
  countryCode,
  token,
  onOk,
}) => {
  const [visible, setVisible] = useState(open);
  const { t } = useTranslation('entrance');
  const [config, setConfig] = useState(initConfig);
  const theme = useTheme();
  const { smsRetryAfterSeconds, loadingSms } = useSelector((state) => state[namespace]);
  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(false);
  const handleOk = (v) => {
    onOk(v);
    onCancel();
  };

  const handleCheck = (key) => {
    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        checkModalOpen: true,
      },
    }));
  };

  const deadline = useMemo(
    () => (phone && countryCode && smsRetryAfterSeconds ? smsRetryAfterSeconds.deadline : 0),
    [countryCode, phone, smsRetryAfterSeconds],
  );

  const { countTime } = useCountDown({
    deadline,
    onBegin: () => {
      setDisable(true);
    },
    onFinish: () => {
      setDisable(false);
      dispatch({
        type: `${namespace}/update`,
        payload: {
          smsRetryAfterSeconds: { time: 0, deadline: 0 },
        },
      });
    },
  });

  const handleUnavailable = (key) => {
    if (key === 'my_email') {
      // 分别使用各自站点的邮箱不可用链接
      window.open(
        addLangToPath(tenantConfig.common.emailNotAvailableUrl, storage.getItem('kucoinv2_lang')),
        '_blank',
      );
    }
    if (key === 'my_sms') {
      verifyCanNotUseClick && verifyCanNotUseClick('SMS', token);
    }

    if (key === 'google_2fa') {
      verifyCanNotUseClick && verifyCanNotUseClick('GFA', token, finishUpgrade);
    }
  };

  const handleCloseCheckModal = (key) => {
    setConfig((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        checkModalOpen: false,
      },
    }));
  };

  const allValidations = [...new Set(validations?.flat())]; // 支持传一维&二维数组
  const keys = Object.keys(initConfig);

  // 如果只有Google 2FA 校验不可用，直接跳转
  const google2faJump = () => {
    if (!isSub && verifyCanNotUseClick) {
      if (allValidations?.length === 1 && allValidations.includes('google_2fa')) {
        handleUnavailable('google_2fa');
        return true;
      }
    }
    return false;
  };

  const google2faJumpRef = useRef(google2faJump);
  google2faJumpRef.current = google2faJump;

  useEffect(() => {
    if (open) {
      const jump = google2faJumpRef.current();
      // 没跳转 就打开弹窗，跳转的话，弹窗就不要打开
      if (!jump) {
        setVisible(open);
      }
    } else {
      // 弹窗关闭的时候要及时更新
      setVisible(open);
    }
  }, [open]);

  const renderContent = () => {
    if (allValidations?.length === 0) {
      return null;
    }
    let index = 0;
    return (
      <Content>
        {keys.map((key) => {
          const info = config[key];
          // 谷歌验证必须有verifyCanNotUseClick和token才会展示
          if (key === 'google_2fa' && (!verifyCanNotUseClick || !token)) {
            return null;
          }
          // 子账号也不展示谷歌验证
          if (key === 'google_2fa' && isSub) {
            return null;
          }
          const hasKey = allValidations.includes(key);
          if (hasKey) {
            index++;
          }
          return (
            hasKey && (
              <React.Fragment key={key}>
                {index !== 1 && isH5 && (
                  <Divider style={{ color: theme.colors.cover8, margin: '8px 0' }} />
                )}
                <TypeContent key={key}>
                  {allValidations.length > 1 && <Title>{info.title(t)}</Title>}
                  {key !== 'google_2fa' && (
                    <Item onClick={() => handleCheck(key)}>
                      <TypeInfoBox>
                        <TypeName>{info.checkLabel(t)}</TypeName>
                      </TypeInfoBox>
                      <ArrowIcon />
                    </Item>
                  )}
                  {!isSub && verifyCanNotUseClick && (
                    <Item
                      onClick={() => handleUnavailable(key)}
                      style={{ marginTop: isH5 && key === 'google_2fa' ? '0px' : '16px' }}
                    >
                      <TypeInfoBox>
                        <TypeName>{info.unavailable(t)}</TypeName>
                      </TypeInfoBox>
                      <ArrowIcon />
                    </Item>
                  )}
                </TypeContent>
              </React.Fragment>
            )
          );
        })}
      </Content>
    );
  };

  const renderDialog = () => {
    if (isH5) {
      return (
        <MDialog
          back={false}
          title={t('62315228e8884000a82d')}
          show={visible}
          onClose={onCancel}
          onOk={onCancel}
          onCancel={onCancel}
          maskClosable
          centeredFooterButt
          footer={null}
          height="auto"
        >
          {renderContent()}
        </MDialog>
      );
    }
    return (
      <CustomDialog
        title={t('62315228e8884000a82d')}
        size="medium"
        cancelText={null}
        footer={null}
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
      >
        {renderContent()}
      </CustomDialog>
    );
  };

  return (
    <>
      {renderDialog()}
      <DidNotReceiveCode
        onClose={() => handleCloseCheckModal('my_email')}
        open={config.my_email.checkModalOpen}
        email={email || '***'}
        isFromPhoneRegister={!!phone}
      />
      {config.my_sms.checkModalOpen && (
        <NewVoiceCodeV2
          open={config.my_sms.checkModalOpen}
          trackingConfig={trackingConfig}
          phone={phone || '***'}
          countryCode={countryCode || ''}
          countTime={countTime}
          loading={loadingSms}
          disable={disable}
          // onTimeOver={offDisabled}
          onClose={(closeParentModal) => {
            handleCloseCheckModal('my_sms');
            if (closeParentModal) {
              onCancel(); // 发送验证码成功关闭父弹窗
            }
          }}
          onSend={onSendVoice}
        />
      )}
    </>
  );
};

export default (props) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SecurityVerificationUnavailable {...props} />
    </ThemeProvider>
  );
};
