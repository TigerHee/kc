import TraderProfileContent from 'pages/TraderProfile/TraderProfileContent';
import React, {memo} from 'react';

import StatusHeader from 'components/copyTradeComponents/TraderProfileComponents/StatusHeader';
import {useMeasureElementTTI} from 'utils/performance';
import {FollowActionArea} from './components/FollowActionArea';
import SelfEditActionSheet from './components/SelfEditActionSheet';
import {useEditMyProfile} from './hooks/useEditMyProfile';
import {usePullMyLeaderDetailQuery} from './hooks/usePullMyLeaderDetailQuery';
import {usePullSummaryQuery} from './hooks/usePullSummaryQuery';
import ProfileFooter from './ProfileFooter';
import {SelfPageLayout} from './styles';
import TraderInfoBannerContent from './TraderInfoBannerContent';
const TraderProfile = () => {
  const {handlePageRootLayout} = useMeasureElementTTI();

  const {data: summaryDataResp} = usePullSummaryQuery();
  const {data: leaderDetailResp} = usePullMyLeaderDetailQuery();
  const summaryData = summaryDataResp?.data || {};
  const {handleEditMyProfile, closeSelfEdit, isShowEditMyProfile} =
    useEditMyProfile();
  return (
    <>
      <SelfPageLayout
        onLayout={handlePageRootLayout}
        header={
          <StatusHeader
            rightSlot={<FollowActionArea status={summaryData.status} />}
          />
        }
        content={
          <TraderProfileContent
            bannerContent={
              <TraderInfoBannerContent
                summaryData={summaryData}
                handleEditMyProfile={handleEditMyProfile}
              />
            }
          />
        }
        footer={<ProfileFooter summaryData={summaryData} />}
      />

      <SelfEditActionSheet
        status={summaryData?.status}
        leadStatus={summaryData?.leadStatus}
        show={isShowEditMyProfile}
        toggleSheet={closeSelfEdit}
        leaderDetail={leaderDetailResp?.data}
      />
    </>
  );
};

export default memo(TraderProfile);
