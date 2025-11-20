/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui/emotion';
import { Dialog } from '@kufox/mui';
import question_mark from 'assets/recall/question_mark.svg';
import modal_close from 'assets/recall/modal_close.svg';
import cardGreenUnOpen from 'assets/recall/card_green_un_open.svg';
import cardBlueUnOpen from 'assets/recall/card_blue_un_open.svg';
import cardYellowUnOpen from 'assets/recall/card_yellow_un_open.svg';
import { _t } from 'utils/lang';
import { px2rem } from '@kufox/mui/utils';
import { useDispatch, useSelector } from 'dva';
import { saTrackForBiz, kcsensorsClick } from 'utils/ga';

const Modal = styled(Dialog)`
  background: transparent;
`;

const Content = styled.div`
  width: ${px2rem(355)};
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.base};
  border-radius: ${px2rem(6)};
  padding: ${px2rem(29)} ${px2rem(10)} ${px2rem(52)};
  text-align: center;
`;
const Title = styled.h3`
  font-weight: 500;
  font-size: ${px2rem(20)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(10)};
`;
const SubTitle = styled.h4`
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${px2rem(25)};
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
    step === 1 ? cardGreenUnOpen : step === 2 ? cardBlueUnOpen : cardYellowUnOpen});
  background-size: 100% 100%;
`;
const Question = styled.img`
  width: ${px2rem(24)};
  height: ${px2rem(37.84)};
  margin-top: ${px2rem(26)};
  margin-bottom: ${px2rem(17)};
`;
const OpenText = styled.p`
  font-size: ${px2rem(12)};
  transform: scale(0.8333);
  color: #ffffff;
  word-break: break-all;
`;

const Close = styled.img`
  width: ${px2rem(36)};
  height: ${px2rem(36)};
  display: block;
  margin: ${px2rem(24)} auto 0;
`;

const UnOpenCardModal = ({ show, onCancel, onOpen, optionKey }) => {
  const { generalInfo } = useSelector(state => state.userRecall);
  const dispatch = useDispatch();
  const openCardLoading = useSelector(state => state.loading.effects['userRecall/openCard']);
  const { currency: activityCurrency } = generalInfo;

  const handleOpenCard = async index => {
    if (openCardLoading) return;

    await dispatch({
      type: 'userRecall/openCard',
      payload: { chosenOrder: index + 1, stageId: generalInfo.curStageId },
    });
    onOpen && onOpen();

    try {
      kcsensorsClick(['lotteryPopup', '1'], {
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
      saTrackForBiz({}, ['lotteryPopup', '1'], {
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
      kcsensorsClick(['lotteryPopup', '1'], {
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
      <Content>
        <Title>
          {generalInfo?.curStageOrder === 1
            ? _t('pTomxw5PRE4To7F9HV9jGq')
            : _t('v7N4e4dZQJAMTYxVkNfHUu')}
        </Title>
        <SubTitle>
          {generalInfo?.curStageOrder === 1
            ? _t('994REGQuGxqvFwbPr1wCoX', { currency: activityCurrency })
            : _t('wj8LSFVf5CkBr45xNdDXpc')}
        </SubTitle>
        <Cards>
          {new Array(3).fill(null).map((_, index) => (
            <CardItem
              step={generalInfo?.curStageOrder}
              key={index}
              onClick={() => handleOpenCard(index)}
            >
              <Question src={question_mark} />
              <OpenText>{_t('8a4UmpZWq1r2BgeRCy6VNC')}</OpenText>
            </CardItem>
          ))}
        </Cards>
      </Content>
      <Close src={modal_close} onClick={handleCancel} />
    </Modal>
  );
};

export default UnOpenCardModal;
