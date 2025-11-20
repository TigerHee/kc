/**
 * Owner: jacky@kupotech.com
 */

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { closeBizOrders, queryTransferBizOrders } from 'src/services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { trackClick } from 'src/utils/ga';
import getSiteName from 'src/utils/getSiteName';
import { useMessageErr } from '../../utils/message';
import { polling } from '../../utils/polling';
import Card from './components/Card';
import { CardModal } from './components/Modal';
import Tab from './components/Tab';
import { DONE_STATUS, REPORT_FAIL, REPORT_SUCCESS, RESOLVING_STATUS } from './constants';
import Step3Table from './TransferTable/Step3Table';
import { TableNote } from './TransferTable/TableExternal';
import { getCurrentCardOrderNumber, getStatus, isDone } from './utils';

const curOrderIndex = 2;

/**
 * 撤销交易委托单
 */
export default function TradingOrderCard({ progress, updateProgress }) {
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
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

  const total = tabs.reduce((sum, tab) => sum + tab.count, 0);

  const targetSiteName = getSiteName(userTransferInfo?.targetSiteType);

  const baseTabs = [
    {
      label: _t('57f1faebd4a54000a788'),
      value: 'spotOrderList',
      bizType: 'HF_SPOT',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/trade'),
      },
    },
    {
      label: _t('bb455379722a4800a2db'),
      value: 'advanceSpotOrderList',
      bizType: 'SPOT_ADVANCED_ORDER',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/trade/stopLoss'),
      },
    },
    {
      label: _t('0d771290325b4800a644'),
      value: 'advanceSpotTWAPOrderList',
      bizType: 'ADVANCE_SPOT_TWAP',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/trade/twap'),
      },
    },
    {
      label: _t('234153c189f94800a71d'),
      value: 'marginOrderList',
      bizType: 'MARGIN',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/margin'),
      },
    },
    {
      label: _t('ea668c6c45d64000ae85'),
      value: 'advanceMarginOrderList',
      bizType: 'ADVANCE_MARGIN',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/margin/stopLoss'),
      },
    },
    {
      label: _t('2b0a0b736fe64800abb9'),
      value: 'futuresOrderList',
      bizType: 'futures',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/futures/open-order'),
      },
    },
    {
      label: _t('22a7668aab4e4800a02e'),
      value: 'advanceFuturesOrderList',
      bizType: 'ADVANCE_FUTURES',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/futures/advance-order'),
      },
    },
    // 后端说没有这一列了，不排除后面有
    // {
    //   label: '杠杆代币订单',
    //   value: 'leveragedTokensOrderList',
    //   bizType: 'ETF',
    //   note: `以下是${targetSiteName}不支持的委托单`,
    //   count: 0,
    //   link: {
    //     href: '/order/trade/current',
    //   },
    // },
    {
      label: _t('e3a08f0386544800a899'),
      value: 'preMarketOrderList',
      bizType: 'PRE_MARKET',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/pre-market'),
      },
    },
    {
      label: _t('1131e83d0d834000a089'),
      value: 'speedOrderList',
      bizType: 'SPEEDY',
      note: _t('b952cf79c0534000af9a', { targetSiteName }),
      count: 0,
      link: {
        href: addLangToPath('/order/trade/convert'),
      },
    },
  ];

  const handle = async () => {
    reportRef.current.startTime = Date.now();
    reportRef.current.user_target_siteType = userTransferInfo?.targetSiteType;

    try {
      const res = await closeBizOrders({
        targetSiteType: userTransferInfo?.targetSiteType,
        bizType: tabs.map((tab) => tab.bizType),
      });
      if (res.success) {
        updateProgress(curOrderIndex, RESOLVING_STATUS);
        setOpen(false);
      }
    } catch (error) {
      errorMessage(error);
      reportRef.current.duration = Date.now() - reportRef.current.startTime;
      reportRef.current.clickStatus = REPORT_FAIL;
      trackClick(['activityButton3', 'step3Button'], reportRef.current);
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
      trackClick(['activityButton3', 'step3Button'], reportRef.current);
    }
  }, [progress[curOrderIndex - 1], progress[curOrderIndex], remoteData]);

  useEffect(() => {
    let end;
    if (userTransferInfo?.targetSiteType) {
      end = polling(async () => {
        try {
          const { success, data } = await queryTransferBizOrders({
            targetSiteType: userTransferInfo?.targetSiteType,
          });
          if (success && data) {
            const newTabs = [];
            baseTabs.forEach((tab) => {
              if (data[tab.value] && data[tab.value].length > 0) {
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
      title={_t('65e8e4c0685f4000a7f3')}
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
      <TableNote>{_t('b952cf79c0534000af9a', { targetSiteName })}</TableNote>
      <Step3Table tabs={baseTabs} data={remoteData} curTab={curTab} onRow={onRow} />
      <CardModal
        open={open}
        title={_t('62913ef07cc84800a583')}
        subtitle={_t('d45e15c851d24000a24b')}
        items={tabs.map((item) => item.label)}
        warning={_t('8d2478f9b2654800aee6')}
        onOk={handle}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Card>
  );
}
