/*
 * @owner: borden@kupotech.com
 * @desc: 注入新模块逻辑
 */
import { useEffect } from 'react';
import { forEach, isUndefined } from 'lodash';
import { useSelector } from 'dva';
import { Actions } from '@kc/flexlayout-react';
import { NEW_MODULES } from '@/layouts/moduleConfig';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useTradeMode } from '@/hooks/common/useTradeMode';
import {
  addModuleToLayout,
  getSelectedNodeInfo,
  findPriorityTabsetId,
} from '../utils';
import { CREATED_MODULE_STATUS } from '../constants';
import { setCreatedModuleIds, getCreatedModuleIds, genCreatedModuleIdsKey } from '../storage';

export default function useCreateNewModule(model) {
  const tradeType = useTradeType();
  const tradeMode = useTradeMode();
  const user = useSelector(state => state.user.user);
  const currentLayout = useSelector(state => state.setting.currentLayout);

  useEffect(() => {
    if (!model || !currentLayout || isUndefined(user)) return;
    const updateCreatedModuleIds = {};
    const key = genCreatedModuleIdsKey({ user, currentLayout });
    const createdModuleIds = getCreatedModuleIds(key);
    forEach(NEW_MODULES, ({ config, id: targetId }) => {
      const {
        priorityPosition,
        checkCreateCondition,
        selectExcludeModule,
        checkSelectCondition,
      } = config;
      // 是否可以新增
      const canCreate =
        typeof checkCreateCondition !== 'function' ||
        checkCreateCondition({ tradeType });
      // 是否可以高亮
      const canSelect =
        typeof checkSelectCondition !== 'function' ||
        checkSelectCondition({ tradeType, tradeMode, currentLayout });

      let tabsetId;
      const targetNode = model?.getNodeById(targetId);
      // 走默认布局模版进来的，初始化时模块已经加上了
      if (!createdModuleIds?.[targetId] && targetNode) {
        updateCreatedModuleIds[targetId] = CREATED_MODULE_STATUS.created;
      }
      if (!createdModuleIds?.[targetId] && canCreate && !targetNode) {
        tabsetId = findPriorityTabsetId({ model, priorityPosition });
        const { isImportantNode } = getSelectedNodeInfo({
          model,
          tabsetId,
          selectExcludeModule,
        });
        const isSelect = !isImportantNode && canSelect;
        addModuleToLayout({
          model,
          tabsetId,
          id: targetId,
          select: isSelect,
        });
        updateCreatedModuleIds[targetId] = isSelect
          ? CREATED_MODULE_STATUS.selected
          : CREATED_MODULE_STATUS.created;
      } else if (
        canSelect &&
        createdModuleIds?.[targetId] !== CREATED_MODULE_STATUS.selected
      ) {
        tabsetId = targetNode?.getParent()?.getId();
        const { id: selectChildId, isImportantNode } = getSelectedNodeInfo({
          model,
          tabsetId,
          selectExcludeModule,
        });
        if (!isImportantNode && selectChildId) {
          if (selectChildId !== targetId) {
            model.doAction(Actions.selectTab(targetId));
          }
          updateCreatedModuleIds[targetId] = CREATED_MODULE_STATUS.selected;
        }
      }
    });
    setCreatedModuleIds(key, updateCreatedModuleIds);
  }, [tradeType, tradeMode, currentLayout, user, Boolean(model)]);
}
