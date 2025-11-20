/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-23 18:30:43
 * @FilePath: /public-web/src/components/Spotlight/SpotlightR7/SpotlightR7Record/RecordItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Divider, NumberFormat, dateTimeFormat } from '@kux/mui';
import { isNil } from 'lodash-es';
import { _t } from 'src/tools/i18n';
import {
  Color,
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

// 0  申购中、1 申购失败、2 申购成功、3 发放失败、 4 发放成功
const textMap = {
  0: 'aa7debf9e7fd4000af67',
  1: '349ecc4085de4000a74f',
  2: 'failed',
  4: '47d024b918ff4000a307',
};

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
                  { dateTimeFormat({
                    date: item.subTime,
                    lang: currentLang,
                    options: { timeZone: 'UTC' },
                  })}
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </div>
          </ColumnTitle>
        </RecordItemColumn>
        <RecordItemLine>
          <RowTitle>{_t('a487981ce8294000ab2e', { currency: 'USDT' })}</RowTitle>
          <RowDesc>
            <TokenItem>
              {item.subAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{item.subAmount}</NumberFormat>
                  <div> {item.subToken}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          </RowDesc>
        </RecordItemLine>
        <RecordItemLine>
          <RowTitle>{_t('2282b30353614000aaf6', { currency: 'USDT' })}</RowTitle>
          <RowDesc>
            <TokenItem>
              {item.price ? (
                <NumberFormat lang={currentLang}>{item.price}</NumberFormat>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          </RowDesc>
        </RecordItemLine>
        <RecordItemLine>
          <RowTitle>{_t('edbdce2e23784000ac9d')} {'(PUMP)'}</RowTitle>
          <RowDesc>
            <TokenItem>
              {item.tokenAmount ? (
                <>
                  <NumberFormat lang={currentLang}>{item.tokenAmount}</NumberFormat>
                  <div> {item.token}</div>
                </>
              ) : (
                <PlaceholderWrapper>--</PlaceholderWrapper>
              )}
            </TokenItem>
          </RowDesc>
        </RecordItemLine>
        <RecordItemLine>
          <RowTitle>{_t('23e1b860074a4000a43a')}</RowTitle>
          <RowDesc>
            <TokenItem>
              {!isNil(item.status) ? (
                <Color status={item.status}>
                  {item.status === 3? _t('7c11781454174800a9e5', {num: item.subSuccessRatio * 100}) : _t(textMap[item.status])}
                </Color>
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
