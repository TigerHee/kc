/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { DRAW_CONFIG } from '../config';
import styles from './style.less';

const Draw = ({ namespace = 'luckydraw' }) => {
  const { config } = useSelector(state => state[namespace]);
  const { param = { secondUrl: '' } } = config;
  const drawConfig = DRAW_CONFIG[namespace];

  return (
    <div className={styles.conditions} inspector="how_to_draw">
      <div className={styles.inner}>
        <h2 className={styles.title}>{drawConfig.title}</h2>
        <div className={styles.content}>
          {drawConfig.content.map((item, index) => (
            <p
              inspector="how_to_contentItems"
              className={styles.contentItems}
              key={`draw_${index}`}
            >
              {item}
            </p>
          ))}
        </div>
        <div>
          {param.secondUrl ? (
            <img src={param.secondUrl} alt="winning-rules" className={styles.winImg} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Draw;
