/**
 * owner: larvide.peng@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';
import { memo } from 'react';
import UserAvatar from 'routes/SlothubPage/components/Avatar/UserAvatar';
import DateTimeUTCFormat from 'src/routes/SlothubPage/components/mui/DateTimeUTCFormat';
import { _t } from 'tools/i18n';
import {
  FlexBox,
  HistoryRecordExpiredItemTime,
  HistoryRecordExpiredItemWrapper,
  HistoryRecordItemContent,
  HistoryRecordItemDesc,
  HistoryRecordItemTime,
  HistoryRecordItemValue,
  HistoryRecordItemWrapper,
} from './styled';

const HistoryRecordListItem = memo(({ type, item }) => {
  const { currentLang } = useLocale();
  if (!item.score || !item.operationTime) return null;
  return (
    <HistoryRecordItemWrapper>
      <div>
        <HistoryRecordItemDesc>
          {_t(item.taskType === 1 ? '90963d68e3ea4000a7c1' : 'eda543d31d334000a87b')}
        </HistoryRecordItemDesc>
        <HistoryRecordItemTime data-test="history-record-item-time">
          <DateTimeUTCFormat date={item.operationTime} lang={currentLang}>
            {item.operationTime}
          </DateTimeUTCFormat>
        </HistoryRecordItemTime>
      </div>
      <HistoryRecordItemValue type={type} data-test="history-record-item-score">
        <NumberFormat isPositive lang={currentLang}>
          {item.score}
        </NumberFormat>
      </HistoryRecordItemValue>
    </HistoryRecordItemWrapper>
  );
});

// NOTE: 接口返回的正数，积分需要改为负数
const HistoryExchangeRecordListItem = memo(({ type, item }) => {
  const { currentLang } = useLocale();
  if (!item.redeemedPoints || !item.operationTime) return null;
  return (
    <HistoryRecordItemWrapper>
      <div>
        <HistoryRecordItemDesc>
          {_t('3bb420dbb4a54000a46d', { currency: item.currency })}
        </HistoryRecordItemDesc>
        <HistoryRecordItemTime>
          <DateTimeUTCFormat date={item.operationTime} lang={currentLang}>
            {item.operationTime}
          </DateTimeUTCFormat>
        </HistoryRecordItemTime>
      </div>
      <HistoryRecordItemValue type={type}>
        <NumberFormat isPositive lang={currentLang}>
          {(item.redeemedPoints || 0) * -1}
        </NumberFormat>
      </HistoryRecordItemValue>
    </HistoryRecordItemWrapper>
  );
});

const HistoryRecordListExpriedItem = memo(({ item }) => {
  const { currentLang } = useLocale();
  if (!item.score || !item.expireTime) return null;
  return (
    <HistoryRecordExpiredItemWrapper>
      <HistoryRecordItemDesc>
        {_t('3ee329ce4cce4000adf4', { num: item.score })}
      </HistoryRecordItemDesc>
      <HistoryRecordExpiredItemTime>
        <DateTimeUTCFormat date={item.expireTime} lang={currentLang}>
          {item.expireTime}
        </DateTimeUTCFormat>
      </HistoryRecordExpiredItemTime>
    </HistoryRecordExpiredItemWrapper>
  );
});

const HistoryRecordListInviteRecordItem = memo(({ type, item }) => {
  const { currentLang } = useLocale();
  if (!item.score || !item.operationTime) return null;
  return (
    <HistoryRecordItemWrapper>
      <FlexBox>
        <UserAvatar
          className="avatar"
          userInfo={{ nickName: item.nickName, avatar: item.avatar }}
        />
        <HistoryRecordItemContent>
          <HistoryRecordItemDesc>
            {_t('df1077165eab4000a352', { name: item.nickName, token: item.currency })}
          </HistoryRecordItemDesc>
          <HistoryRecordItemTime>
            <DateTimeUTCFormat date={item.operationTime} lang={currentLang}>
              {item.operationTime}
            </DateTimeUTCFormat>
          </HistoryRecordItemTime>
        </HistoryRecordItemContent>
      </FlexBox>
      <HistoryRecordItemValue type={type}>+{item.score}</HistoryRecordItemValue>
    </HistoryRecordItemWrapper>
  );
});

export {
  HistoryRecordListExpriedItem,
  HistoryRecordListItem,
  HistoryExchangeRecordListItem,
  HistoryRecordListInviteRecordItem,
};
