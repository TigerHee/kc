/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-15 21:07:05
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-02-02 16:13:20
 * @FilePath: /public-web/src/components/Votehub/recordList/components/TicketList/TicketItem.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { Divider } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { _t } from 'src/tools/i18n';
import {
  ColumnDesc,
  ColumnTitle,
  DateTimeSpan,
  getTicketStatus,
  TicketItemColumn,
  TicketItemLine,
  TicketItemRow,
  TicketItemWrapper,
  TicketsNumSpan,
} from './styled';

// 上币票获得记录
const TicketItem = ({ item, totalNum, index }) => {
  const { currentLang } = useLocale();
  return (
    <TicketItemWrapper>
      <TicketItemRow>
        <TicketItemLine>
          <TicketItemColumn>
            <ColumnTitle>
              <span>{_t('9Vsfit4gjYGqyWnR1es9Ku')}</span>
            </ColumnTitle>
            <ColumnDesc>
              <TicketsNumSpan>{item?.quantity}</TicketsNumSpan>
            </ColumnDesc>
          </TicketItemColumn>
          <TicketItemColumn isEnd>
            <ColumnTitle>{_t('ppxbXuVGLzkoafEWXh6g9d')}</ColumnTitle>
            <ColumnDesc>
              <div>{getTicketStatus(item.opType)}</div>
            </ColumnDesc>
          </TicketItemColumn>
        </TicketItemLine>
        <TicketItemLine>
          <ColumnTitle>{_t('kgJvn5PfwZgJCfdtaAnjSv')}</ColumnTitle>
          <ColumnDesc>
            <DateTimeSpan>
              {dateTimeFormat({
                lang: currentLang,
                date: item?.createdAt,
                //options: dateTimeOptoins,
              })}
            </DateTimeSpan>
          </ColumnDesc>
        </TicketItemLine>
      </TicketItemRow>
      {totalNum !== index + 1 && <Divider />}
    </TicketItemWrapper>
  );
};
export default TicketItem;
