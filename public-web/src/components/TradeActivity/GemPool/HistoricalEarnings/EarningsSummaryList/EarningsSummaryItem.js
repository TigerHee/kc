/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-03 15:18:44
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/EarningsSummaryList/EarningsSummaryItem.js
 * @Description:
 */
import { Divider } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import {
  ColumnTitle,
  EarningsRecordItemLine,
  EarningsRecordItemRow,
  EarningsRecordItemWrapper,
  GreyToken,
  RowDesc,
  RowTitle,
  TokenItem,
} from '../styled';

// 历史收益的汇总
const EarningsSummaryItem = ({ item, totalNum, index }) => {
  return (
    <EarningsRecordItemWrapper>
      <EarningsRecordItemRow isSummaryItem>
        <ColumnTitle>
          <img src={item.earnTokenLogo} alt="logo" />
          <span>{item.earnToken}</span>
        </ColumnTitle>
        {item?.poolSummary?.length > 0 &&
          item.poolSummary.map((data, index) => {
            return (
              <EarningsRecordItemRow gap={8} key={`earningsRecordItemLine+${index}`}>
                <EarningsRecordItemLine>
                  <RowTitle>{_t('39365b4fd91c4000a817')}</RowTitle>
                  <RowDesc>
                    <TokenItem>
                      <img src={data.stakingTokenLogo} alt="logo" />
                      <div>{data.stakingToken}</div>
                    </TokenItem>
                  </RowDesc>
                </EarningsRecordItemLine>
                <EarningsRecordItemLine>
                  <RowTitle>{_t('cae0cb1c39254000aa73')}</RowTitle>
                  <RowDesc>
                    <TokenItem>
                      <div>{data.poolRewardAmount}</div>
                      <GreyToken>{item.earnToken}</GreyToken>
                    </TokenItem>
                  </RowDesc>
                </EarningsRecordItemLine>
              </EarningsRecordItemRow>
            );
          })}
        <EarningsRecordItemLine>
          <RowTitle isTotalIncome>{_t('21b13e03245c4000a597')}</RowTitle>
          <RowDesc>
            <TokenItem>
              <div>{item.totalRewardAmount}</div>
              <GreyToken>{item.earnToken}</GreyToken>
            </TokenItem>
          </RowDesc>
        </EarningsRecordItemLine>
      </EarningsRecordItemRow>
      {totalNum !== index + 1 && <Divider />}
    </EarningsRecordItemWrapper>
  );
};
export default EarningsSummaryItem;
