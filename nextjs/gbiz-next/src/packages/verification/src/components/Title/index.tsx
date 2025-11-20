import { useMemo } from 'react';
import useLang from '../../hooks/useLang';
import { useVerification } from '../Verification/model';
import styles from './styles.module.scss';
import { SCENE } from '../../enums';

export default function Title() {
  const { t } = useLang();
  const { scene } = useVerification();
  
  const title = useMemo(() => {
    switch (scene) {
      case SCENE.PASSKEY:
        return t('d7df779227394000afd7');
      case SCENE.PASSKEY_SUPPLEMENT:
        return t('safe_verify_matching_empty_title');
      case SCENE.OTP:
        return t('b33911daa6f64000a907');
      case SCENE.ERROR_40016:
        return null;
      case SCENE.ERROR_40017:
        return null;
      case SCENE.ERROR_50005:
      case SCENE.ERROR_500017:
        return t('safe_verify_matching_empty_title');
      case SCENE.ERROR_DEFAULT:
        return null;
    }
  }, [scene, t]);

  return <div className={styles.title}>{title}</div>;
}