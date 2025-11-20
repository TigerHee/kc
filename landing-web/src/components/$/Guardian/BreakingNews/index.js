/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import clxs from 'classnames';
import { _t } from 'utils/lang';
import styles from './style.less';

import timeAxisImg from 'assets/guardian/time_axis.svg';

const BreakingNews = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{_t('brand.promotion.news.title')}</div>
      <div className={styles.newsList}>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date1')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news1')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date2')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news2')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date3')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news3')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date4')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news4')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date5')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news5')}</div>
        </div>
      </div>
      <img src={timeAxisImg} alt="timeAxis" />
      <div className={clxs(styles.newsList, styles.down)}>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date6')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news6')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date7')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news7')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date8')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news8')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date9')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news9')}</div>
        </div>
        <div className={styles.news}>
          <div className={styles.newsDate}>{_t('brand.promotion.news.date10')}</div>
          <div className={styles.newsContent}>{_t('brand.promotion.news.news10')}</div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
