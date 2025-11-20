import React, {memo} from 'react';
import {Radio} from '@krn/ui';

const {Group: KrnRadioGroup} = Radio;

const Group = memo(
  ({value, onChange, disabled, toggleSelection = false, ...others}) => {
    // 处理Radio Group的onChange事件
    const handleChange = newValue => {
      // 支持禁用
      if (disabled) return;
      if (toggleSelection && value === newValue) {
        // 如果允许反选，并且新值与当前值相同，则设置value为null来反选
        onChange(null);
      } else {
        onChange(newValue);
      }
    };

    return <KrnRadioGroup value={value} onChange={handleChange} {...others} />;
  },
);

export default Group;
