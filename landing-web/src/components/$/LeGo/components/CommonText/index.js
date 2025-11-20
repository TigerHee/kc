/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { map } from 'lodash';
import classnames from 'classnames';
import { getText } from 'components/$/LeGo/config';
import styles from './style.less';

const CommonText = ({ content }) => {
  const { translate } = useSelector(state => state.lego);
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h2 className={styles.title} data-block-title>
          {getText(content.title, translate)}
        </h2>
        <div className={styles.content}>
          {map(getText(content.text, translate, true), (item, index) => {
            // 首字母是数字 第二行需要缩进样式
            const needIndent = /^[0-9]/.test(item);
            return (
              <p
                data-block-content
                className={classnames(styles.contentItems, { [styles.textIndent]: needIndent })}
                key={index}
              >
                {item}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CommonText);
