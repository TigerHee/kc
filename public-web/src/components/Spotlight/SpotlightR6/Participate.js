/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICQuestionOutlined } from '@kux/icons';
import { Button, NumberFormat, styled, useSnackbar } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import Html from 'components/common/Html';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import userIcon from 'static/spotlight6/user.svg';
import { _t } from 'tools/i18n';
import { skip2Login } from 'TradeActivity/utils';
import Tooltip from 'TradeActivityCommon/Tooltip';
import {
  END_RESERVATION_STATUS,
  LOTTERY_STATUS,
  RESERVATION_NOT_STARTED,
  RESULT_ANNOUNCED_STATUS,
  REWARD_EXPECT_STATUS,
  START_RESERVATION_STATUS,
} from './constant';
import { useProcesss, useRegistrationCount } from './hooks';

const Wrapper = styled.div`
  width: 100%;
  background: rgba(225, 232, 245, 0.02);
  border-radius: 8px;
  padding: 48px 28px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 45px;
    padding: 45px 100px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 34px;
    padding: 36px 46px;
  }
`;

const Item = styled.div``;

const ItemTitle = styled.div`
  color: #e1e8f5;
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 24px;
  &.done {
    color: rgba(225, 232, 245, 0.4);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    line-height: 21px;
  }
`;

const ItemTitle2 = styled.div`
  color: #e1e8f5;
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  &.done {
    color: rgba(225, 232, 245, 0.4);
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 8px;
    font-size: 18px;
    line-height: 23px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 21px;
  }
`;

const ItemContent = styled.div`
  font-weight: 400;
  font-size: 14px;
  margin-top: 40px;
  line-height: 150%;
  color: rgba(225, 232, 245, 0.4);
  &.done {
    color: rgba(225, 232, 245, 0.4);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const LotteryItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: row;
    align-items: center;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LotteryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 24px;
  &:last-of-type {
    margin-bottom: 0;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: row;
    align-items: center;
    margin-right: 60px;
    margin-bottom: 10px;

    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const LotteryItemTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: rgba(225, 232, 245, 0.4);

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-right: 8px;
    margin-bottom: 0;
  }
`;
const LotteryItemValue = styled.div`
  display: flex;
  align-items: center;
  margin-right: 60px;
  font-weight: 600;
  font-size: 24px;
  line-height: 31px;
  color: #e1e8f5;
  min-width: 25px;
  &.active {
    color: #01bc8d;
  }

  .detail {
    margin-left: 4px;
    color: rgba(225, 232, 245, 0.3);
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
    line-height: 26px;
  }
`;

const ItemMark = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-right: 12px;
  background: #01bc8d;
  display: inline-block;
  &.done {
    background: rgba(225, 232, 245, 0.4);
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 8px;
  }
`;

const ParticipatePeopleWrapper = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-size: 14px;
  background: rgba(225, 232, 245, 0.02);
  border-radius: 22px;
  /* line-height: 18px; */
  height: 30px;
  display: flex;
  color: #f3f3f3;
  padding-left: 13px;
  align-items: center;
`;
const ParticipatePeopleNumber = styled.span`
  color: #01bc8d;
`;
const StyledButton = styled(Button)`
  margin-top: 30px;
`;
const UserIcon = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 5px;
`;
const WinningResultGreeting = styled.div`
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  margin-top: 40px;
  color: rgba(225, 232, 245, 0.4);
`;
const WinningResult = styled.div`
  margin-top: 12px;
  font-weight: 600;
  font-size: 24px;
  line-height: 130%;
  text-align: center;
  color: #01bc8d;
  &.noHit {
    color: #fff;
  }
`;
const QuestionIcon = styled(ICQuestionOutlined)`
  margin-left: 6px;
  font-size: 16px;
  cursor: pointer;
