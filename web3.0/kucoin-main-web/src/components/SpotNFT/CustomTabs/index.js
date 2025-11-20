/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import clxs from 'classnames';
import Tabs from './Tabs';
import Tab from './Tab';
import style from './style.less';

const CustomTabs = (props) => {
  const { className = '' } = props;
  return <Tabs {...props} className={clxs(className, style.customTabs)} />;
};

CustomTabs.CustomTab = (props) => {
  const { className = '' } = props;
  return <Tab {...props} className={clxs(className, style.customTab)} />;
};

export default CustomTabs;
