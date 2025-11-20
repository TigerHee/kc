import {useMemoizedFn} from 'ahooks';
import React, {memo, useRef, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {getBaseCurrency} from 'site/tenant';
import {css} from '@emotion/native';

import {FormField} from 'components/Common/Form';
import {ProfileEditIc} from 'components/Common/SvgIcon';
import TipTrigger from 'components/Common/TipTrigger';
import {mediumHitSlop} from 'constants/index';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import EditCopyMaxAmountPopup from './components/EditCopyMaxAmountPopup';
import EditSuccessPopup from './components/EditSuccessPopup';
import ProjectPnlInfo from './ProjectPnlInfo';
import {CopyMaxAmountReadLabelWrap, CopyMaxAmountReadText} from './styles';

const OutShowAmount = memo(({value, onChange}) => {
  const [showConfirm, setConfirmShow] = useState(false);
  const editSuccessPopupRef = useRef(null);

  const openEditMaxAmountDialog = useMemoizedFn(() => {
    setConfirmShow(true);
  });

  const onFinalSubmit = useMemoizedFn(({oldAmount, newAmount}) => {
    onChange(newAmount);
    setConfirmShow(false);
    editSuccessPopupRef.current?.open({
      oldAmount,
      newAmount,
    });
  });

  return (
    <>
      <RowWrap>
        <CopyMaxAmountReadText>{value}</CopyMaxAmountReadText>
        <TouchableOpacity
          style={css`
            margin-left: 8px;
          `}
          activeOpacity={0.8}
          hitSlop={mediumHitSlop}
          onPress={openEditMaxAmountDialog}>
          <ProfileEditIc />
        </TouchableOpacity>
      </RowWrap>

      <ProjectPnlInfo copyAmount={value} />

      <EditCopyMaxAmountPopup
        showConfirm={showConfirm}
        setConfirmShow={setConfirmShow}
        onFinalSubmit={onFinalSubmit}
      />
      <EditSuccessPopup ref={editSuccessPopupRef} />
    </>
  );
});

export const EditModeCopyMaxAmount = memo(() => {
  const {_t} = useLang();
  return (
    <>
      <FormField
        name="maxAmount"
        label={
          <CopyMaxAmountReadLabelWrap>
            <TipTrigger
              textStyle={css`
                font-size: 14px;
                font-weight: 500;
                line-height: 18.2px;
              `}
              showUnderLine={false}
              showIcon
              text={_t('6a045433504b4000aef2', {symbol: getBaseCurrency()})}
              textColor="text"
              message={_t('e64b16efb4ee4000afc6')}
              labelColor="text"
            />
          </CopyMaxAmountReadLabelWrap>
        }>
        {({...register}) => <OutShowAmount {...register} />}
      </FormField>
    </>
  );
});
