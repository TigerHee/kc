import { useEffect, useState } from 'react';
import useLang from '../../../../hooks/useLang';
import {
  getRiskUserSecurityInfoUsingGet,
} from 'packages/verification/src/api/risk-validation-center';
import { getExtended, parseExtendedRequestOptionsFromJSON } from '../../../../utils/webauthn-json';
import { METHODS } from 'packages/verification/src/enums';
import styles from './styles.module.scss';
import { Button } from '@kux/design';
import SupplementInfo from '../SupplementInfo';
import { useVerification } from '../../model';
import { SCENE } from '../../../../enums';
import verifyingSrc from '../../../../../static/passkey/verifying.svg';
import failedSrc from '../../../../../static/passkey/failed.svg';
import goToSecurity from '../../../../utils/goToSecurity';
import { getTenantConfig } from '../../../../config/tenant';
import JsBridge from "tools/jsBridge";

enum STATUS {
  INIT = 'INIT',
  LOADING = 'LOADING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

interface PasskeyProps {
  selectedMethod: string[];
  otherMethods: string[][];
  supplement: string[][];
  canSwitch: boolean;
  onSwitch: () => void;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function Passkey({ selectedMethod, otherMethods, supplement, canSwitch, onSwitch, onSuccess, onCancel }: PasskeyProps) {
  const { t } = useLang();
  const { scene, setFormData, setScene, combineResult } = useVerification();
  const [status, setStatus] = useState(STATUS.INIT);

  const handleVerify = async () => {
    if (status !== STATUS.INIT) {
      return;
    }
    setStatus(STATUS.LOADING);
    try {
      // 调用端上 passkey 的 api 的 options 由后端下发
      // @ts-ignore 接口改造需要支持 transactionId 字段
      const authnOptions = await getRiskUserSecurityInfoUsingGet({ query: { transactionId: combineResult?.transactionId } });
      // 以下为使用浏览器 passkey 的具体实现，参考 passkey 登录的实现
      // 代码源自 packages/entrance/src/hookTool/usePasskeyLogin.js
      const authnData = JSON.parse(authnOptions?.data?.passkeyInfo ?? '{}');
      const request = { publicKey: { ...authnData } };
      const cco = parseExtendedRequestOptionsFromJSON(request);
      const res = await getExtended(cco);
      const jsonRes = res.toJSON();
      const credentialResponse = JSON.stringify(jsonRes);
      setFormData({ [METHODS.PASSKEY]: credentialResponse });
      setStatus(STATUS.SUCCESS);
      onSuccess();
    } catch (error) {
      setStatus(STATUS.FAILED);
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === STATUS.INIT) {
      handleVerify();
    }
  }, [status, selectedMethod]);

  useEffect(() => {
    if (
      // 当前是 passkey 页面
      scene === SCENE.PASSKEY ||
      // 不是补充信息页面且新选择的方案仍然包含 passkey
      scene !== SCENE.PASSKEY_SUPPLEMENT &&
      selectedMethod.includes(METHODS.PASSKEY)
    ) {
      setStatus(STATUS.INIT);
    }
  }, [scene, selectedMethod]);

  return (
    <div className={styles.container}>
      {scene === SCENE.PASSKEY_SUPPLEMENT ? (
        <>
          <SupplementInfo supplement={supplement} />
          <div className={styles.buttonGroup}>
            <Button
              size="large"
              type="primary"
              onClick={() => goToSecurity({ onCancel })}
            >
              {t('23d1f3bb2e214800ab9b')}
            </Button>
            <Button
              size="large"
              type="text"
              onClick={() => {
                setScene(SCENE.PASSKEY);
                handleVerify();
              }}
            >
              {t('1e7f45951fa74000a188')}
            </Button>
          </div>
        </>
      ) : status === STATUS.FAILED ? (
        <div className={styles.failedWrapper}>
          <img src={failedSrc} alt="failed" />
          <div className={styles.title}>{t('44b85c5826b64800a0c6')}</div>
          <div className={styles.desc}>{t('da0dc22804b54000a31f')}</div>
          <div className={styles.buttonGroup}>
            <Button type="primary" size="large" fullWidth onClick={() => setStatus(STATUS.INIT)}>
              {t('0301a3e092e44000ae85')}
            </Button>
            {
              // 有补充信息，显示切换按钮
              supplement?.length > 0 ||
              // 有其他组合且存在不包含 passkey 的组合，显示切换按钮
              canSwitch && otherMethods.some(methods => !methods.includes(METHODS.PASSKEY))
                ? (
                  <Button
                    size="large"
                    type="text"
                    fullWidth
                    onClick={() => {
                      if (canSwitch) {
                        onSwitch();
                      } else {
                        setScene(SCENE.PASSKEY_SUPPLEMENT);
                      }
                    }}
                  >
                    {t('d10b3b11531e4000ac30')}
                  </Button>
                )
                : (
                  <Button
                    size="large"
                    type="text"
                    fullWidth
                    onClick={() => {
                      const tenantConfig = getTenantConfig();
                      const isInApp = JsBridge.isApp();
                      if (isInApp) {
                        const encodeUrl = encodeURIComponent(tenantConfig.supportUrl);
                        JsBridge.open({ type: 'jump', params: { url: `/link?url=${encodeUrl}` } });
                        onCancel();
                      } else {
                        window.location.href = tenantConfig.supportUrl;
                      }
                    }}
                  >
                    {t('0f6b1e7dedc54000a647')}
                  </Button>
                )
            }
          </div>
        </div>
      ) : (
        <div className={styles.verifyingWrapper}>
          <img src={verifyingSrc} alt="verifying" />
          <div>{t('c24efe794fc64000a285')}</div>
        </div>
      )}
    </div>
  );
}
