/**
 * Owner: will.wang@kupotech.com
 */
import { useCallback, useEffect, useState } from 'react';
import { ThumbsUpAni } from './animation';
import Content from './Content';
import styles from './index.module.scss';

let timer;

const NewBet = () => {
  const [actived, setActived] = useState(true);

  useEffect(() => {
    if (!actived && timer) clearInterval(timer);
    if (actived) {
      const thumbsUpAni = new ThumbsUpAni();
      thumbsUpAni.context.fillStyle = 'rgba(255, 255, 255, 0)';

      timer = setInterval(() => {
        thumbsUpAni.start();
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [actived]);

  const closeAminate = useCallback(() => {
    setActived(false);
  }, []);

  return (
    <div className={styles.wrapper}>
      <Content closeAminate={closeAminate} />
    </div>
  );
};
export default NewBet;