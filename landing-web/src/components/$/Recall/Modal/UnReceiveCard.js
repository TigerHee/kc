/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { Button, Dialog } from '@kufox/mui';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import modal_close from 'assets/recall/modal_close.svg';
import card_green_un_receive from 'assets/recall/card_green_un_receive.svg';
import card_blue_un_receive from 'assets/recall/card_blue_un_receive.svg';
import card_yellow_un_receive from 'assets/recall/card_yellow_un_receive.svg';
import CoinIcon from 'components/common/KcCoinIcon';
import CoinCodeToName from 'components/common/CoinCodeToName';
import { _t } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { useDispatch, useSelector } from 'dva';

import { formatNumber } from 'components/$/Recall/config';

import { saTrackForBiz, kcsensorsClick } from 'utils/ga';
import glittering from 'assets/recall/glittering.svg';

const Modal = styled(Dialog)`
  background: transparent;
`;

const Content = styled.div`
  width: ${px2rem(355)};
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.base};
  border-radius: ${px2rem(6)};
  padding: ${px2rem(40)} ${px2rem(10)} ${px2rem(23)};
  text-align: center;
`;
const Title = styled.h3`
  font-weight: 500;
  font-size: ${px2rem(18)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(13)};
`;

const Cards = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CardItem = styled.div`
  width: ${px2rem(104)};
  height: ${px2rem(130)};
  background-image: url(${({ step }) =>
    step === 1
      ? card_green_un_receive
      : step === 2
      ? card_blue_un_receive
      : card_yellow_un_receive});
  background-size: 100% 100%;
  margin-bottom: ${px2rem(20)};
  padding-top: ${px2rem(26)};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

const Close = styled.img`
  width: ${px2rem(36)};
  height: ${px2rem(36)};
  display: block;
  margin: ${px2rem(24)} auto 0;
`;

const ExtendButton = styled(Button)`
  background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  border: ${px2rem(1)} solid #8e5c2d;
  color: #453526;
  border-radius: ${px2rem(4)};
  width: ${px2rem(274)};
  font-weight: 500;
  &:hover {
    background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  }
`;
const CoinIconDIv = styled.div`
  height: ${px2rem(54)};
  width: ${px2rem(54)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${px2rem(-30)};
  background: ${({ theme }) => theme.colors.base};
`;

const CoinIconImgDiv = styled.div`
  height: ${px2rem(40)};
  width: ${px2rem(40)};
  border-radius: 50%;
  overflow: hidden;
`;

const CoinIconImg = styled.img`
  height: ${px2rem(40)};
  width: ${px2rem(40)};
  display: block;
`;

const Number = styled.p`
  font-weight: 500;
  font-size: ${px2rem(14)};
  line-height: 130%;
  text-align: center;
  color: #00142a;
  margin-top: ${px2rem(7)};
  margin-bottom: ${px2rem(2)};
`;
const Name = styled.p`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: 130%;
  text-align: center;
  color: rgba(0, 20, 42, 0.6);
  margin-bottom: 0;
`;

const Glittering = styled.img`
  width: ${px2rem(375)};
  position: absolute;
  left: ${px2rem(13)};
  top: ${px2rem(-60)};
  z-index: -1;
  animation: glittering 8s linear infinite;

  @keyframes glittering {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const UnReceiveCardModal = ({ show, onCancel, onReceive, optionKey }) => {
  const { message } = useSnackbar();
  const { currentStageInfo, generalInfo } = useSelector((state) => state.userRecall);
  const { bonusRecords = [], order, bonusAmount } = currentStageInfo;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.effects['userRecall/recallReceive']);
  const { currency: activityCurrency } = generalInfo;
  const categories = useSelector((state) => state.categories);
  const coinIconSrc = categories[activityCurrency]?.iconUrl; // 活动币种icon

  const handleClickBtn = async () => {
    if (loading) return;
    await dispatch({
      type: 'userRecall/recallReceive',
      payload: { stageId: generalInfo.curStageId },
    });
    message.success(_t('3DDXbmht6HSb1d1BqB22T8'));
    onReceive && onReceive();
    try {
      kcsensorsClick(['claimPopup', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
        clickPosition: 'draw',
      });
    } catch (e) {
      console.log('e', e);
    }
  };
  useEffect(() => {
    try {
      saTrackForBiz({}, ['claimPopup', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
        clickPosition: '',
      });
    } catch (e) {
      console.log('e', e);
    }
  }, []);

  const handleCancel = () => {
    try {
      kcsensorsClick(['claimPopup', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
        clickPosition: 'close',
      });
    } catch (e) {
      console.log('e', e);
    }
    onCancel && onCancel();
  };
  return (
    <Modal
      footer={null}
      header={null}
      open={show}
      onCancel={handleCancel}
      rootProps={{ style: { zIndex: 1071 } }}
    >
      <Glittering src={glittering} />
      <CoinIconDIv>
        <CoinIconImgDiv>
          <CoinIconImg src={coinIconSrc} />
        </CoinIconImgDiv>
      </CoinIconDIv>
      <Content>
        <Title>
          {_t('7DSVmb2GT93nU5dSkG6FYt', {
            number: formatNumber(bonusAmount),
            currency: activityCurrency,
          })}
        </Title>
        <Cards>
          {bonusRecords.map((item, index) => (
            <CardItem step={order} disabled={!item.hit} key={index}>
              <CoinIcon currency={activityCurrency} size="24" showName={false} />
              <Number>{formatNumber(item.amount)}</Number>
              <Name>
                <CoinCodeToName coin={activityCurrency} />
              </Name>
            </CardItem>
          ))}
        </Cards>
        <ExtendButton onClick={handleClickBtn}>{_t('qMFyF4ZHHpK5pdTyDFnXrS')}</ExtendButton>
      </Content>
      <Close src={modal_close} onClick={handleCancel} />
    </Modal>
  );
};

export default UnReceiveCardModal;
