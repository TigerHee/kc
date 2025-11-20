/**
 * Owner: will.wang@kupotech.com
 */
import { ICTradeAddOutlined } from '@kux/icons';
import { useResponsive, useTheme } from '@kux/mui-next';
import { useCallback, useEffect, useRef, useState } from 'react';
import ICSubOutLine from '@/assets/price/ICSubOutLine.svg';
import Preview from '../../Preview/Preview';
import styles from './style.module.scss';

export default ({ title, description, ...others }) => {
  const responsive = useResponsive();
  const theme = useTheme();
  const desRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);

  const setClientHeight = useCallback(() => {
    if (desRef.current) {
      const dividerHeight = responsive.sm ? 81 : 33;
      setHeight(desRef.current.clientHeight + dividerHeight);
    }
  }, [responsive.sm]);

  const handleOpen = useCallback(() => {
    setClientHeight();
    setOpen(!open);
  }, [open, setClientHeight]);

  useEffect(() => {
    setClientHeight();
  }, [setClientHeight]);

  return (
    <div className={styles.wrapper} onClick={handleOpen} {...others}>
      <span className={styles.titleWrapper}>
        <p className={styles.title}>{title}</p>
        {open ? (
          <img src={ICSubOutLine} alt="icon" />
        ) : (
          <ICTradeAddOutlined size={20} color="#1D1D1D" />
        )}
      </span>
      <div className={styles.animationContent}  style={{ height: open ? height : 0 }}>
        <div className={styles.divider} />
        <div className={styles.description} ref={desRef}>
          <Preview content={description || []} />
        </div>
      </div>
    </div>
  );
};