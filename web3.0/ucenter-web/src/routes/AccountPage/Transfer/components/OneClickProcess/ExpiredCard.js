/**
 * Owner: jacky@kupotech.com
 */

import { every, isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { expireVoucher, queryTransferInvalidVoucher } from 'services/user_transfer';
import { _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import Card from './components/Card';
import { CardModal } from './components/Modal';
import { DONE_STATUS, REPORT_FAIL, REPORT_SUCCESS, RESOLVING_STATUS } from './constants';
import Step5Table from './TransferTable/Step5Table';
import { getCurrentCardOrderNumber, getStatus } from './utils';

const curOrderIndex = 4;
/**
 * 确认失效的卡券
 */
export default function ExpiredCard({ progress, updateProgress }) {
  const [open, setOpen] = useState(false);
  const [voucherData, setVoucherData] = useState();
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const errorMessage = useMessageErr();
  const reportRef = useRef({
    startTime: 0,
    duration: 0,
    clickStatus: '',
    user_target_siteType: '',
  });

  const total = voucherData?.voucherList?.length || 0;

  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);

  const handle = async () => {
    reportRef.current.startTime = Date.now();
    reportRef.current.user_target_siteType = userTransferInfo?.targetSiteType;
    try {
      const res = await expireVoucher({
        targetSiteType: userTransferInfo?.targetSiteType,
        originalSiteType: userTransferInfo?.originalSiteType,
      });
      if (res.success) {
        updateProgress(curOrderIndex, RESOLVING_STATUS);
        setOpen(false);
      }
    } catch (error) {
      errorMessage(error);
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_FAIL;
      trackClick(['activityButton5', 'step5Button'], reportRef.current);
    }
  };

  // const onRow = () => {
  //   window.open(addLangToPath('/land/KuRewards/coupons'));
  // };

  useEffect(() => {
    const status = getStatus(progress, curOrderIndex, voucherData);
    updateProgress(curOrderIndex, status);
    if (status === DONE_STATUS) {
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_SUCCESS;
      trackClick(['activityButton5', 'step5Button'], reportRef.current);
    }
  }, [progress[curOrderIndex - 1], progress[curOrderIndex], voucherData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const res = await queryTransferInvalidVoucher({
            targetSiteType: userTransferInfo?.targetSiteType,
            originalSiteType: userTransferInfo?.originalSiteType,
          });
          if (res.success && res.data) {
            setVoucherData(res.data);
          }
        } catch (error) {
          console.error('request error:', error);
          errorMessage(_t('4ab24c06e7c04000a359'));
        }
      });
    }
    return () => {
      end?.();
    };
  }, [userTransferInfo]);

  const orderText = getCurrentCardOrderNumber(curOrderIndex, progress);

  return (
    <Card
      title={_t('5044bb18d7ab4800aef1')}
      subTitle={_t('ebd8777337e24800aa2f', { targetSiteName })}
      btnTxt={`${_t('4ae3f94628e64000a566')} ${total ? `(${total})` : ''}`}
      note={_t('164a849554374000a1ef')}
      status={progress[curOrderIndex]}
      order={orderText}
      showContent={!(isEmpty(voucherData) || every(voucherData, (val) => isEmpty(val)))}
      onConfirm={() => {
        setOpen(true);
      }}
    >
      <Step5Table data={voucherData} />

      <CardModal
        open={open}
        title={_t('d45ddc8471084800a34c')}
        subtitle={_t('afcf7d8b142e4000a5a7')}
        onOk={handle}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}
