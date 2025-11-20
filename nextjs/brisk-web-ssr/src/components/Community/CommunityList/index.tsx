import React, { useEffect } from 'react';
import styles from './index.module.scss';
import { useCommunityStore } from '@/store/community';
import PlatformItem from './PlatformItem';
import AnimatedContent from '@/components/CommonComponents/Animations/AnimatedContent';
import { add } from '@/tools/helper';

const DELAY_DURATION = 0.4;

const calculateDelayTime = index => {
  if (index === 0) {
    return DELAY_DURATION;
  }
  const result = add(DELAY_DURATION, index / 10);

  return result.toNumber();
};

const CommunityList: React.FC = () => {
  const { communityPlatformGroups, getCommunitys } = useCommunityStore();

  // 组件挂载时获取社群配置
  useEffect(() => {
    getCommunitys();
  }, []);

  // 如果没有平台数据，不渲染
  if (!communityPlatformGroups || communityPlatformGroups.length === 0) {
    return null;
  }

  return (
    <div className={styles.communityList}>
      {communityPlatformGroups.map((platformGroup, index) => (
        <div key={platformGroup.platform || index} className={styles.iconWrapper}>
          <AnimatedContent delay={calculateDelayTime(index)}>
            <PlatformItem platform={platformGroup.items?.[0]?.platform || ''} items={platformGroup.items} />
          </AnimatedContent>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
