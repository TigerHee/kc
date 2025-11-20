/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-09-11 16:42:17
 * @FilePath: /trade-web/src/trade4.0/pages/NewMarkets/components/Content/SearchALLList.js
 * @Description:
 */
/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { BUSINESS_ENUM, namespace } from '../../config';
import GroupItems from './GroupItems';
import EmptyContent from './EmptyContent';
import { useTabType } from './hooks/useType';
import { FUTURES, MARGIN, SPOT } from 'src/trade4.0/meta/const';
import { isDisplayMargin, isDisplayFutures } from '@/meta/multiTenantSetting';

const SearchALLList = () => {
  // search的数据
  const searchData = useSelector((state) => state[namespace].searchData);
  const { isSearchAll } = useTabType();
  const spotData = searchData[BUSINESS_ENUM.SPOT];
  const marginData = searchData[BUSINESS_ENUM.MARGIN];
  const futuresData = searchData[BUSINESS_ENUM.FUTURES];
  // 非search or search但不是all，不显示
  if (!isSearchAll) {
    return <></>;
  }
  // searc all 但是empty
  if (
    isSearchAll &&
    spotData?.data.length === 0 &&
    marginData?.data.length === 0 &&
    futuresData?.data.length === 0
  ) {
    return <EmptyContent />;
  }

  return (
    <div className="market-list" style={{ overflow: 'auto' }}>
      <GroupItems
        tradeType={SPOT}
        items={spotData.data}
        header={{
          count: spotData.total,
          type: BUSINESS_ENUM.SPOT,
        }}
      />
      {isDisplayMargin() && (
        <GroupItems
          tradeType={MARGIN}
          items={marginData.data}
          header={{
            count: marginData.total,
            type: BUSINESS_ENUM.MARGIN,
          }}
        />
      )}
      {isDisplayFutures() && (
        <GroupItems
          tradeType={FUTURES}
          items={futuresData.data}
          header={{
            count: futuresData.total,
            type: BUSINESS_ENUM.FUTURES,
          }}
        />
      )}
    </div>
  );
};

export default SearchALLList;
