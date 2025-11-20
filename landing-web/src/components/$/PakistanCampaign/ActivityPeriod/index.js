/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { STATE_TEXT_CONFIG, TIME_TEXT_CONFIG } from '../config';
import styles from './style.less';

const ActivityPeriod = ({ namespace = 'pakistanCampaign' }) => {
  const { status, startTime, endTime } = useSelector(state => state[namespace].config);
  const title = STATE_TEXT_CONFIG[namespace][status];
  const timeText = TIME_TEXT_CONFIG[namespace](startTime, endTime);

  return (
    <div className={styles.container} inspector="period">
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.time}>{timeText}</h4>
      <div className={styles.intro}>
        <div className={styles.introItems}>
          <p className={styles.introTitle}>Activity I.Exclusive Reward for New Users Only</p>
          <p className={styles.introContent}>
            During the campaign period, all new users who meet the following criteria can receive a
            random bonus ranging from 30 to 150 TRX.
          </p>
          <div className={styles.slice}>
            Criteria:
            <div className={styles.infoItems}>
              <div className={styles.infoIcon} />
              <p className={styles.infoContent}>
                Register for the activity by clicking “Join Now”;
              </p>
            </div>
            <div className={styles.infoItems}>
              <div className={styles.infoIcon} />
              <p className={styles.infoContent}>
                Make your first deposit of any amount of any crypto;
              </p>
            </div>
            <div className={styles.infoItems}>
              <div className={styles.infoIcon} />
              <p className={styles.infoContent}>
                Make your first trade of at least $10 worth of crypto.
              </p>
            </div>
          </div>
          <p className={styles.slice}>
            Prize:
            <br />A total bonus of <strong>50,000 TRX</strong> will be distributed on a first-come,
            first-served basis.
          </p>
        </div>
        <div className={styles.introItems}>
          <p className={styles.introTitle}>
            Activity II.Reward for Existing {window._BRAND_NAME_} Pakistani Users
          </p>
          <p className={styles.introContent}>
            During the campaign period, all eligible existing users who meet the following criteria
            can win <strong>an iPhone 13 and share a 70,000 TRX prize pool.</strong>
          </p>
          <div className={styles.slice}>
            Criteria:
            <div className={styles.infoItems}>
              <div className={styles.infoIcon} />
              <p className={styles.infoContent}>
                Deposit any amount of any crypto to your {window._BRAND_NAME_} account from an external wallet or
                another exchange;
              </p>
            </div>
            <div className={styles.infoItems}>
              <div className={styles.infoIcon} />
              <p className={styles.infoContent}>Trade at least $10 worth of any crypto.</p>
            </div>
          </div>
          <p className={styles.slice}>
            Prize:
            <br />
            All eligible participants will share a <strong>70,000 TRX</strong> prize pool.
            <br />
            One lucky eligible user will win an <strong>iPhone 13</strong>. Users with the highest
            trading volume will have more chances of winning the iPhone reward.
          </p>
        </div>
      </div>
      <div className={styles.period}>
        <div className={styles.periodLine} />
        <div className={styles.periodBlock} />
      </div>
    </div>
  );
};

export default ActivityPeriod;
