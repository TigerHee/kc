/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-23 18:30:43
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR8/SpotlightR8Record/RecordItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Divider, NumberFormat } from '@kux/mui';
import { _t } from 'src/tools/i18n';
import {
  ColumnTitle,
  PlaceholderWrapper,
  RecordItemColumn,
  RecordItemLine,
  RecordItemRow,
  RecordItemWrapper,
  RowDesc,
  RowTitle,
  TokenItem,
} from './styled';

// 历史收益 记录 H5 item
const RecordItem = ({ item, totalNum, index }) => {
  const { currentLang } = useLocale();
  return (
    <RecordItemWrapper>
      <RecordItemRow isRecordItem>
        <RecordItemColumn>
          <ColumnTitle>
            <div className="value">
              {item.subTime ? (
                <>
                  <DateTimeFormat
                    date={item.subTime}
                    lang={currentLang}
                    options={{ timeZone: 'UTC' }}
                  >
                    {item.subTime}
                  </DateTimeFormat>
                  <span className="utc">(UTC)</span>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </div>
          </ColumnTitle>
        </RecordItemColumn>
        <RecordItemLine>
          <RowTitle>{_t('volume')}</RowTitle>
          <RowDesc>
            <TokenItem>
              {item.subAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{item.subAmount}</NumberFormat>
                  <div>{item.subCurrency || ''}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          </RowDesc>
        </RecordItemLine>
        <RecordItemLine>
          <RowTitle>{_t('29c6fe4721894000a7c2', { currency: 'USDT' })}</RowTitle>
          <RowDesc>
            <TokenItem>
              {item.subPrice ? (
                <NumberFormat lang={currentLang}>{item.subPrice}</NumberFormat>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          </RowDesc>
        </RecordItemLine>
      </RecordItemRow>
      {totalNum !== index + 1 && <Divider />}
    </RecordItemWrapper>
  );
};
export default RecordItem;
