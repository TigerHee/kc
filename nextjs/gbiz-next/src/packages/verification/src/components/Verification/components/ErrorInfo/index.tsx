/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useMemo } from 'react';
import { Button, Empty } from '@kux/design';
import addLangToPath from 'tools/addLangToPath';

import useLang from '../../../../hooks/useLang';
import { ERROR_CODE, METHODS } from '../../../../enums';
import plugins from '../../../../plugins';
import SupplementInfo from '../SupplementInfo';
import styles from './styles.module.scss';
import { getTenantConfig } from '../../../../config/tenant';
import goToSecurity from '../../../../utils/goToSecurity';
import JsBridge from "tools/jsBridge";
import { getSiteConfig } from 'kc-next/boot';

interface ErrorInfoProps {
  bizType: string;
  code: string;
  supplement: string[][];
  onCancel?: () => void;
}

const gotoSupport = ({ onCancel }: { onCancel?: () => void }) => {
  const tenantConfig = getTenantConfig();
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    const encodeUrl = encodeURIComponent(tenantConfig.supportUrl);
    JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeUrl}` } });
    onCancel?.();
  } else {
    window.location.href = tenantConfig.supportUrl;
  }
}

const goToPasskey = ({ onCancel }: { onCancel?: () => void }) => {
  const isInApp = JsBridge.isApp();
  const siteConfig = getSiteConfig();
  const { KUCOIN_HOST = '' } = siteConfig;
  const url = '/account/security/passkey';
  if (isInApp) {
    const encodeUrl = encodeURIComponent(`${KUCOIN_HOST}${url}?appNeedLang=true`);
    JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeUrl}` } });
    onCancel?.();
  } else {
    window.location.href = addLangToPath(url);
  }
}

const ErrorInfo = (props: ErrorInfoProps) => {
  const { bizType, code, supplement = [] } = props;
  const { t, currentLang } = useLang();

  const {
    title,
    content,
    showIcon,
    showConfirmBtn,
    confirmText,
    onConfirm,
    showCancelBtn,
    cancelText,
    onCancel,
  } = useMemo(() => {
    const defaultOptions = {
      title: t('b366f2b9d78c4000aa81'),
      content: t('e251b3cadd6d4000af2f'),
      showIcon: true,
      confirmText: t('605e70c9ac094000a1e1'),
      onConfirm: props.onCancel,
      showConfirmBtn: true,
      cancelText: t('1ffb610866f64000ae3d'),
      onCancel: props.onCancel,
      showCancelBtn: false,
    };

    try {
      switch (code) {
        case ERROR_CODE.RISK_REJECTION:
          return {
            ...defaultOptions,
            title: t('b8c839b1e2124800a7ce'),
            content: t('0956d0432a7c4800a709'),
            confirmText: t('0f6b1e7dedc54000a647'),
            onConfirm: () => gotoSupport({ onCancel: props.onCancel }),
            showCancelBtn: true,
            cancelText: t('back'),
          };
        case ERROR_CODE.MATCHING_TIMEOUT:
          return {
            ...defaultOptions,
            title: t('97b3cfcb0ce04000ae58'),
            content: t('ce11a865f2084000a327'),
          };
        case ERROR_CODE.GO_TO_MAIN_ACCOUNT:
        case ERROR_CODE.GO_TO_SECURITY: {
          const _supplement =
            supplement?.filter?.((list) =>
              list.every((key) => {
                return plugins.get(key)?.enable();
              }),
            ) ?? [];
          if (!_supplement?.length) {
            throw new Error('Supplement is illegal !');
          }
          const hasPasskey = _supplement.some(methods => methods.includes(METHODS.PASSKEY));
          const isSub = code === ERROR_CODE.GO_TO_MAIN_ACCOUNT;
          const isForgetPassword = ['RV_RESET_EMAIL_LP', 'RV_RESET_PHONE_LP'].includes(bizType);
          return {
            ...defaultOptions,
            title: t('safe_verify_matching_empty_title'),
            content: <SupplementInfo supplement={_supplement} isSub={isSub} />,
            showIcon: false,
            ...(
              isSub
                // 子账号不支持跳到安全中心
                ? {
                  confirmText: t('safe_verify_matching_empty_goto_setting'),
                  onConfirm: props.onCancel,
                  showCancelBtn:false,
                }
                // 主账号保留原有跳转逻辑
                : {
                  confirmText: isForgetPassword
                  ? t('0f6b1e7dedc54000a647')
                  : hasPasskey
                    ? t('efc138f869364000af5b')
                    : t('safe_verify_matching_empty_goto_setting'),
                  onConfirm: () => {
                    if (isForgetPassword) {
                      gotoSupport({ onCancel: props.onCancel });
                    } else if (hasPasskey) {
                      goToPasskey({ onCancel: props.onCancel });
                    } else {
                      goToSecurity({ onCancel: props.onCancel });
                    }
                  },
                  showCancelBtn: !isForgetPassword &&hasPasskey,
                  cancelText: t('01687958ad4f4800aa8d'),
                  onCancel: () => goToSecurity({ onCancel: props.onCancel }),
                }
            ),
          };
        }
        default:
          return defaultOptions;
      }
    } catch (err) {
      console.error(err);
      return defaultOptions;
    }
  }, [code, supplement, t, props, currentLang]);

  return (
    <div className={`${styles.errorContainer} ${!showIcon ? styles.noIcon : ''}`}>
      {
        showIcon
          ? <Empty
              name="error"
              size="small"
              title={title}
              description={content}
            />
          : <div className={`${styles.errorContent} ${!showIcon ? styles.noIcon : ''}`}>{content}</div>
      }
      <div className={styles.errorFooter}>
        {showConfirmBtn ? (
          <Button data-testid="error-dialog-confirm" type="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        ) : null}
        {showCancelBtn ? (
          <Button data-testid="error-dialog-cancel" type="text" onClick={onCancel}>
            {cancelText}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorInfo;
