/**
 * Owner: jesse.shao@kupotech.com
 */
import map from 'lodash/map';
import { _t } from 'utils/lang';
import styles from './styles.less';

const notices = [
  () => _t('choice.rule.detail.des1'),
  () => _t('choice.rule.detail.des2'),
  () => _t('choice.rule.detail.des3'),
  () => _t('choice.rule.detail.des4'),
  () => _t('choice.rule.detail.des5'),
  () => _t('choice.rule.detail.des6'),
];

const Rule = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.title}>{_t('choice.rule.detail.title')}</div>
        <div className={styles.notices}>
          {
            map(notices, (item, idx) => (
              <div key={idx} className={styles.notice}>{item()}</div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Rule;
