/**
 * Owner: jacky@kupotech.com
 */

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { queryTransferActivity, quiteCampaign } from 'services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import Card from './components/Card';
import { CardModal } from './components/Modal';
import { DONE_STATUS, REPORT_FAIL, REPORT_SUCCESS, RESOLVING_STATUS } from './constants';
import Step1Table from './TransferTable/Step1Table';
import { getStatus, isDone } from './utils';

// 当前步骤的下标
const curOrderIndex = 0;

export default function ActivityCard({ progress, updateProgress }) {
  const [open, setOpen] = useState(false);
  const [activityData, setActivityData] = useState();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const errMessage = useMessageErr();
  const total = activityData?.campaignList?.length || 0;
  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType) || '';
  const reportRef = useRef({
    startTime: 0,
    duration: 0,
    clickStatus: '',
    user_target_siteType: '',
  });

  const handle = async () => {
    reportRef.current.startTime = Date.now();
    reportRef.current.user_target_siteType = userTransferInfo?.targetSiteType;

    try {
      const res = await quiteCampaign({
        targetSiteType: userTransferInfo?.targetSiteType,
        originalSiteType: userTransferInfo?.originalSiteType,
      });
      if (res.success) {
        updateProgress(curOrderIndex, RESOLVING_STATUS);
        setOpen(false);
      }
    } catch (error) {
      errMessage(error);
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_FAIL;
      trackClick(['activityButton1', 'step1Button'], reportRef.current);
    }
  };

  const onRow = (record) => {
    if (record.activityUrl) {
      window.open(addLangToPath(record.activityUrl));
    }
  };

  useEffect(() => {
    const status = getStatus(progress, curOrderIndex, activityData);
    updateProgress(curOrderIndex, status);
    if (status === DONE_STATUS) {
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_SUCCESS;
      trackClick(['activityButton1', 'step1Button'], reportRef.current);
    }
  }, [progress[curOrderIndex], activityData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const { data, success } = await queryTransferActivity({
            targetSiteType: userTransferInfo?.targetSiteType,
            originalSiteType: userTransferInfo?.originalSiteType,
          });
          if (success && data) setActivityData(data);
        } catch (error) {
          console.error('request error:', error);
          errMessage(_t('4ab24c06e7c04000a359'));
        }
      });
      return () => {
        end?.(); // 清理轮询
      };
    }
  }, [userTransferInfo]);

  return (
    <Card
      title={_t('21c9b63c2dbd4800a71e')}
      subTitle={_t('e46d963dfe1b4000ad4b', { targetSiteName })}
      btnTxt={`${_t('f0485940e1594000a33f')} ${total ? `(${total})` : ''}`}
      status={progress[curOrderIndex]}
      // 第一项固定为1
      order={1}
      showContent={!!activityData && !isDone(activityData)}
      onConfirm={() => {
        setOpen(true);
      }}
    >
      <Step1Table data={activityData} onRow={onRow} />
      <CardModal
        open={open}
        title={_t('80f0e84827a14000a610')}
        subtitle={_t('91f054be42fb4800ad82')}
        onOk={handle}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}
