/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { styled, useResponsive } from '@kux/mui';
import { dateTimeFormat } from '@kux/mui/utils';
import { useActivityItemStatus } from 'components/Premarket/hooks';
import { _t } from 'tools/i18n';

const StyledTimeStatus = styled.div`
  display: inline-flex;
  align-items: center;
`;

const StatusWrapper = styled.div`
  padding: 2px 4px;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  &.green {
    color: ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary12};
  }
  &.yellow {
    color: ${(props) => props.theme.colors.complementary};
    background: ${(props) => props.theme.colors.complementary12};
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 4px 6px;
    line-height: 16px;
    border-radius: 8px 0px 0px 8px;
  }
`;

const TimeWrapper = styled.div`
  padding: 4px 6px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 14px;
  border-radius: 0px 8px 8px 0px;
  color: ${(props) => props.theme.colors.text60};
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-left: none;
`;

const StatusLabel = [
  _t('a41d4495e7024000a642'),
  _t('6062bed4b3b34000a5a8'),
  _t('f1161fe89e3e4000ac4b'),
  _t('cc4d141c536e4000a9d2'),
];

export default function TimeStatus({ tradeStartAt, tradeEndAt, displayTradeEndAt, deliveryTime }) {
  const { sm } = useResponsive();
  const activityStatus = useActivityItemStatus({ tradeStartAt, tradeEndAt, deliveryTime });
  const { currentLang } = useLocale();

  return (
    <StyledTimeStatus>
      <StatusWrapper
        className={activityStatus === 0 ? 'yellow' : activityStatus === 1 ? 'green' : ''}
      >
        {StatusLabel[activityStatus] || '--'}
      </StatusWrapper>
      {sm && (
        <TimeWrapper>
          {/* 结束显示交割时间，其他显示交易时间 */}
          {activityStatus === 3
            ? `${dateTimeFormat({
                date: +deliveryTime * 1000,
                lang: currentLang,
                options: { timeZone: 'UTC', second: undefined },
              })} ${_t('wMm9D9jK8iibsKRZrPbiQ8')}`
            : `${dateTimeFormat({
                date: +tradeStartAt * 1000,
                lang: currentLang,
                options: { timeZone: 'UTC', second: undefined },
              })} - ${
                displayTradeEndAt
                  ? dateTimeFormat({
                      date: +tradeEndAt * 1000,
                      lang: currentLang,
                      options: { timeZone: 'UTC', second: undefined },
                    })
                  : _t('fDfqjRaCNVa226rPjxEA5o')
              } ${_t('wMm9D9jK8iibsKRZrPbiQ8')}`}
        </TimeWrapper>
      )}
    </StyledTimeStatus>
  );
}
