import {useMemoizedFn, useToggle} from 'ahooks';
import React, {forwardRef, useImperativeHandle} from 'react';
import styled from '@emotion/native';

import buyIc from 'assets/follow/ic-buy-crypto.png';
import SelectDrawer from 'components/Common/Select/components/SelectDrawer';
import {DrawDepositIc, DrawTransferIc} from 'components/Common/SvgIcon';
import {commonStyles, RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import {isIOS} from 'utils/helper';
import {
  gotoDepositPageByCoin,
  gotoOTCPage,
  gotoTransferPageByCoin,
} from 'utils/native-router-helper';
import {BuyIc} from './styles';
const MoreTipText = styled.Text`
  ${commonStyles.textStyle}
  font-weight: 500;
  margin-left: 16px;
`;

const TransferOptionMap = {
  Deposit: 'Deposit',
  BuyCrypto: 'BuyCrypto',
  Transfer: 'Transfer',
};

const TransferOptionUrlMap = {
  [TransferOptionMap.Deposit]: gotoDepositPageByCoin,
  [TransferOptionMap.BuyCrypto]: gotoOTCPage,
  [TransferOptionMap.Transfer]: gotoTransferPageByCoin,
};

const AmountTransferDrawer = forwardRef((props, ref) => {
  const {closeOuterPopup} = props;
  const [activeSelect, {toggle}] = useToggle(false);
  const {_t} = useLang();
  const handlePressOption = useMemoizedFn(value => {
    // jsbridge.link Api 在 ios 内嵌 rn容器 ActionSheet场景 会出现ActionSheet打开内嵌页面 打开异常问题 如果外层存在closeOuterPopup 也先关闭
    if (isIOS && closeOuterPopup) {
      closeOuterPopup();
    }
    toggle();
    // jsbridge.link Api 在 ios 内嵌 rn容器 ActionSheet场景 会出现ActionSheet打开内嵌页面 打开异常问题 ，
    // 此处 确保ActionSheet关闭后 调用 link api
    setTimeout(() => {
      TransferOptionUrlMap[value]?.();
    }, 300);
  });

  const options = [
    {
      label: (
        <RowWrap>
          <DrawDepositIc />
          <MoreTipText>{_t('a8b8f98f1bb74000a0ed')}</MoreTipText>
        </RowWrap>
      ),
      value: TransferOptionMap.Deposit,
    },
    {
      label: (
        <RowWrap>
          <BuyIc source={buyIc} />
          <MoreTipText>{_t('84afbb3358744000a46e')}</MoreTipText>
        </RowWrap>
      ),
      value: TransferOptionMap.BuyCrypto,
    },

    {
      label: (
        <RowWrap>
          <DrawTransferIc />
          <MoreTipText>{_t('bb0b551a5f5c4000a62f')}</MoreTipText>
        </RowWrap>
      ),
      value: TransferOptionMap.Transfer,
    },
  ];

  const open = useMemoizedFn(() => {
    toggle();
  });
  useImperativeHandle(
    ref,
    () => ({
      open,
    }),
    [open],
  );

  return (
    <>
      <SelectDrawer
        onClose={toggle}
        list={options || []}
        show={activeSelect}
        selectValue={activeSelect}
        handleClickItem={handlePressOption}
      />
    </>
  );
});

export default AmountTransferDrawer;
