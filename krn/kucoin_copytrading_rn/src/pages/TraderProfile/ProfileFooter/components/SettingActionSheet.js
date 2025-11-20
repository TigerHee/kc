/**
 * Owner: mike@kupotech.com
 */
import React from 'react';

import useLang from 'hooks/useLang';
import ChooseActionSheet from '../../components/ChooseActionSheet';

const SettingActionSheet = ({options, show, toggleSheet}) => {
  const {_t} = useLang();
  const onSelected = value => {
    const onPressCb = options.find(el => el.value === value)?.onPress;
    toggleSheet();

    onPressCb?.();
  };

  return (
    <ChooseActionSheet
      title={_t('0ff2cfa5547f4000a2c1')}
      toggleSheet={toggleSheet}
      options={options}
      show={show}
      onSelected={onSelected}
    />
  );
};

export default SettingActionSheet;
