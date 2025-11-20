/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import { Link } from 'components/Router';
import AnimateBg from './AnimateBg';
// import JoinButton from '../JoinButton';
import styles from './style.less';

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <div className={styles.bg}>
        <AnimateBg />
      </div>
      <div className={styles.info}>
        <div className={styles.back}>
          <Link
            to={window.location.origin}
            target="_self"
          >
            {_t('eVEdpvzVgzuJYNHVpUxggB')}
          </Link>
        </div>
        <h3 inspector="title">
          {window._BRAND_NAME_} Labs
          <br />
          <small>Incubating the Future of Technologies</small>
        </h3>
        <h1 inspector="info">
          {window._BRAND_NAME_} Labs is the innovation engine committed to nurturing the next generation of Web3 pioneers. More than an investor, we are a dedicated partner, offering expert guidance, ecosystem resources, and strategic mentorship to help visionary projects navigate their journey from concept to reality.
        </h1>
        <h1>
          We believe the future is built, not found. This is why we build alongside the brightest minds to foster a robust and thriving decentralized world, focusing on foundational infrastructure, stablecoin, digital payment, DeFi, AI, RWA and other emerging technologies that will define the future.
        </h1>
        {/* <JoinButton /> */}
      </div>
    </div>
  );
};

export default Welcome;
