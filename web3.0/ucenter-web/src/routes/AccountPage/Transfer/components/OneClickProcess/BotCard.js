/**
 * Owner: jacky@kupotech.com
 */

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  closeCloudxCopyTradingEarn,
  queryTransferRobotCopyTradingEarn,
} from 'services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import Card from './components/Card';
import { CardModal } from './components/Modal';
import Tab from './components/Tab';
import { DONE_STATUS, REPORT_FAIL, REPORT_SUCCESS, RESOLVING_STATUS } from './constants';
import Step2Table from './TransferTable/Step2Table';
import { TableNote } from './TransferTable/TableExternal';
import { getCurrentCardOrderNumber, getStatus, isDone } from './utils';

const curOrderIndex = 1;

export default function BotCard({ progress, updateProgress }) {
  const [open, setOpen] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [curTab, setCurTab] = useState();
  const [remoteData, setRemoteData] = useState({});
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const errMessage = useMessageErr();
  const reportRef = useRef({
    startTime: 0,
    duration: 0,
    clickStatus: '',
    user_target_siteType: '',
  });

  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);

  const baseTabs = [
    {
      label: _t('new.currency.trading'),
      value: 'cloudxList',
      count: 0,
      note: _t('3cdd4dc956114000a184'),
      link: {
        href: addLangToPath('/order/trading-bot'), // app 不需跳转
      },
    },
    {
      label: _t('assets.overview.menu.follow'),
      value: 'copyTradingList',
      count: 0,
      note: _t('3cdd4dc956114000a184'),
      link: {
        href: addLangToPath('/assets/follow'), // app 不需跳转
        text: _t('ce3059a186ba4800aed2'),
      },
    },
    {
      label: _t('follow.leading'),
      value: 'leadTrading',
      count: 0,
      note: _t('f791bda1e3134800a898', { targetSiteName }),
      link: { href: addLangToPath('/assets/follow'), text: _t('47e45582a2404800a4d1') }, // app 不需跳转
    },
    {
      label: _t('f841f892d4c74800a7a1'),
      value: 'earnList',
      count: 0,
      note: _t('d1bf32a187c14000a463', { targetSiteName }),
      link: { href: addLangToPath('/assets/earn-account'), text: _t('d2c77210260a4800ad8f') }, // app 不需跳转
    },
  ];

  const total = tabs.reduce((sum, tab) => sum + tab.count, 0);

  const handle = async () => {
    reportRef.current.startTime = Date.now();
    reportRef.current.user_target_siteType = userTransferInfo?.targetSiteType;
    try {
      const res = await closeCloudxCopyTradingEarn({
        targetSiteType: userTransferInfo?.targetSiteType,
        bizType: tabs.map((tab) => tab.value),
      });
      if (res.success) {
        updateProgress(curOrderIndex, RESOLVING_STATUS);
        setOpen(false);
      }
    } catch (error) {
      errMessage(error);
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_FAIL;
      trackClick(['activityButton2', 'step2Button'], reportRef.current);
    }
  };

  let onRow =
    curTab?.value === 'cloudxList'
      ? () => {
          window.open(addLangToPath(curTab.link.href));
        }
      : undefined;

  useEffect(() => {
    const status = getStatus(progress, curOrderIndex, remoteData);
    updateProgress(curOrderIndex, status);
    if (status === DONE_STATUS) {
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_SUCCESS;
      trackClick(['activityButton2', 'step2Button'], reportRef.current);
    }
  }, [progress[curOrderIndex - 1], progress[curOrderIndex], remoteData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const { data, success } = await queryTransferRobotCopyTradingEarn({
            targetSiteType: userTransferInfo.targetSiteType,
          });
          if (success && data) {
            const newData = {
              ...data,
              leadTrading: data.leadTrading?.nickName ? [data.leadTrading] : [],
            };
            const newTabs = [];
            baseTabs.forEach((tab) => {
              if (newData[tab.value] && newData[tab.value].length) {
                newTabs.push({
                  ...tab,
                  count: newData[tab.value].length,
                  label: `${tab.label} (${newData[tab.value].length})`,
                });
              }
            });
            setTabs(newTabs);
            setRemoteData(newData);
          }
        } catch (error) {
          console.error('request error:', error);
          errMessage(_t('4ab24c06e7c04000a359'));
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
      title={_t('aed3d13066ea4800a93e')}
      subTitle={_t('5485973eee814800ae8d', { targetSiteName })}
      btnTxt={`${_t('f0485940e1594000a33f')} ${total ? `(${total})` : ''}`}
      note={_t('164a849554374000a1ef')}
      status={progress[curOrderIndex]}
      order={orderText}
      showContent={!!remoteData && !!curTab && !isDone(remoteData)}
      onConfirm={() => {
        setOpen(true);
      }}
    >
      <Tab
        tabs={tabs}
        curTab={curTab}
        onChange={(tab) => {
          setCurTab(tab);
        }}
      />
      <TableNote note={curTab?.note} link={curTab?.link} />
      <Step2Table tabs={baseTabs} curTab={curTab} data={remoteData} onRow={onRow} />
      <CardModal
        open={open}
        title={_t('72220c8f0e1f4000a29d')}
        subtitle={_t('b08307b321a34000ace3')}
        items={tabs.map((item) => item.label)}
        warning={_t('9f78bbe786f24000a43d')}
        onOk={handle}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}
