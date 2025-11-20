/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 16:41:47
 * @FilePath: /public-web/src/components/Votehub/recordList/components/VoteRecordList/VoteRecordItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Divider } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { _t } from 'src/tools/i18n';
import {
  CoinListFullName,
  CoinListItemDesc,
  CoinListItemIcon,
  CoinListItemName,
  CoinRow,
  ColumnDesc,
  ColumnTitle,
  VoteRecordItemColumn,
  VoteRecordItemLine,
  VoteRecordItemRow,
  VoteRecordItemWrapper,
  //ProjectItem,
  VoteStatus,
} from './styled';

// 上币票获得记录
const VoteRecordItem = ({ item, totalNum, index }) => {
  const { currentLang } = useLocale();
  return (
    <VoteRecordItemWrapper>
      <VoteRecordItemRow>
        <VoteRecordItemLine>
          <VoteRecordItemColumn>
            <ColumnTitle>{_t('aNrJGcDa4ykuW3aoysQFzj')}</ColumnTitle>
            <ColumnDesc>
              <CoinRow>
                <CoinListItemIcon logoUrl={item?.logoUrl} coin={item?.currency} lazyImg={true} />
                <CoinListFullName>
                  <CoinListItemName>{item?.currency}</CoinListItemName>
                  {item?.project ? <CoinListItemDesc>{item.project}</CoinListItemDesc> : null}
                </CoinListFullName>
              </CoinRow>
            </ColumnDesc>
          </VoteRecordItemColumn>
          <VoteRecordItemColumn>
            <ColumnTitle>{VoteStatus(item?.voteResult)}</ColumnTitle>
          </VoteRecordItemColumn>
        </VoteRecordItemLine>
        <VoteRecordItemLine>
          <VoteRecordItemColumn>
            <ColumnTitle>{_t('oatP5S9jKAdaa44YDn5vik')}</ColumnTitle>
            <ColumnDesc>
              <span>
                {dateTimeFormat({
                  lang: currentLang,
                  date: item?.spendTime,
                  //options: dateTimeOptoins,
                })}
              </span>
            </ColumnDesc>
          </VoteRecordItemColumn>
          <VoteRecordItemColumn>
            <ColumnTitle>{_t('sBLbdTYL22URzVTXFyCsFK')}</ColumnTitle>
            <ColumnDesc isTextRight>{item?.spendNum}</ColumnDesc>
          </VoteRecordItemColumn>
        </VoteRecordItemLine>
      </VoteRecordItemRow>
      {totalNum !== index + 1 && <Divider />}
    </VoteRecordItemWrapper>
  );
};
export default VoteRecordItem;
