/*
 * @Owner: Clyne@kupotech.com
 */
import React, { memo, forwardRef } from 'react';
import { Tabs } from '@mui/Tabs';
import { _t } from 'src/utils/lang';
import SvgComponent from '@/components/SvgComponent';
import NewTag from '@/components/NewTag';

const { Tab } = Tabs;

const Item = (
  { label, value, isNew = false, isHot = false, isNotI18n = false, ...others },
  ref,
) => {
  let labelText = isNotI18n ? label : _t(label);
  labelText = (
    <div className="item-label" data-value={value}>
      <div>{labelText}</div>
      {isHot ? <SvgComponent size={16} fileName="markets" color="#F65454" type={'fire'} /> : <></>}
      {isNew ? <NewTag /> : <></>}
    </div>
  );
  return <Tab ref={ref} value={value} label={labelText} key={value} {...others} />;
};

export default memo(forwardRef(Item));
