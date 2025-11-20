import { currentLang } from '@kucoin-base/i18n';
import { useEffect, useRef, useState } from 'react';
import { getAdvanceUrl } from 'src/services/ucenter/reset-security';
import siteConfig from 'utils/siteConfig';
import ExLoading from '../../ExLoading';
import * as styles from '../styles.module.scss';

export default function AdvanceWeb({ token, onSuccess, onFail }) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const [config, setConfig] = useState(null);

  useEffect(async () => {
    const { KUCOIN_HOST } = siteConfig;
    try {
      const { data } = await getAdvanceUrl({
        token,
        bizType: 'REBINDING_MUTIL',
        /** 没实际用途，不传还不行 */
        failedReturnUrl: KUCOIN_HOST,
        returnUrl: KUCOIN_HOST,
        iframeEnabled: true,
      });
      setConfig(data);
      setLoading(false);
    } catch (error) {
      onFail();
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      const { type, code } = event.data;
      if (type === 'complete') {
        switch (code) {
          case 'SUCCESS':
            onSuccess(config?.signatureId);
            break;
          default:
            onFail();
            break;
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [config]);

  return (
    <ExLoading loading={loading}>
      {config?.url ? (
        <iframe
          ref={iframeRef}
          className={styles.iframeWrapper}
          title="KYC Face Verification"
          onLoad={() => {
            // setLoading(false);
          }}
          src={`${config.url}&language=${currentLang}`}
          allow="camera;fullscreen;accelerometer;gyroscope;magnetometer;"
          allowFullScreen
          id="advanceIframe"
          scrolling="no"
          seamless
        />
      ) : null}
    </ExLoading>
  );
}
