/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { Button, Dialog } from '@kufox/mui';
import card_green_un_receive from 'assets/recall/card_green_un_receive.svg';
import card_blue_un_receive from 'assets/recall/card_blue_un_receive.svg';
import card_yellow_un_receive from 'assets/recall/card_yellow_un_receive.svg';
import CoinIcon from 'components/common/KcCoinIcon';
import CoinCodeToName from 'components/common/CoinCodeToName';
import { _t } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { saTrackForBiz, kcsensorsClick } from 'src/utils/ga';
import { useSelector } from 'dva';
import { formatNumber } from 'components/$/Recall/config';

import glittering from 'assets/recall/glittering.svg';
import modal_close from 'assets/recall/modal_close.svg';

const Modal = styled(Dialog)`
  background: transparent;
  text-align: center;
`;

const CardItem = styled.div`
  text-align: center;
  width: ${px2rem(134)};
  height: ${px2rem(167.5)};
  background-image: url(${({ step }) =>
    step === 1
      ? card_green_un_receive
      : step === 2
      ? card_blue_un_receive
      : card_yellow_un_receive});
  background-size: 100% 100%;
  padding-top: ${px2rem(20)};
  margin: 0 auto ${px2rem(26)};
`;

const Number = styled.p`
  font-weight: 500;
  font-size: ${px2rem(24)};
  line-height: 130%;
  text-align: center;
  // ux要求写死
  color: #00142a;
  margin-top: ${px2rem(10)};
  margin-bottom: ${px2rem(2)};
`;
const Name = styled.p`
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: 130%;
  text-align: center;
  // ux要求写死
  color: rgba(0, 20, 42, 0.6);
  margin-bottom: ${px2rem(8)};
`;

const Desc = styled.p`
  font-weight: 500;
  font-size: ${px2rem(14)};
  line-height: 130%;
  // ux要求写死
  color: #00142a;
  width: ${px2rem(110)};
  margin: 0 auto;
  word-break: break-all;
`;

const ExtendButton = styled(Button)`
  // ux要求写死
  background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  border: ${px2rem(1)} solid #8e5c2d;
  color: #453526;
  border-radius: ${px2rem(6)};
  font-weight: 500;
  font-size: ${px2rem(16)};
  &:hover {
    // ux要求写死
    background: linear-gradient(360deg, #ffc759 0%, #ffa455 22.89%, #ffb947 115%);
  }
`;

const Glittering = styled.img`
  width: ${px2rem(375)};
  position: absolute;
  left: 0;
  top: ${px2rem(-78)};
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

const Close = styled.img`
  width: ${px2rem(36)};
  height: ${px2rem(36)};
  display: block;
  margin: ${px2rem(24)} auto 0;
`;

const CompleteQuestModal = ({ show, onWithdraw, optionKey, onCancel }) => {
  const { currentStageInfo, generalInfo } = useSelector((state) => state.userRecall);
  const { currency: activityCurrency } = generalInfo;

  const handleClick = () => {
    try {
      kcsensorsClick(['completePopup', '1'], {
        optionKey,
        allItemAmount: generalInfo?.curStageOrder, //所属阶段
      });
    } catch (e) {
      console.log('e', e);
    }
    onWithdraw && onWithdraw();
  };
  useEffect(() => {
    try {
      if (show) {
        saTrackForBiz({}, ['completePopup', '1'], {
          optionKey,
          allItemAmount: generalInfo?.curStageOrder, //所属阶段
        });
      }
    } catch (e) {
      console.log('e', e);
    }
  }, [show]);

  const handleCancel = () => {
    onCancel && onCancel();
  };

  return (
    <Modal footer={null} header={null} open={show} rootProps={{ style: { zIndex: 1071 } }}>
      <Glittering src={glittering} />
      <CardItem step={generalInfo?.curStageOrder}>
        <CoinIcon currency={activityCurrency} size="31" showName={false} />
        <Number>{formatNumber(currentStageInfo?.bonusAmount)}</Number>
        <Name>
          <CoinCodeToName coin={activityCurrency} />
        </Name>
        <Desc>{_t('64o15KRqgv9FGtjejqgq4U')}</Desc>
      </CardItem>
      <ExtendButton onClick={handleClick}>{_t('94eXhBxuXn14kiHMF2h3Nx')}</ExtendButton>
      <Close src={modal_close} onClick={handleCancel} />
    </Modal>
  );
};

export default CompleteQuestModal;
