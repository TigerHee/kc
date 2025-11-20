/**
 * Owner: jacky@kupotech.com
 */

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { closeBizPosition, queryTransferBizPosition } from 'src/services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import Card from './components/Card';
import { CardModal } from './components/Modal';
import Tab from './components/Tab';
import { DONE_STATUS, REPORT_FAIL, REPORT_SUCCESS, RESOLVING_STATUS } from './constants';
import Step4Table from './TransferTable/Step4Table';
import { TableNote } from './TransferTable/TableExternal';
import { getCurrentCardOrderNumber, getStatus, isDone } from './utils';

const curOrderIndex = 3;

/**
 * 撤销持有仓位，负债等订单
 */
export default function OtherOrderCard({ progress, updateProgress }) {
  const [open, setOpen] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [curTab, setCurTab] = useState();
  const [remoteData, setRemoteData] = useState();
  const errorMessage = useMessageErr();
  const reportRef = useRef({
    startTime: 0,
    duration: 0,
    clickStatus: '',
    user_target_siteType: '',
  });

  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);

  const total = tabs.reduce((sum, tab) => sum + tab.count, 0);

  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);

  const baseTabs = [
    {
      label: _t('71d3c9a178e84000a019'),
      value: 'futuresPositionList',
      note: _t('f419483f4d784000ae22', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/futures/open-order'),
      },
    },
    {
      label: _t('0e377959b0d94000aa2a'),
      value: 'marginOptionList',
      note: _t('0dbf76378f264800a452', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/option-simple/BTC-USDT'),
      },
    },
    {
      label: _t('d54548d0007d4000a2f8'),
      value: 'marginPositionList',
      note: _t('69ebf718580e4000a61d', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/margin'),
      },
    },
    {
      label: _t('62a82fe7cf384000ae6c'),
      value: 'marginIsolatedPositionList',
      note: _t('4ba2fcebc75a4800aa55', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/isolated/current'),
      },
    },
    {
      label: _t('8df51d62616d4000a62b'),
      value: 'leveragedTokensList',
      note: _t('259e2411f5b74800a5de', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/assets/trade-account'),
      },
    },
  ];

  const handle = async () => {
    reportRef.current.startTime = Date.now();
    reportRef.current.user_target_siteType = userTransferInfo?.targetSiteType;

    try {
      const res = await closeBizPosition({
        targetSiteType: userTransferInfo?.targetSiteType,
        bizType: tabs.map((tab) => tab.value),
      });
      if (res.success) {
        updateProgress(curOrderIndex, RESOLVING_STATUS); // 更新进度状态
        setOpen(false);
      }
    } catch (error) {
      errorMessage(error);
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_FAIL;
      trackClick(['activityButton4', 'step4Button'], reportRef.current);
    }
  };

  const onRow = () => {
    window.open(addLangToPath(curTab.link.href));
  };

  useEffect(() => {
    const status = getStatus(progress, curOrderIndex, remoteData);
    updateProgress(curOrderIndex, status);
    if (status === DONE_STATUS) {
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_SUCCESS;
      trackClick(['activityButton4', 'step4Button'], reportRef.current);
    }
  }, [progress[curOrderIndex - 1], progress[curOrderIndex], remoteData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const { success, data } = await queryTransferBizPosition({
            targetSiteType: userTransferInfo?.targetSiteType,
          });
          if (success && data) {
            const newTabs = [];
            baseTabs.forEach((tab) => {
              if (data[tab.value] && data[tab.value].length) {
                newTabs.push({
                  ...tab,
                  count: data[tab.value].length,
                  label: `${tab.label} (${data[tab.value].length})`,
                });
              }
            });
            setTabs(newTabs);
            setRemoteData(data);
          }
        } catch (error) {
          console.error('request error:', error);
          errorMessage(_t('4ab24c06e7c04000a359'));
        }
      });
    }
    return () => {
      end?.(); // 清理轮询
    };
  }, [userTransferInfo?.targetSiteType]);

  useEffect(() => {
    const hasOldTab = tabs.some((tab) => tab.value === curTab?.value);
    if (!hasOldTab && tabs.length) setCurTab(tabs[0]);
  }, [tabs, curTab]);

  const orderText = getCurrentCardOrderNumber(curOrderIndex, progress);

  return (
    <Card
      title={_t('14b5742d5f5e4800a6f0')}
      subTitle={_t('f260a8c3467a4000abf7', { targetSiteName })}
      btnTxt={`${_t('f0485940e1594000a33f')} ${total ? `(${total})` : ''}`}
      note={_t('164a849554374000a1ef')}
      status={progress[curOrderIndex]}
      order={orderText}
      showContent={!!remoteData && !!curTab && !isDone(remoteData)}
      onConfirm={() => {
        setOpen(true);
      }}
    >
      <Tab tabs={tabs} curTab={curTab} onChange={setCurTab} />
      <TableNote>{_t('f419483f4d784000ae22', { targetSiteName })}</TableNote>
      <Step4Table data={remoteData} curTab={curTab} tabs={baseTabs} onRow={onRow} />
      <CardModal
        open={open}
        title={_t('72220c8f0e1f4000a29d')}
        subtitle={_t('921752f09a104800a46c')}
        items={tabs.map((item) => item.label)}
        warning={_t('a2dadd06389f4800ac1f')}
        note={_t('b6a7c0274d344000a491')}
        onOk={handle}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}
