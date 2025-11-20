/**
 * Owner: saiya.lee@kupotech.com
 *
 * 活动参与(认购)
 */
import { ICHistoryOutlined, ICInfoOutlined } from '@kux/icons';
import { Button, NumberFormat, styled, numberFormat } from '@kux/mui';
import { divide } from 'helper';
import { useCountDown } from 'ahooks';
import CoinIcon from 'components/common/CoinIcon';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { _t, _tHTML } from 'tools/i18n';
import Tooltip from 'components/Premarket/components/Tooltip';
import ActivityEvents from '../ActivityEvents';
import { BubbleTip } from '../components/BubbleTip';
import { EVENT_STATUS } from '../constants';
import {
  Content,
  CountdownWrapper,
  InfoItem,
  LeftWrapper,
  ParticipateTitle,
  RightWrapper,
  SubscriptionInfoWrap,
  SubscriptionOptionsWrapper,
  Wrapper,
  InFactWrapper,
} from './styled';
import { useViewModel } from './useViewModel';
import { isNil } from 'lodash-es';

const CountDown = memo(({ targetDate, onEnd }) => {
  const [__, formattedRes] = useCountDown({
    targetDate,
    onEnd,
    interval: 1000,
  });
  if (!targetDate) return null;

  const { days, hours, minutes, seconds } = formattedRes;

  const transformNum = (num) => {
    return `${num < 10 ? '0' : ''}${num || '0'}`;
  };

  return (
    <CountdownWrapper dir="ltr">
      <span className="item">{transformNum(days)}</span>
      <span className="split">D</span>
      <span className="item">{transformNum(hours)}</span>
      <span className="split">H</span>
      <span className="item">{transformNum(minutes)}</span>
      <span className="split">M</span>
      <span className="item">{transformNum(seconds)}</span>
      <span className="split">S</span>
    </CountdownWrapper>
  );
});

export function Participate(props) {
  const vm = useViewModel(props);
  const isEnded = vm.eventStatus === EVENT_STATUS.ENDED;

  const countdownLabelKey =
    vm.eventStatus < EVENT_STATUS.IN_PROGRESS
      ? // 开始倒计时
        '8583a5a3d34b4000acd8'
      : vm.eventStatus === EVENT_STATUS.IN_PROGRESS
      ? // 申购倒计时
        '6ae0737330304000a4e8'
      : vm.eventStatus === EVENT_STATUS.DISTRIBUTING
      ? // 分发倒计时
        'c8de51d0fe044000aebf'
      : // 结束倒计时
        '9daa36bfc6ce4000ace0';

  return (
    <>
      <ActivityEvents
        steps={vm.rangeSegments}
        eventStatus={vm.eventStatus}
        currentLang={vm.currentLang}
      />
      <Wrapper className={isEnded ? 'is-ended' : ''}>
        <div className="border-gradient-bottom" />
        <div className="border-gradient-top" />
        <div className="participate-inner">
          <ParticipateTitle>
            <div className="title-item">
              <div className="participate-icon" />
              {/* 参与活动 */}
              <div>{_t('b8219cc11eb74000a19e')}</div>
            </div>
            {!isEnded && (
              <div className="title-item title-countdown">
                <span>{_t('7bd4e330511f4000a1ae')}</span>
                <CountDown targetDate={vm.endTime} />
              </div>
            )}
          </ParticipateTitle>
          <Content>
            <LeftWrapper className='left-wrapper'>
              {!isEnded && (
                <InfoItem className="detail-countdown">
                  <div className="infoTitle">{_t(countdownLabelKey)}</div>
                  <div className="infoContent">
                    <CountDown onEnd={vm.onTimeEnd} targetDate={vm.endTime} />
                  </div>
                </InfoItem>
              )}
              {isEnded && (
                <InfoItem className="distribution-end">
                  {/* 分发代币 */}
                  <div className="infoTitle">{_t('2c9e05daff324000a4b5')}</div>
                  <div className="infoContent">
                    {/* 已完成 */}
                    {_t('cc4d141c536e4000a9d2')}
                  </div>
                </InfoItem>
              )}
              <InfoItem>
                {/* 总认购人数 */}
                <div className="infoTitle">{_t('798727b3b2ea4000ad51')}</div>
                <div className="infoContent">
                  {!vm.totalSubscribers ? (
                    '--'
                  ) : (
                    <NumberFormat lang={vm.currentLang}>{vm.totalSubscribers}</NumberFormat>
                  )}
                </div>
              </InfoItem>
              <InfoItem>
                {/* 总认购金额 */}
                <div className="infoTitle">{_t('9d4de9765e814000aa9d')}</div>
                <div className="infoContent total-list">
                  {!vm.totalSubAmount
                    ? '--'
                    : vm.totalSubAmount.map((item) => (
                        <div key={item.currency}>
                          {item.total === null ? (
                            '--'
                          ) : (
                            <>
                              {/* 去掉总额的小数部分 */}
                              <NumberFormat lang={vm.currentLang} options={{maximumFractionDigits: 0}}>{item.total}</NumberFormat>
                            </>
                          )}{' '}
                          {item.currency}
                        </div>
                      ))}
                </div>
              </InfoItem>
            </LeftWrapper>
            <RightWrapper>
              {vm.showSubOptions ? (
                <SubscriptionOptions options={vm.subscriptionOptions} />
              ) : (
                <SubscriptionInfo
                  token={vm.token}
                  viewSubscribeHistory={vm.viewSubscribeHistory}
                  currentLang={vm.currentLang}
                  userInvestSummary={vm.userInvestSummary}
                  isDistributing={vm.isDistributing}
                  actualInvestAmount={vm.actualInvestAmount}
                  investedCurrency={vm.investedCurrency}
                  estSubscriptionAmount={vm.estSubscriptionAmount}
                />
              )}
              <ActionButton
                isBooked={vm.isBooked}
                eventStatus={vm.eventStatus}
                onClick={vm.onClickAction}
              />
            </RightWrapper>
          </Content>
        </div>
      </Wrapper>
    </>
  );
}

