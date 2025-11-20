/**
 * Owner: willen@kupotech.com
 * UnopenedRedPacket component - converted to TypeScript with zustand and @kux/mui-next
 */
import useTranslation from '@/hooks/useTranslation';
import borderIcon from '@/static/redpacket/border.png';
import deleteIcon from '@/static/redpacket/delete.png';
import bg1 from '@/static/redpacket/group.png';
import topRightBg from '@/static/redpacket/topRightImg.png';
import background from '@/static/redpacket/background.png';
import openDisable from '@/static/redpacket/open-disable.png';
import { useRedPacketStore } from '@/store/redPacket';
import { useUserStore } from '@/store/user';
import { Form } from '@kux/mui-next';
import classnames from 'clsx';
import sensors, { trackClick } from 'gbiz-next/sensors';
import { debounce, isNil } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saTrackForBiz } from '@/tools/ga';

import FusionInputFormItem from './FusionInputFormItem';
import styles from './redPacket.module.scss';

import { getCurrentLang } from 'kc-next/boot';

const trackRegister = () => {
  const params = {
    source: 'redPacket',
    is_success: true,
    referral_code: '',
    is_futures_referral: false,
  };
  sensors.track('register_result', params);
};

/**
 * 字符串超过字符长度截断，并加上占位符返回
 * @param {string} str 字符串
 * @param {number} len 截取长度
 * @param {string} placeholder 占位符
 * @returns
 */
function truncateString(str: string, len: number = 50, placeholder: string = '...'): string {
  if (isNil(str) || isNil(len) || str.length <= len) {
    return str;
  }
  return str.substring(0, len) + placeholder;
}

interface UnopenedRedPacketProps {
  code: string;
  onOpen: () => void;
  onClose: () => void;
  receiving: boolean;
  setReceiving: (receiving: boolean) => void;
}

/**
 * 红包待领取页面 支持区号➕手机号 / 邮箱领取
 */
