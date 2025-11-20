/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import { Tabs } from '@mui/Tabs';
import { map } from 'lodash';
import { _t } from 'src/utils/lang';
import { useTab } from './hooks/useTabs';
import Item from './Item';
import { namespace } from '../../config';
import { useSelector } from 'dva';

/**
 * 三级Tabs
 */
const ThirdTabs = () => {
  const { thirdActive: active, thirdOptions: configs, onChange } = useTab(3);
  const isFloat = useSelector(state => state[namespace].isFloat);
  // 不显示三级
  if (!configs || configs.length === 0) {
    return <></>;
  }
  return (
    <Tabs
      className="market-third-tabs"
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

export default ThirdTabs;
