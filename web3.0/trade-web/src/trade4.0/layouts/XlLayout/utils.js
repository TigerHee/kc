/*
 * owner: Borden@kupotech.com
 */
import { Actions, DockLocation } from '@kc/flexlayout-react';
import { findIndex, find, includes, some } from 'lodash';
import { getModuleConfig } from '../moduleConfig';

/**
 * 在浮动后重新选择活动的tab
 */
export const adjustSelectedIndexAfterFloat = (node, floatIds) => {
  const children = node.getChildren();
  const newSelected = findIndex(children, (child) => {
    const childId = child.getId();
    return !floatIds[childId];
  });
  if (newSelected > -1) {
    node._setSelected(newSelected);
  }
};
/**
 * 往布局中添加模块
 */
export const addModuleToLayout = ({ model, id, tabsetId, select = true }) => {
  if (!model || model?.getNodeById(id)) return;
  const moduleConfig = getModuleConfig(id);
  tabsetId = tabsetId || model.getActiveTabset()?.getId() || find(
    Object.keys(model._idMap),
    v => model._idMap?.[v]?._attributes?.type === 'tabset',
  );
  const tabsetNode = model?.getNodeById(tabsetId);
  if (tabsetNode !== undefined) {
    model.doAction(
      Actions.addNode(moduleConfig, tabsetId, DockLocation.CENTER, -1, select),
    );
  }
};
/**
 * 获取某个容器的选中子节点信息(id、是否不可替换高亮模块)
 * selectExcludeModule不传默认所有模块都是不可替换高亮的
 */
export const getSelectedNodeInfo = ({ model, tabsetId, selectExcludeModule }) => {
  const selectChildId = model
    ?.getNodeById(tabsetId)
    ?.getSelectedNode()
    ?.getId();
  const isImportantNode =
    !Array.isArray(selectExcludeModule) ||
    includes(selectExcludeModule, selectChildId);
  return {
    isImportantNode,
    id: selectChildId,
  };
};
/**
 * 查找根据优先的兄弟元素顺序查找容器id
 */
export const findPriorityTabsetId = ({ model, priorityPosition }) => {
  let tabsetId;
  some(priorityPosition, (v) => {
    const priorityNode = model.getNodeById(v);
    const priorityParentNodeId = priorityNode?.getParent()?.getId();
    if (priorityParentNodeId) {
      tabsetId = priorityParentNodeId;
      return true;
    }
    return false;
  });
  return tabsetId;
};
/**
 * 收集一定时间内将要更新的map数据，统一执行更新
 */
export const debounceUpdateMap = (func, wait) => {
  let timeout;
  let argsMap = null;

  return function handle(...args) {
    argsMap = { ...argsMap, ...args[0] };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(argsMap);

      argsMap = null;
      if (timeout) {
        clearTimeout(timeout);
      }
    }, wait);
  };
};
