import {usePullCopyFormConfig} from 'pages/FollowSetting/hooks/usePullCopyFormConfig';
import {genNumberRangePlaceholder} from 'pages/FollowSetting/presenter/helper';
import {ExtraLabelText} from 'pages/FollowSetting/styles';
import React from 'react';
import {useFormContext} from 'react-hook-form';

import useLang from 'hooks/useLang';
import {ExtraNumberInputField} from '../../ExtraInputField';
import {FOLLOW_SETTING_EDIT_MODE} from '../index';
import RightAvailableBalance from './RightAvailableBalance';

export const CreateSceneCopyAmountInput = ({editMode}) => {
  const {_t} = useLang();
  const {data: formConfigResp} = usePullCopyFormConfig();
  const {maxCopyAmount, minCopyAmount} = formConfigResp?.data || {};
  const {trigger} = useFormContext();

  //  触发跟单金额字段校验
  const triggerValidateField = () => {
    trigger('maxAmount');
  };

  return (
    <ExtraNumberInputField
      disabled={editMode === FOLLOW_SETTING_EDIT_MODE.Edit}
      allowDecimalNum={2}
      name="maxAmount"
      labelTip={_t('e64b16efb4ee4000afc6')}
      label={_t('74f0dc97678f4000a46d')}
      labelColor="text"
      size="medium"
      placeholder={genNumberRangePlaceholder(minCopyAmount, maxCopyAmount)}
      extraLeftNode={
        <ExtraLabelText>{_t('9778bc0a34da4000ad0b')}</ExtraLabelText>
      }
      extraRightNode={
        <RightAvailableBalance triggerValidateField={triggerValidateField} />
      }
    />
  );
};
