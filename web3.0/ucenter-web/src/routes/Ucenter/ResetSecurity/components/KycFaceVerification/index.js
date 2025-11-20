import JsBridge from '@knb/native-bridge';
import { Button, toast, useTheme } from '@kux/design';
import classNames from 'classnames';
import { isIOS } from 'helper';
import { useRef, useState } from 'react';
import { postFaceCheck } from 'services/ucenter/reset-security';
import { kycCheckFace } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import livingDark from 'static/account/kyc/ocr/nonDoc/living-dark.svg';
import livingErr1Dark from 'static/account/kyc/ocr/nonDoc/living-err1-dark.svg';
import livingErr1 from 'static/account/kyc/ocr/nonDoc/living-err1.svg';
import livingErr2Dark from 'static/account/kyc/ocr/nonDoc/living-err2-dark.svg';
import livingErr2 from 'static/account/kyc/ocr/nonDoc/living-err2.svg';
import livingErr3Dark from 'static/account/kyc/ocr/nonDoc/living-err3-dark.svg';
import livingErr3 from 'static/account/kyc/ocr/nonDoc/living-err3.svg';
import living from 'static/account/kyc/ocr/nonDoc/living.svg';
import ExLoading from '../ExLoading';
import * as commonStyles from '../styles.module.scss';
import AdvanceApp from './components/AdvanceApp';
import AdvanceWeb from './components/AdvanceWeb';
import * as styles from './styles.module.scss';

const IS_IN_APP = JsBridge.isApp();

export default function KycFaceVerification({ token, onNext }) {
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';
  const retryTimesRef = useRef(0);
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFail = (times = retryTimesRef.current + 1) => {
    if (times < 3) {
      toast.error(_t('selfService2.verify.fail.des2'));
      retryTimesRef.current = times;
      setStart(false);
    } else {
      // 超过 3 次进入下一步(人工审核)
      onNext();
    }
  };

  const handleSuccess = async (advanceLivenessId) => {
    try {
      setLoading(true);
      const source = IS_IN_APP ? (isIOS() ? 'ios' : 'android') : 'web';
      const bizType = 'REBINDING_MUTIL';
      const response = IS_IN_APP
        ? await kycCheckFace({
            app: source,
            bizType,
            livenessChannel: 'ADVANCE',
            advanceLivenessId,
            token,
          })
        : await postFaceCheck({
            source,
            bizType,
            advanceLivenessId,
            token,
          });
      const { result, livenessPhotoId } = response.data;
      // 人脸比对成功-》身份认证通过
      if (result) {
        onNext({ livenessPhotoId });
        // 人脸比对不成功-> 特定情况需要重试
      } else {
        handleFail(response.data.failTimes || 1);
      }
    } catch (error) {
      handleFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExLoading loading={loading} className={classNames(commonStyles.container, styles.container)}>
      {loading ? null : (
        <>
          <div className={commonStyles.header}>{_t('f88466ee664b4000a602')}</div>
          {start ? (
            IS_IN_APP ? (
              <AdvanceApp token={token} onSuccess={handleSuccess} onFail={handleFail} />
            ) : (
              <AdvanceWeb token={token} onSuccess={handleSuccess} onFail={handleFail} />
            )
          ) : (
            <>
              <div className={styles.content}>
                <div className={styles.living}>
                  <img src={isDark ? livingDark : living} alt="living" />
                </div>
                <div className={styles.livingWrongWrapper}>
                  <div className={styles.livingWrongItem}>
                    <img src={isDark ? livingErr1Dark : livingErr1} alt="livingErr1" />
                    <span>{_t('68aa4b658d5f4000a2b2')}</span>
                  </div>
                  <div className={styles.livingWrongItem}>
                    <img src={isDark ? livingErr2Dark : livingErr2} alt="livingErr2" />
                    <span>{_t('8e0005ed445f4000ab1d')}</span>
                  </div>
                  <div className={styles.livingWrongItem}>
                    <img src={isDark ? livingErr3Dark : livingErr3} alt="livingErr3" />
                    <span>{_t('9f5cc072dfd34000a7c0')}</span>
                  </div>
                </div>
              </div>
              <div className={styles.startBtnWrapper}>
                <Button type="primary" size="large" fullWidth onClick={() => setStart(true)}>
                  {_t('a0a876a2e5b94800aba7')}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </ExLoading>
  );
}
