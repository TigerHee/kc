/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import {Button, Confirm} from '@krn/ui';
import styled from '@emotion/native';
import reward_modal_cover_1 from 'assets/convert/reward_modal_cover_1.png';
import reward_modal_cover_2 from 'assets/convert/reward_modal_cover_2.png';
import reward_modal_cover_3 from 'assets/convert/reward_modal_cover_3.png';
import reward_modal_close from 'assets/convert/reward_modal_close.png';
import {openNative} from '@krn/bridge';
import useLang from 'hooks/useLang';
import {getIsKC} from 'site/index';

const ModalOuter = styled.View`
  margin: 0 37.5px;
`;

const ModalMain = styled.View`
  background: ${({theme}) => theme.colorV2.layer};
  border-radius: 16px;
  padding: 0 24px 28px;
  position: relative;
`;

const Title = styled.Text`
  font-size: 24px;
  color: ${({theme}) => theme.colorV2.text};
  font-weight: 600;
  line-height: 31.2px;
  margin-bottom: 12px;
  text-align: center;
`;
const Desc = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colorV2.text60};
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 47px;
  text-align: center;
`;

const RewardModalCover1 = styled.Image`
  width: 252px;
  height: 168px;
  margin: -118px auto 10px;
`;

const RewardModalCover2 = styled.Image`
  position: absolute;
  left: 0;
  top: 0;
  width: 108.71px;
  height: 119.59px;
`;
const RewardModalCover3 = styled.Image`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 48px;
  height: 51px;
`;

const ModalCloseView = styled.Pressable`
  margin: 25px auto 0;
`;
const ModalCloseIcon = styled.Image`
  width: 34px;
  height: 34px;
`;

const MarginRewardModal = ({show, setShow}) => {
  const {_t} = useLang();
  const isKC = getIsKC();

  const handleClose = () => {
    setShow(false);
  };

  const handleReward = async () => {
    handleClose();

    setTimeout(() => {
      openNative('/flutter?route=/lever/target/lend&needLogin=true');
    }, 200);
  };

  return (
    <Confirm show={show} onClose={handleClose}>
      <ModalOuter>
        <ModalMain>
          <RewardModalCover1 source={reward_modal_cover_1} />
          <Title>{_t('fEgA2m2TXKHv3TkEjSRsC4')}</Title>
          <Desc>{_t('ci9jSNHiN5d2WyYsJjNKYK')}</Desc>
          {isKC && (
            <Button onPress={handleReward}>
              {_t('acXMRAzQJAvRshUpM6ugDa')}
            </Button>
          )}
          <RewardModalCover2 source={reward_modal_cover_2} />
          <RewardModalCover3 source={reward_modal_cover_3} />
        </ModalMain>
        <ModalCloseView onPress={handleClose}>
          <ModalCloseIcon source={reward_modal_close} />
        </ModalCloseView>
      </ModalOuter>
    </Confirm>
  );
};

export default MarginRewardModal;
