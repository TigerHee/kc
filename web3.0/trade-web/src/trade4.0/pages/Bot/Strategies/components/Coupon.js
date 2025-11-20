/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import SvgComponent from '@/components/SvgComponent';
import { _t, _tHTML } from 'Bot/utils/lang';
import Popover from 'Bot/components/Common/Popover';
import { Text, Flex } from 'Bot/components/Widgets';
import CountDown from 'Bot/components/Common/CountDown.js';
import styled from '@emotion/styled';
import { useSelector } from 'dva';

const MCouponIcon = styled(SvgComponent)`
  fill: ${({ theme }) => theme.colors.primary};
`;
const CouponIcon = (props) => (
  <MCouponIcon type="coupon" fileName="botsvg" width="12" height="12" className="vm" {...props} />
);

const Span = styled.span`
  i {
    font-style: normal;
    vertical-align: middle;
    padding-left: 4px;
  }
  > svg {
    vertical-align: middle;
  }
`;
// 关闭后的卡片上用
export const Rebate = ({ coupon }) => {
  if (!coupon) return null;

  return (
    <Span className="vm nowrap">
      <CouponIcon />
      <i className="vm unit">
        {_t('muchrebate', {
          num: `${Number(coupon.rewardSize)} ${coupon.currency}`,
        })}
      </i>
    </Span>
  );
};
const formater = ({ langFormat }) => langFormat;

const Content = styled.div`
  font-size: 12px;
  .gray-color {
    color: rgba(243, 243, 243, 0.4);
    padding-right: 10px;
  }
  .white-color {
    color: #f3f3f3;
  }
`;
const Title = styled.span`
  font-size: 14px;
  color: rgba(243, 243, 243, 0.4);
`;
// 运行中卡券展示
export const CouponTop = ({ coupon, className }) => {
  if (!coupon) return null;
  const { currency, expiredTime, rewardSize, maxReward } = coupon;

  return (
    <Popover
      placement="top"
      minWidth="200px"
      title={<Title>{_t('coupon')}</Title>}
      content={
        <Content>
          <Flex sb vc>
            <span className="gray-color">{_t('ur2Dg1Qd2TipKZ4srcUXTd')}</span>
            <Text color="primary">
              {rewardSize} {currency}
            </Text>
          </Flex>
          {!!Number(maxReward) && (
            <Flex sb vc>
              <span className="gray-color">{_t('dXb2uj9CzantKrZ5pKZ1BR')}</span>
              <span className="white-color">
                {maxReward} {currency}
              </span>
            </Flex>
          )}
          {!!Number(expiredTime) && (
            <Flex sb vc>
              <span className="gray-color">{_t('restbackprofittime')}</span>
              <span className="white-color">
                <CountDown
                  nextTime={expiredTime}
                  formater={formater}
                  binggoText={_t('countdownover')}
                />
              </span>
            </Flex>
          )}
        </Content>
      }
    >
      <Flex pl={4} cursor vc>
        <CouponIcon className={className} />
      </Flex>
    </Popover>
  );
};

// 关闭弹窗上展示
export const CloseCouponRow = ({ taskId }) => {
  const allCouponMap = useSelector((state) => state.BotCoupon.allCouponMap);
  const coupon = allCouponMap[taskId];
  if (!coupon) return null;
  return (
    <Flex fs={14} vc>
      <CouponIcon />
      <Text pl={8}>
        {_tHTML('usecouponbackmuch', {
          num: `${coupon.rewardSize || 0} ${coupon.currency}`,
        })}
      </Text>
    </Flex>
  );
};