function SubscriptionOptions({ options }) {
  return (
    <SubscriptionOptionsWrapper>
      {options?.map((option) => (
        <div className="subscription-option" key={option.currency}>
          <div className="subscription-bg" />
          {option.tooltip && <BubbleTip className="promotion-tip">{option.tooltip}</BubbleTip>}
          <CoinIcon className="option-icon" coin={option.currency} width={40} height={40} />
          <div className={"option-content " + (option.tooltip ? 'is-recommended': '')}>
            <div>
              {_t('bca5f23bbf2d4000a16e', { currencyName: option.currency })}

              {option.tooltip && (
                <div className="option-tags">
                  <span className="option-tag">
                    {/* 推荐 */}
                    {_t('8ec8df36607a4000a8f4')}
                  </span>
                </div>
              )}
            </div>
            {/* 申购价格 */}
            <div className='price'>
              {_t('24d406c6fcf14000a64c', {
                level: '',
                num: option.tokenPrice,
              })}
            </div>
          </div>
        </div>
      ))}
    </SubscriptionOptionsWrapper>
  );
}

const IconInfo = styled(ICInfoOutlined)`
  cursor: help;
  color: ${(props) => props.theme.colors.icon};
`;

function SubscriptionInfo({
  token,
  currentLang,
  userInvestSummary,
  estSubscriptionAmount,
  isDistributing,
  viewSubscribeHistory,
  actualInvestAmount,
  investedCurrency,
}) {

  const hasDiscount = true;

  const InFactInvested = userInvestSummary && investedCurrency && (<InFactWrapper>
    {hasDiscount && <div className='info-item'>
      {/* KCS 兑换比例 */}
      <div>{_t('44adea3b81c14000a8a5', {
        currency: userInvestSummary.userInvestCurrency,
      })}</div>
      <div className='info-highlight'>
        1 {token} = {formatAmount(investedCurrency.newTokenRate, currentLang)} {userInvestSummary.userInvestCurrency}{' '}
        {investedCurrency.hasDiscount && _tHTML('1f2ca94e5dd34000ab2d', {
          discount: numberFormat({
            number: divide(investedCurrency.discountRate, 100),
            lang: currentLang,
            options: {
              style: 'percent',
            },
          }),
        })}
      </div>
    </div>}
      {/* 快照价格 */}
    {userInvestSummary.userInvestCurrency !== 'USDT' && (<div className='info-item'>
      <div>{_t('807c061270804000af2d', {
        currency: userInvestSummary.userInvestCurrency,
      })}</div>
      <div className='info-highlight'>
        1 {userInvestSummary.userInvestCurrency} = {formatAmount(investedCurrency.exchangeRate, currentLang)} USDT
      </div>
      <div>
        {_t('31b161df91dd4000aacc', {
          currency: userInvestSummary.userInvestCurrency,
        })}
      </div>
    </div>)}
    <div className='info-item'>
      {/* 未使用的会返回 */}
      <div>{_t('50fbe72373c24000af22')}</div>
    </div>
  </InFactWrapper>)

  return (
    <SubscriptionInfoWrap>
      <InfoItem className="group-title">
        {/* 我的认购 */}
        <div className="infoTitle">{_t('f83ed2841b374000ae63')}</div>
        <div className="infoContent" onClick={viewSubscribeHistory}>
          <ICHistoryOutlined />
          {/* 申购记录 */}
          <span>{_t('2a183e74427f4000ad5b')}</span>
        </div>
      </InfoItem>
      <InfoItem className="est-info">
        {/* 我已投入 */}
        <div className="infoTitle">{_t('0b5847a1267c4000a7c7')}</div>
        <div className="infoContent">
          {userInvestSummary ? (
            <>
              <NumberFormat lang={currentLang}>
                {userInvestSummary.userInvestAmount || 0}
              </NumberFormat>{' '}
              {userInvestSummary.userInvestCurrency}
            </>
          ) : (
            '--'
          )}
        </div>
      </InfoItem>
      <InfoItem className="est-info">
        {/* 实际投入 */}
        <div className="infoTitle">{_t('3983f3a564ef4000a699')}</div>
        <div className="infoContent">
          {isDistributing || actualInvestAmount === null ? '--' :(
            <>
            <NumberFormat lang={currentLang}>{actualInvestAmount}</NumberFormat>{' '}
            {userInvestSummary.userInvestCurrency}
            <Tooltip trigger="hover" header={_t('3983f3a564ef4000a699')} title={InFactInvested} maxWidth={340}>
              <IconInfo />
            </Tooltip>
          </>
          )}
        </div>
      </InfoItem>
      <InfoItem className="est-info">
        <div className="infoTitle">
          {/* 预估申购金额 */}
          <span>{_t('be0039cf0dc94000a6d0')}</span>
          {/* 可获得代币数量 的计算方式 */}
          <Tooltip trigger="hover" header={_t('be0039cf0dc94000a6d0')} title={_t('f06371c1634d4000afb8')} maxWidth={340}>
            <IconInfo />
          </Tooltip>
        </div>
        <div className="infoContent">
          {isDistributing ? (
            // 待分发
            _t('aa7debf9e7fd4000af67')
          ) : (
            estSubscriptionAmount === null ? (
              '--'
            ) : (
            <>
            <NumberFormat lang={currentLang}>{estSubscriptionAmount}</NumberFormat>
            {' '}{token}
            </>
          ))}
        </div>
      </InfoItem>
    </SubscriptionInfoWrap>
  );
}

