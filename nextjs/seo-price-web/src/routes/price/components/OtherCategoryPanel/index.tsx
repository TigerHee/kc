/**
 * Owner: will.wang@kupotech.com
 */
import { Table } from '@kux/mui-next';
import { useCallback, useEffect } from 'react';
import useScreen from 'src/hooks/useScreen';
import useColumns from './useColumns';
import styles from './style.module.scss';
import { useLang } from 'gbiz-next/hooks';
import { usePriceStore } from '@/store/price';
import { trackClick } from 'gbiz-next/sensors';
import asyncSocket from '@/tools/asyncSocket';
import { useMount } from 'ahooks';
import { IS_CLIENT } from '@/config/env';
import { PointType } from '@/config/base';
import { addLangToPath } from '@/tools/i18n';
import { getSiteConfig } from 'kc-next/boot';
import { saveSpm2NextUrl } from '@/tools/ga';

const OtherCategoryPanel = ({ payload }: any) => {
  const { isRTL } = useLang();
  const columns = useColumns(isRTL, payload.keyName);
  const formatKeywords = usePriceStore(s => s.keywords.toUpperCase());

  const getCoinList = usePriceStore(s => s.getCoinList);
  const handleSocket = usePriceStore(s => s.handleSocketSubscribe);

  // TODO const loading = useSelector((state) => {
  //   return state.loading.effects['price/getCoinList'];
  // });

  const { isH5 } = useScreen();
  const currList = usePriceStore((s) => s[payload.keyName]);

  const tab = payload.keyName;

  const rowHandle = useCallback((record, rowIndex) => {
    return {
      onClick: (e) => {
        if (e?.currentTarget?.dataset?.rowKey) {
          trackClick(['B5CoinsPriceHomePage', ['coinsDetail', '1']], {
            symbol: record.name,
            currency: record.name,
            after_page_id: 'B5CoinPriceDetails',
            type: PointType[payload.keyName],
            norm_version: 1,
            sortPosition: rowIndex+1,
          });
          const priceUrl = addLangToPath(`${getSiteConfig().KUCOIN_HOST}/price/${record.name}`);
          // 进入price详情界面存储pre_spm_id;
          saveSpm2NextUrl(priceUrl, "kcWeb.B5CoinsPriceHomePage.coinsDetail.1");
          const newWindow = window.open(priceUrl, isH5 ? '_self' : '_blank');
          if (newWindow) {
            newWindow.opener = null;
          }
        }
      },
    };
  }, [payload.keyName,isH5]);

  // useMount(() => {
  //   // 保证是客户端
  //   if (IS_CLIENT) {
  //     getCoinList(payload);
  //   }
  // })

  //socket监听行情
  // useEffect(() => {
  //   const symbols = currList.map((item) => item.name).join(',');
  //   asyncSocket((socket, ws) => {
  //     socket.subscribe(`/quicksilver/symbol-market:${symbols}`);

  //     socket.topicMessage(
  //       `/quicksilver/symbol-market`,
  //       'quicksilver.symbol.market',
  //     )((result) => {
  //       handleSocket({ result, keyName: tab })
  //     });
  //   })
  //   //清除当前页的订阅
  //   return () => {
  //     asyncSocket((socket) => {
  //       //清除当前页的订阅
  //       socket.unsubscribe(`/quicksilver/symbol-market:${symbols}`);
  //     })
  //   };
  // }, [currList, tab, handleSocket]);

  return (
    <section className={styles.wrapper} data-inspector="inspector_other_panel">
      <div className="line" />
      <Table
        dataSource={currList.filter((item) => {
          
          const formatFullName = item.fullName.toUpperCase();
          const formatName = item.name.toUpperCase();
          return formatFullName.includes(formatKeywords) || formatName.includes(formatKeywords);
        })}
        rowKey="name"
        // sticky={{ offsetHeader: loading ? 0 : 80 }}
        columns={columns}
        loading={false}
        onRow={rowHandle}
      />
    </section>
  );
};

export default OtherCategoryPanel;