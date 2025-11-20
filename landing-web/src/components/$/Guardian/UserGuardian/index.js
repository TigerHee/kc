/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useIsMobile } from 'components/Responsive';
import GuardPlan from './GuardPlan';
import FAQ from './FAQ';
import UserVoice from './UserVoice';
import BreakingNews from '../BreakingNews';
import BreakingNewsH5 from '../BreakingNewsH5';
import styles from './style.less';

const UserGuardian = React.memo(() => {
  const isMobile = useIsMobile();
  return (
    <div>
      <GuardPlan />
      <FAQ />
      <UserVoice />
      <div className={styles.breakingNews}>{isMobile ? <BreakingNewsH5 /> : <BreakingNews />}</div>
    </div>
  );
});

export default UserGuardian;
