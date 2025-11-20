/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import { Tabs } from '@mui/Tabs';
import { map } from 'lodash';
import { _t } from 'src/utils/lang';
import { useTab } from './hooks/useTabs';
import Item from './Item';
import { useSelector } from 'dva';
import { namespace } from '../../config';

/**
 * 二级Tabs
 */
const SecondTabs = () => {
  const { secondActive: active, secondOptions: configs, onChange } = useTab(2);
  const isFloat = useSelector((state) => state[namespace].isFloat);

  // 不显示二级
  if (!configs || configs.length === 0) {
    return <></>;
  }
  return (
    <Tabs
      className="market-second-tabs"
      variant="bordered"
      size="small"
      value={active}
      onChange={onChange}
      inLayer={isFloat}
    >
      {map(configs, (props) => (
        <Item {...props} />
      ))}
    </Tabs>
  );
};

export default SecondTabs;
