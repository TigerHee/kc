/**
 * Owner: sean.shi@kupotech.com
 * 验证方式不可用的弹窗，包含了每个验证类型的未收到的提示，以及不可用的入口
 * 验证方式根据验证方式来渲染，如邮箱，短信，谷歌验证
 * feature1:点击发送语音验证码成功后，会关闭所有Modal
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { uniq, flattenDeep } from 'lodash-es';
import { ICArrowRightOutlined } from '@kux/icons';
import { Dialog, Divider, MDialog, ThemeProvider } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import addLangToPath from 'tools/addLangToPath';
import { getTenantConfig } from '../../config/tenant';
import { useCountDown, useLang } from '../../hookTool';
import DidNotReceiveCode from '../NewVoiceCode/NotReceiveDialog';
import NewVoiceCode from '../NewVoiceCode';
import { useLoginStore } from '../../Login/model';
import styles from './index.module.scss';

const initConfig = {
  my_email: {
    title: () => 'email',
    unavailable: (_t: any) => _t('323b3696b8044000aef2'),
    checkLabel: (_t: any) => _t('b9d2ddd6e9fb4000ae7b'),
    checkModalOpen: false,
  },
  my_sms: {
    title: () => 'phone',
    unavailable: (_t: any) => _t('c37faf26fbbe4000a231'),
    checkLabel: (_t: any) => _t('6f643b6277344000ae61'),
    checkModalOpen: false,
  },
  google_2fa: {
    title: (_t: any) => _t('g2fa.code'),
    unavailable: (_t: any) => _t('42bf96f8d65d4000a016'),
  },
};

interface SecurityVerificationUnavailableProps {
  open: boolean;
  onCancel?: () => void;
  validations?: string[];
  onSendVoice?: () => void;
  verifyCanNotUseClick?: (type: 'SMS' | 'GFA', token?: string, finishUpgrade?: boolean) => void;
  isSub?: boolean;
  trackingConfig?: Record<string, any>;
  finishUpgrade?: boolean;
  phone?: string;
  email?: string;
  countryCode?: string;
  token?: string;
  onOk?: (v: any) => void;
  countTime?: number;
  theme?: 'light' | 'dark';
}

export const SecurityVerificationUnavailable: React.FC<SecurityVerificationUnavailableProps> = ({
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
  countTime,
}) => {
  const [visible, setVisible] = useState(open);
  const { t } = useLang();
  const [config, setConfig] = useState(initConfig);
  const isH5 = useIsMobile();
  const [disable, setDisable] = useState(false);

  // zustand
  const smsRetryAfterSeconds = useLoginStore(state => state.smsRetryAfterSeconds);
  const update = useLoginStore(state => state.update);

  const handleOk = (v: any) => {
    onOk?.(v);
    onCancel();
  };

  const handleCheck = (key: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        checkModalOpen: true,
      },
    }));
  };

  const deadline = useMemo(
    () => (phone && countryCode && smsRetryAfterSeconds ? smsRetryAfterSeconds.deadline : 0),
    [countryCode, phone, smsRetryAfterSeconds]
  );

  const { countTime: countTimeFromStore } = useCountDown({
    deadline,
    onBegin: () => setDisable(true),
    onFinish: () => {
      setDisable(false);
      update?.({
        smsRetryAfterSeconds: { time: 0, deadline: 0 },
      });
    },
  });

  const handleUnavailable = (key: string) => {
    const tenantConfig = getTenantConfig();
    if (key === 'my_email') {
      window.open(addLangToPath(tenantConfig.common.emailNotAvailableUrl), '_blank');
    }
    if (key === 'my_sms') {
      verifyCanNotUseClick && verifyCanNotUseClick('SMS', token);
    }
    if (key === 'google_2fa') {
      verifyCanNotUseClick && verifyCanNotUseClick('GFA', token, finishUpgrade);
    }
  };

  const handleCloseCheckModal = (key: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        checkModalOpen: false,
      },
    }));
  };

  const allValidations = uniq(flattenDeep(validations ?? []));
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
      if (!jump) {
        setVisible(open);
      }
    } else {
      setVisible(open);
    }
  }, [open]);

  const renderContent = () => {
    if (allValidations?.length === 0) {
      return null;
    }
    let index = 0;
    return (
      <section className={styles.content}>
        {keys.map(key => {
          const info = config[key];
          if (key === 'google_2fa' && (!verifyCanNotUseClick || !token)) return null;
          if (key === 'google_2fa' && isSub) return null;
          const hasKey = allValidations.includes(key);
          if (hasKey) index++;
          return (
            hasKey && (
              <React.Fragment key={key}>
                {index !== 1 && isH5 && <Divider style={{ color: 'var(--kux-cover8)', margin: '8px 0' }} />}
                <div className={styles.typeContent}>
                  {allValidations.length > 1 && <div className={styles.title}>{info.title(t)}</div>}
                  {key !== 'google_2fa' && (
                    <div className={styles.item} onClick={() => handleCheck(key)}>
                      <div className={styles.typeInfoBox}>
                        <div className={styles.typeName}>{info.checkLabel(t)}</div>
                      </div>
                      <ICArrowRightOutlined className={styles.arrowIcon} />
                    </div>
                  )}
                  {!isSub && verifyCanNotUseClick && (
                    <div
                      className={styles.item}
                      onClick={() => handleUnavailable(key)}
                      style={{ marginTop: isH5 && key === 'google_2fa' ? '0px' : '16px' }}
                    >
                      <div className={styles.typeInfoBox}>
                        <div className={styles.typeName}>{info.unavailable(t)}</div>
                      </div>
                      <ICArrowRightOutlined className={styles.arrowIcon} />
                    </div>
                  )}
                </div>
              </React.Fragment>
            )
          );
        })}
      </section>
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
      <Dialog
        title={t('62315228e8884000a82d')}
        size="medium"
        cancelText={null}
        footer={null}
        open={visible}
        onCancel={onCancel}
        onOk={handleOk}
        className={styles.customDialog}
      >
        {renderContent()}
      </Dialog>
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
        <NewVoiceCode
          open={config.my_sms.checkModalOpen}
          trackingConfig={trackingConfig}
          phone={phone || '***'}
          countryCode={countryCode || ''}
          countTime={countTime ?? countTimeFromStore}
          disable={disable}
          onClose={closeParentModal => {
            handleCloseCheckModal('my_sms');
            if (closeParentModal) {
              onCancel();
            }
          }}
          onSend={onSendVoice}
        />
      )}
    </>
  );
};

export default (props: SecurityVerificationUnavailableProps) => {
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <SecurityVerificationUnavailable {...props} />
    </ThemeProvider>
  );
};
