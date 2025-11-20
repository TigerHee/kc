import {useMemoizedFn, useToggle} from 'ahooks';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from '@emotion/native';

import icBuy from 'assets/transfer/ic-buy_crypto.png';
import icDeposit from 'assets/transfer/ic-deposit.png';
import icTransfer from 'assets/transfer/ic-transfer.png';
import SelectDrawer from 'components/Common/Select/components/SelectDrawer';
import {commonStyles, RowWrap} from 'constants/styles';
import {usePush} from '../../../hooks/usePush';

const MoreTipIcon = styled.Image`
  width: 20px;
  height: 20px;
  margin-right: 16px;
`;

const MoreTipText = styled.Text`
  ${commonStyles.textStyle}
  font-weight: 500;
`;

const options = [
  {
    label: (
      <RowWrap>
        <MoreTipIcon source={icDeposit} />
        <MoreTipText>Deposit</MoreTipText>
      </RowWrap>
    ),
    value: 'Deposit',
  },
  {
    label: (
      <RowWrap>
        <MoreTipIcon source={icBuy} />
        <MoreTipText>Buy Crypto</MoreTipText>
      </RowWrap>
    ),
    value: 'Buy',
  },
  {
    label: (
      <RowWrap>
        <MoreTipIcon source={icTransfer} />
        <MoreTipText>Transfer</MoreTipText>
      </RowWrap>
    ),
    value: 'Transfer',
  },
];
const MoreActionDrawer = () => {
  const [activeSelect, {toggle}] = useToggle(false);
  const {push} = usePush();
  const handlePressOption = useMemoizedFn(() => {
    toggle();
    push('');
  });

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={toggle}>
        {/* <MoreIcon source={icMorePoint} /> */}
      </TouchableOpacity>
      <SelectDrawer
        onClose={toggle}
        list={options || []}
        show={activeSelect}
        selectValue={activeSelect}
        handleClickItem={handlePressOption}
      />
    </>
  );
};

export default MoreActionDrawer;