`;

const ItemTextWrapper = styled.div``;

const ParticipatePeople = () => {
  const { currentLang } = useLocale();
  const activityRegistrationCount = useSelector(
    (state) => state.spotlight.activityRegistrationCount,
  );
  const processingStatus = useSelector((state) => state.spotlight.processingStatus);
  const { isSameOrAfter } = useProcesss(processingStatus);
  return isSameOrAfter(START_RESERVATION_STATUS) ? (
    <ParticipatePeopleWrapper>
      <UserIcon src={userIcon} alt="icon" />
      <span>{_t('37MTH3ZgHRYkGHYq7qDkVN')}：</span>
      <ParticipatePeopleNumber>
        <NumberFormat lang={currentLang}>{activityRegistrationCount}</NumberFormat>
      </ParticipatePeopleNumber>
    </ParticipatePeopleWrapper>
  ) : null;
};

const Participate = ({ id }) => {
  const { currentLang } = useLocale();
  const { message } = useSnackbar();
  const { isSameOrBefore } = useProcesss();
  const dispatch = useDispatch();
  useRegistrationCount();

  const qualification = useSelector((state) => state.spotlight.qualification, shallowEqual);
  const ticksInfo = useSelector((state) => state.spotlight.ticksInfo, shallowEqual);
  const detailInfo = useSelector((state) => state.spotlight.detailInfo, shallowEqual);
  const processingStatus = useSelector((state) => state.spotlight.processingStatus);
  const isLogin = useSelector((state) => state.user.isLogin);

  const { completedKyc, signedCountryAgreement, signedAgreement, reserved } = qualification || {};
  const { tickets, totalTickets, extraTickets, hit } = ticksInfo || {};
  const { tipsModule = '' } = detailInfo || {};

  const formatTicks = useCallback((value) => {
    if (value === 0) return value;
    if (!value) return '--';

    return numberFormat({
      number: value,
      lang: currentLang,
    });
  }, []);

  useEffect(() => {
    if (
      (processingStatus === REWARD_EXPECT_STATUS ||
        processingStatus === RESULT_ANNOUNCED_STATUS ||
        processingStatus === LOTTERY_STATUS) &&
      isLogin &&
      reserved
    ) {
      dispatch({
        type: 'spotlight/getTickets@polling',
        payload: {
          id,
        },
      });

      return () => {
        dispatch({
          type: 'spotlight/getTickets@polling:cancel',
          payload: {
            id,
          },
        });
      };
    }
  }, [dispatch, id, isLogin, processingStatus, reserved]);

  const handleParticipate = useCallback(
    () =>
      debounce(
        () => {
          if (isSameOrBefore(RESERVATION_NOT_STARTED)) {
            message.info(_t('vhMPfU4SYJkfrMkHbW7buV'));
            return;
          }
          dispatch({
            type: 'spotlight/reservation',
            payload: {
              id,
            },
          });
        },
        1000,
        {
          leading: true,
          trailing: false,
        },
      ),
    [id, message, dispatch, isSameOrBefore],
  );

  const content = useMemo(() => {
    if (!isLogin) {
      // 未登录 立即登录参与活动，折扣获得新币种
      return (
        <Item>
          <ItemTitle>{_t('4Tm2vvLTmv2rasLnXydaHS')}</ItemTitle>
          <ParticipatePeople />
          <StyledButton fullWidth onClick={skip2Login}>
            {_t('4R6tQcyB9ZQKGdSNut8V4Q')}
          </StyledButton>
        </Item>
      );
    } else if (
      !(
        // 用户是否完成kyc认证
        (
          completedKyc &&
          // kyc所在国家是否不可以购买
          signedCountryAgreement &&
          // 是否签署购买协议
          signedAgreement
        )
      )
    ) {
      // 登录但不符合条件 立即参与活动，不满足条件（置灰）
      return (
        <Item>
          <ItemTitle>{_t('4Tm2vvLTmv2rasLnXydaHS')}</ItemTitle>
          <ParticipatePeople />
          <StyledButton fullWidth disabled={true}>
            {_t('pUXjhkM1MFFU1AjLcANrpf')}
          </StyledButton>
        </Item>
      );
    } else if (isSameOrBefore(START_RESERVATION_STATUS)) {
      if (reserved) {
        // 已预约 活动进行中 恭喜您已成功預約，請關注活動結束時間，或關注社群了解更多詳情
        return (
          <ItemTextWrapper>
            <ItemTitle2>
              <ItemMark />
              {_t('pCxtJ4hKNxyUFS4tNxgGrY')}
            </ItemTitle2>
            <ParticipatePeople />
            <ItemContent>{_t('drwEyu8BcDTpte2MWnNTmT')}</ItemContent>
          </ItemTextWrapper>
        );
      } else {
        // 未预约
        return (
          <Item>
            <ItemTitle>{_t('4Tm2vvLTmv2rasLnXydaHS')}</ItemTitle>
            <ParticipatePeople />
            <StyledButton fullWidth onClick={handleParticipate()}>
              {_t('kLje7qwpmWm8y8bmJrXmmP')}
            </StyledButton>
          </Item>
        );
      }
    } else if (!reserved) {
      // 预约已结束但未预约 预约已结束，您未成功预约
      return (
        <ItemTextWrapper>
          <ItemTitle2>
            <ItemMark />
            {_t('tcXmbz7M7FoG8bfLffnuyf')}
          </ItemTitle2>
          <ParticipatePeople />
          <ItemContent>{_t('4Gv3YJ8iv3HkSJeutQk7se')}</ItemContent>
        </ItemTextWrapper>
      );
    } else if (isSameOrBefore(END_RESERVATION_STATUS)) {
      // 预约已结束、已预约 结果统计中 恭喜您已成功預約，請關注活動結束時間，或關注社群了解更多詳情
      return (
        <ItemTextWrapper>
          <ItemTitle2>
            <ItemMark />
            {_t('gYiSj6mkwF4bWiMboiGUJv')}
          </ItemTitle2>
          <ParticipatePeople />
          <ItemContent>{_t('drwEyu8BcDTpte2MWnNTmT')}</ItemContent>
        </ItemTextWrapper>
      );
    } else if (isSameOrBefore(REWARD_EXPECT_STATUS)) {
      // 签数公布 我的签数 用户累计签数
      return (
        <ItemTextWrapper>
          <ItemTitle2>
            <ItemMark />
            {_t('8fz9GkHWGTjMYV8QUzdLup')}
          </ItemTitle2>
          <ParticipatePeople />
          <LotteryItems>
            <LotteryItem>
              <LotteryItemTitle>
                {_t('pWvUaUsA43bKoTB972736E')}
                <Tooltip title={_t('pbSSG2oCUxeW9HU8YXdpyo')} header={_t('pWvUaUsA43bKoTB972736E')}>
                  <QuestionIcon />
                </Tooltip>
              </LotteryItemTitle>
              <LotteryItemValue className="active">
                {formatTicks(tickets + (extraTickets || 0))}
                {extraTickets ? (
                  <span className="detail">
                    ({formatTicks(tickets)}+{formatTicks(extraTickets)})
                  </span>
                ) : null}
              </LotteryItemValue>
            </LotteryItem>
            <LotteryItem>
              <LotteryItemTitle>{_t('pdBhiqLPWRWp1o79xDgG3e')}</LotteryItemTitle>
              <LotteryItemValue>{formatTicks(totalTickets)}</LotteryItemValue>
            </LotteryItem>
          </LotteryItems>
        </ItemTextWrapper>
      );
    } else if (isSameOrBefore(RESULT_ANNOUNCED_STATUS)) {
      if (!isNil(hit)) {
        // 查到了中奖结果
        // 根据中没中奖显示不同的内容
        return (
          <Item>
            <ItemTitle2>
              <ItemMark />
              {_t('iM3wxyfjp8F9m9LqDK8hnj')}
            </ItemTitle2>
            <ParticipatePeople />
            <WinningResultGreeting>
              {hit ? _t('3AMTH3ZgHRYkGHYq7qDkVN') : _t('c5CE8ZzzzgykKpYKajGUNc')}
            </WinningResultGreeting>
            <WinningResult className={hit ? '' : 'noHit'}>
              {hit ? _t('k2pzjios2bfR9ZNPL8MYLH') : _t('3UddwrP1TBRaz9Zj13HmDs')}
            </WinningResult>
          </Item>
        );
      } else {
        // 没查到中奖结果
        return (
          <Item>
            <ItemTitle2>
              <ItemMark />
              {_t('iM3wxyfjp8F9m9LqDK8hnj')}
            </ItemTitle2>
            <ParticipatePeople />
            <WinningResult className="noHit" style={{ marginTop: 40 }}>
              {_t('2isZfUWs2JZMsGexYeHQiG')}
            </WinningResult>
          </Item>
        );
      }
    } else if (isSameOrBefore(LOTTERY_STATUS)) {
      if (hit) {
        // 奖励待发放(扣发执行中)
        return (
          <Item>
            <ItemTitle2>
              <ItemMark />
              {_t('4wP5qkMdwgp1vnqjnBkmDE')}
            </ItemTitle2>
            <ParticipatePeople />
            {tipsModule ? (
              <ItemContent>
                <Html>{tipsModule}</Html>
              </ItemContent>
            ) : null}
          </Item>
        );
      } else {
        // 没中奖
        return (
          <Item>
            <ItemTitle2>
              <ItemMark />
              {_t('onuKgLFAb2D9LfARiRiVbk')}
            </ItemTitle2>
            <ParticipatePeople />
            <ItemContent>
              <Html>{_t('3UddwrP1TBRaz9Zj13HmDs')}</Html>
            </ItemContent>
          </Item>
        );
      }
    } else {
      // 活动已结束 扣发工作已完成
      return (
        <Item>
          <ItemTitle2 className="done">
            <ItemMark className="done" />
            {reserved ? _t('vM1oXVbbbAq4neDTEuqdNH') : _t('4Gv3YJ8iv3HkSJeutQk7se')}
          </ItemTitle2>
          <ParticipatePeople />
          <ItemContent className="done">{_t('ieaamda65QWKDF6b5V4cgH')}</ItemContent>
        </Item>
      );
    }
  }, [
    isLogin,
    tipsModule,
    completedKyc,
    signedCountryAgreement,
    signedAgreement,
    reserved,
    tickets,
    totalTickets,
    extraTickets,
    hit,
    formatTicks,
    handleParticipate,
    isSameOrBefore,
  ]);

  return (
    <Wrapper>
      <div>{content}</div>
    </Wrapper>
  );
};

export default memo(Participate);
