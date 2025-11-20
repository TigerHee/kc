/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-18 15:19:54
 * @FilePath: /public-web/src/components/TradeActivity/GemPool/HistoricalEarnings/EarningsRecordList/EarningsRecordItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Divider } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import {
  ColumnDesc,
  ColumnTitle,
  EarningsRecordItemColumn,
  EarningsRecordItemLine,
  EarningsRecordItemRow,
  EarningsRecordItemWrapper,
  GreyToken,
  RowDesc,
  RowTitle,
  TokenItem,
} from '../styled';

// 历史收益 记录 H5 item
const EarningsRecordItem = ({ item, totalNum, index }) => {
  const { currentLang } = useLocale();
  return (
    <EarningsRecordItemWrapper>
      <EarningsRecordItemRow isRecordItem>
        <EarningsRecordItemColumn>
          <ColumnTitle>
            <span>{item.token}</span>
          </ColumnTitle>
          <ColumnDesc>
            <div className="value">
              {item.time ? (
                <DateTimeFormat date={item.time} lang={currentLang} options={{ timeZone: 'UTC' }}>
                  {item.time}
                </DateTimeFormat>
              ) : (
                '--'
              )}
              <span className="unit">(UTC)</span>
            </div>
          </ColumnDesc>
        </EarningsRecordItemColumn>
        <EarningsRecordItemLine>
          <RowTitle>{_t('40ada7ea092a4000a498')}</RowTitle>
          <RowDesc>
            {item.value === 1 ? _t('69d9d42cfc5c4000a212') : _t('3996ca5d64954000aa28')}
          </RowDesc>
        </EarningsRecordItemLine>
        <EarningsRecordItemLine>
          <RowTitle>{_t('cae0cb1c39254000aa73')}</RowTitle>
          <RowDesc>
            <TokenItem>
              <div>{item.amount}</div>
              <GreyToken>{item.token}</GreyToken>
            </TokenItem>
          </RowDesc>
        </EarningsRecordItemLine>
      </EarningsRecordItemRow>
      {totalNum !== index + 1 && <Divider />}
    </EarningsRecordItemWrapper>
  );
};
export default EarningsRecordItem;
