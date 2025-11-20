/*
 * @Owner: Clyne@kupotech.com
 */
import React from 'react';
import { Tabs } from '@mui/Tabs';
import { map } from 'lodash';
import { _t } from 'src/utils/lang';
import ToolTip from '@mui/Tooltip';
import { useListTypeChange, useTab } from './hooks/useTabs';
import ChangeIcon from './ChangeIcon';
import Item from './Item';
import { useTabType } from '../Content/hooks/useType';
import { useSelector } from 'dva';
import { namespace } from '../../config';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

/**
 * 一级分类左侧tabs
 */
const LeftTabs = () => {
  const { isSearch } = useTabType();
  const isFloat = useSelector((state) => state[namespace].isFloat);
  // search类型的tab切换不缓存
  const { firstActive: active, firstOptions: configs, onChange, listType } = useTab(1, !isSearch);
  return (
    <Tabs
      indicator={false}
      key={listType}
      className={`market-first-tabs ${listType}`}
      size="xsmall"
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

/**
 * 一级分类右侧内容
 */
const RightPanel = () => {
  const { onChange } = useListTypeChange();
  const { isSearch, isCoin } = useTabType();
  const isH5 = useIsH5();
  // 搜索不显示
  if (isSearch) {
    return <></>;
  }
  if (isH5) {
    return (
      <div className="change-type">
        <ChangeIcon onClick={onChange} />
      </div>
    );
  }
  return (
    <ToolTip placement="top" title={!isCoin ? _t('group.by.cypto') : _t('group.by.instrument')}>
      <div className="change-type">
        <ChangeIcon onClick={onChange} />
      </div>
    </ToolTip>
  );
};

/**
 * 一级Tabs
 */
const FirstTabs = () => {
  return (
    <div className="first-tabs">
      <LeftTabs />
      <RightPanel />
    </div>
  );
};

export default FirstTabs;