const UnopenedRedPacket: React.FC<UnopenedRedPacketProps> = ({
  code,
  onOpen,
  onClose,
  receiving,
  setReceiving,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const currentLang = getCurrentLang();
  const isZh = currentLang === 'zh_CN';

  /** account输入框是否有错误 初始值true代表校验不通过 */
  const [accountHasError, setAccountHasError] = useState<boolean>(true);

  // Zustand stores
  const {
    redPacketInfo,
    countryList,
    getReward,
    getReceiveInfo,
    setRedPacketAccount,
    getCountryList,
  } = useRedPacketStore();

  const isLogin = useUserStore((state) => state.isLogin);

  const {
    welfareStatus,
    isNewBee,
    currency,
    bestWishes,
    nickName,
    sendRecordId,
    extendUrl
  } = redPacketInfo;

  // 格式化后的祝福语
  const bestWishesStr = useMemo(() => truncateString(bestWishes || ''), [bestWishes]);
  // 红包已过期
  const isExpired = welfareStatus === 3;
  /** 账户输入值 */
  const _account = Form.useWatch('account', form);

  // 可以点击打开红包：已经登录 或者 未登录但填入通过校验的账户（区号+手机账号或邮箱）
  const canClickOpen = useMemo(() => {
    return isLogin || (_account && !accountHasError);
  }, [isLogin, _account, accountHasError]);

  const isRedExpose = useRef<boolean | null>(null);

  useEffect(() => {
    if (canClickOpen && !isLogin && !isRedExpose.current) {
      saTrackForBiz({}, ['RedpopUp', '1']);
      isRedExpose.current = true;
    }
  }, [isLogin, canClickOpen]);

  useEffect(() => {
    getCountryList();
  }, []);

  // 点击 开 逻辑
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isExpired || receiving) return;

      try {
        setReceiving(true);
        // 登录可直接领取
        if (isLogin) {
          getReceiveInfo(
            {
              isLogin,
              code,
              sendRecordId,
            },
            debounce(() => {
              getReward({ isLogin, code, t }, onOpen);
              setReceiving(false);
            }, 500),
          );
          trackClick(['ed_envelope', '1']);
        } else {
          // 未登录必须输入手机号
          form
            .validateFields()
            .then((values) => {
              setAccountHasError(false);
              saTrackForBiz({ saType: 'page_click' }, ['RedconfirmButton', '1']);
              const { countryCode, account } = values;
              // 有countryCode为区号 + 手机号 没有就是email
              const payload = !!countryCode
                ? { code, countryCode, phone: account }
                : { code, email: account };

              setRedPacketAccount({ ...payload, sendRecordId });

              getReceiveInfo(payload,
                debounce((data: any) => {
                  const { receive, welfareStatus: newWelfareStatus } = data || {};
                  /** 可以领取 */
                  const canReceive = newWelfareStatus !== 2 && !receive;
                  // 未领完且未领取--执行领取
                  if (canReceive) {
                    getReward({...payload, t}, (isNewUser) => {
                      setReceiving(false);
                      if (isNewUser) {
                        trackRegister();
                      }
                      onOpen();
                    });
                    // 已经领取过了，显示结果
                  } else {
                    setReceiving(false);
                    onOpen();
                  }
                }, 500),
              );
              trackClick(['ed_envelope', '1']);
            })
            .catch(() => {
              setAccountHasError(true);
              setReceiving(false);
            });
        }
      } catch {
        setReceiving(false);
      }
    },
    [
      code,
      form,
      isLogin,
      onOpen,
      sendRecordId,
      isExpired,
      receiving,
      setReceiving,
      getReward,
      getReceiveInfo,
      setRedPacketAccount,
    ],
  );

  /** 输入的时候要根据填入内容设置是否验证通过来设置红包按钮的样式 */
  const validateAccount = () => {
    form
      .validateFields()
      .then(() => {
        setAccountHasError(false);
      })
      .catch(() => {
        setAccountHasError(true);
      });
  };

  // 新人专享样式
  const renderNewBee = () => {
    return isNewBee ? (
      <span>
        <img src={topRightBg} alt="" className={styles.topRightBg} />
        <span className={styles.forNewText}>{isZh ? '新人专享' : 'Newbies Only'}</span>
      </span>
    ) : null;
  };

  // 红包状态：过期 > 输入手机号 > 祝福语
  const renderStatus = () => {
    if (isExpired) {
      return <span className={styles.content}>{t('redEnvelope.isExpired')}</span>;
    }
    if (!isLogin) {
      // 手机号/邮箱输入框
      return (
        <FusionInputFormItem
          form={form}
          countryList={countryList}
          isZh={isZh}
          lang={currentLang}
          shouldBlurValidate={false}
          onInputChange={validateAccount}
          onInputBlur={validateAccount}
          onChangeCountryCode={validateAccount}
        />
      );
    }
    return <span className={styles.bestWishes}>{bestWishesStr}</span>;
  };

  const renderOpenBtn = useMemo(() => {
    return (
      <div
        className={classnames(styles.openButton, {
          [styles.OpenButtonClickable]: canClickOpen,
        })}
        onClick={handleSubmit}
        style={{backgroundImage: `url(${openDisable})`}}
      />
    );
  }, [canClickOpen, handleSubmit]);

  return (
    <div className={styles.redPacketWrapper}>
      <div className={styles.bodyContent}>
        <Form className={styles.redPacketForm} form={form} onFinish={handleSubmit}>
          <div className={styles.redPacketBox}
            style={{backgroundImage: `url(${background})`}}
          >
            {/* 红包边框 start */}
            <img
              role="presentation"
              src={borderIcon}
              alt="borderIcon"
              className={styles.borderIcon}
            />
            {/* 红包边框 end */}
            {/* 红包封面 start */}
            {!!extendUrl ? (
              <div className={styles.packetCover}>
                <div className={styles.packetCoverBox}>
                  <img src={extendUrl} alt="" className={styles.packetCoverImg} />
                </div>
              </div>
            ) : null}
            {/* 红包封面 end */}
            <div className={classnames(styles.name, { [styles.textBg]: !!extendUrl })}>
              {nickName}
            </div>
            <div className={classnames(styles.title, { [styles.textBg]: !!extendUrl })}>
              {t('redEnvelope.forYou', { coin: currency })}
            </div>
            {renderStatus()}
            {!isExpired && renderOpenBtn}
            {renderNewBee()}
            {canClickOpen && !isExpired && <img src={bg1} alt="" className={styles.animationBg} />}
            {!isLogin && !isExpired && (
              <span className={styles.numberText}>{t('redEnvelope.inputPhoneNumber')}</span>
            )}
          </div>
        </Form>
      </div>
      <div className={styles.deleteIconBox}>
        <img
          role="presentation"
          src={deleteIcon}
          alt="deleteIcon"
          className={styles.deleteIcon}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default UnopenedRedPacket;
