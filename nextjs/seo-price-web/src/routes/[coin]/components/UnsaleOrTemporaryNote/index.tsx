/**
 * Owner: will.wang@kupotech.com
 */
import { Tooltip } from '@kux/mui-next';
import useTranslation from "@/hooks/useTranslation";
import { useMemo } from 'react';
import styles from './styles.module.scss';


export default function UnsaleOrTemporaryNote() {
  const { _t } = useTranslation();

  const tipText = _t('nvsNkb3R1PBU3hwgiC6VCu');
  const noteText = _t('5F6GXQVVko78bQdLkxqcFW');

  const texts = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const continer = document.createElement('div');
    continer.innerHTML = noteText;

    return {
      textOne: (continer.childNodes[0] as HTMLSpanElement).innerText,
      textTwo: (continer.childNodes[1] as HTMLSpanElement).textContent,
      textThree: (continer.childNodes[2] as HTMLSpanElement).innerText,
      textFour: (continer.childNodes[3] as HTMLSpanElement).textContent,
    }
  }, [noteText])

  return (
    <p className={styles.tipContent}>
      <span className={styles.klineReminder}>{texts?.textOne}</span>
      {texts?.textTwo}
      <Tooltip title={tipText} placement="top">
        <span className={styles.partnerName}>{texts?.textThree}</span>
      </Tooltip>
      {texts?.textFour}
    </p>
  );
}