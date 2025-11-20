/**
 * Owner: john.zhang@kupotech.com
 */

import { useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import { getTargetSiteType } from '../../utils/site';
import ActivityCard from './ActivityCard';
import AssetCard from './AssetCard';
import BotCard from './BotCard';
import { DEFAULT_ONE_CLICK_PROGRESS, SKIP_STATUS } from './constants';
import ExpiredCard from './ExpiredCard';
import OneClickFooter from './layout/OneClickFooter';
import PageHeader from './layout/PageHeader';
import { Content, PageWrapper } from './layout/StyledComponents';
import OtherOrderCard from './OtherOrderCard';
import TradingOrderCard from './TradingOrderCard';

function OneClickProcess({ onBack, initProgress = DEFAULT_ONE_CLICK_PROGRESS, onContinue = null }) {
  // const [progress, setProgress] = useState([null, 0, 0, 0, 0, 0, 0]);
  const [progress, setProgress] = useState(initProgress);
  const targetSiteType = useSelector((state) =>
    getTargetSiteType(state.userTransfer?.userTransferInfo, state.userTransfer?.userTransferStatus),
  );

  const targetSiteName = getSiteName(targetSiteType);

  const updateProgress = (order, status) => {
    setProgress((prev) => prev.map((item, index) => (index === order ? status : item)));
  };

  return (
    <PageWrapper>
      <PageHeader
        onBack={onBack}
        pageTitle={_t('bc6e4d8b45f44800a6a9', { targetSiteName })}
        pageSubTitle={_t('eeb30f6ed91a4000aa57')}
        alertTips={<span>{_t('5552ce480a8b4000ada4')}</span>}
      />
      <Content>
        {initProgress[0] !== SKIP_STATUS && (
          <ActivityCard progress={progress} updateProgress={updateProgress} />
        )}
        {initProgress[1] !== SKIP_STATUS && (
          <BotCard progress={progress} updateProgress={updateProgress} />
        )}
        {initProgress[2] !== SKIP_STATUS && (
          <TradingOrderCard progress={progress} updateProgress={updateProgress} />
        )}
        {initProgress[3] !== SKIP_STATUS && (
          <OtherOrderCard progress={progress} updateProgress={updateProgress} />
        )}
        {initProgress[4] !== SKIP_STATUS && (
          <ExpiredCard progress={progress} updateProgress={updateProgress} />
        )}
        {initProgress[5] !== SKIP_STATUS && (
          <AssetCard progress={progress} updateProgress={updateProgress} />
        )}
      </Content>
      <OneClickFooter progress={progress} onBack={onBack} onContinue={onContinue} />
    </PageWrapper>
  );
}

export default OneClickProcess;