// 操作按钮状态文案, 与 EVENT_STATUS 对应
const BTN_TEXT_MAP = {
  // 预约活动
  [EVENT_STATUS.NOT_START]: '4e6acf6c9fec4000a6f8',
  // 申购
  [EVENT_STATUS.IN_PROGRESS]: 'etf.action.subscribe',
  // 分配中
  [EVENT_STATUS.DISTRIBUTING]: '1d5efc504ebb4000a41a',
  // 已结束
  [EVENT_STATUS.ENDED]: '56973c1c54404000aca6',
};

// 按钮loading最小等待时间
const MIN_WAIT_TIME = 300;

function ActionButton({ eventStatus, isBooked, onClick }) {
  const btnType = eventStatus < EVENT_STATUS.DISTRIBUTING ? 'primary' : 'default';
  const hasBooked = eventStatus === EVENT_STATUS.NOT_START && isBooked;
  // 已预约/活动分发中/活动已结束时, 按钮不可点击
  const disabled = hasBooked || eventStatus > EVENT_STATUS.IN_PROGRESS;
  // 预约活动状态下, 已预约的按钮文案为"已预约"
  const btnLabelKey = hasBooked ? 'aece174ece7a4000ab43' : BTN_TEXT_MAP[eventStatus];

  const [isLoading, setIsLoading] = useState(false);

  const timeRef = useRef(0);

  const handleClick = useCallback(async () => {
    if (!onClick || isLoading || disabled) return;
    setIsLoading(true);
    const startTime = Date.now();
    try {
      await onClick();
    } catch (error) {
      console.error('Participate action button error', error);
    }
    const gap = Date.now() - startTime;
    timeRef.current = setTimeout(
      () => {
        setIsLoading(false);
        // 不足最小等待时间时, 不足缺失的时间; 否则直接清除loading状态
      },
      gap < MIN_WAIT_TIME ? MIN_WAIT_TIME - gap : 0,
    );
  }, [onClick, isLoading, disabled]);

  useEffect(() => {
    return () => {
      clearTimeout(timeRef.current);
    };
  }, []);

  return (
    <Button
      size="large"
      fullWidth
      style={{ marginTop: 24 }}
      className="participate-btn"
      type={btnType}
      loading={isLoading}
      onClick={handleClick}
    >
      <span>{_t(btnLabelKey)}</span>
    </Button>
  );
}

function formatAmount(num, lang) {
  return isNil(num) ? '--' : numberFormat({ number: num, lang });
}
