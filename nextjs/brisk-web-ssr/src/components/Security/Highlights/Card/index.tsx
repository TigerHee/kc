import { useEffect, useState } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { getSecurityContent } from '../../config';
import styles from './styles.module.scss';

export default function Card({ step }) {
  const { t } = useTranslation();

  const [showIcon, setShowIcon] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const data = getSecurityContent(step, t);

  useEffect(() => {
    // 300ms后开始显示icon和line动画
    const iconLineTimer = setTimeout(() => {
      setShowIcon(true);
      setShowLine(true);
      setShowContent(true);
    }, 300);

    // line动画完成后(800ms)显示内容
    // const contentTimer = setTimeout(() => {
    //   setShowContent(true);
    // }, 1100); // 300ms + 800ms

    return () => {
      clearTimeout(iconLineTimer);
      // clearTimeout(contentTimer);
    };
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <div className={styles.dotIconWrapper}>
          <div className={`${styles.dotIcon} ${showIcon ? styles.iconShow : ''}`} />
        </div>
        <div className={`${styles.line} ${showLine ? styles.lineAnimate : ''}`}></div>
      </div>
      <div className={`${styles.cardRight} ${showContent ? styles.contentShow : ''}`}>
        <h3>{data.title}</h3>
        {data.desc?.map(({ summary, detail }) => (
          <div className={styles.desc} key={summary}>
            <div>{summary}</div>
            <div>{detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
