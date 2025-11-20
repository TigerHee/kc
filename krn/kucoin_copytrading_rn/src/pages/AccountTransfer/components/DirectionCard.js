import React from 'react';

import icTransfer from 'assets/common/ic-transfer.png';
import Card from 'components/Common/Card';
import {SecondaryStyleText} from 'constants/styles';
import useLang from 'hooks/useLang';
import {
  BetweenWrap,
  DirValue,
  FromOrToBox,
  TransferDirBox,
  TransferDirIc,
} from '../styles';

const DirectionCard = ({toggle, isParentOutAccDirection}) => {
  const {_t} = useLang();
  return (
    <Card style={{width: '100%'}}>
      <BetweenWrap>
        <FromOrToBox>
          <SecondaryStyleText>{_t('18176564592e4000ada3')}</SecondaryStyleText>
          <DirValue>
            {isParentOutAccDirection
              ? _t('1459b0e26a984000a1c7')
              : _t('525845ec781b4000a8df')}
          </DirValue>
        </FromOrToBox>

        <TransferDirBox onPress={toggle}>
          <TransferDirIc source={icTransfer} />
        </TransferDirBox>

        <FromOrToBox isRight>
          <SecondaryStyleText>{_t('d5ecd41c43654000a609')}</SecondaryStyleText>
          <DirValue style={{textAlign: 'right'}}>
            {!isParentOutAccDirection
              ? _t('1459b0e26a984000a1c7')
              : _t('525845ec781b4000a8df')}
          </DirValue>
        </FromOrToBox>
      </BetweenWrap>
    </Card>
  );
};

export default DirectionCard;
