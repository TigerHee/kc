/*
 * owner: Borden@kupotech.com
 */
import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { filter } from 'lodash';
import { useTheme } from '@emotion/react';
import { useSnackbar } from '@kux/mui/hooks';
import { _t } from 'src/utils/lang';
import { event } from '@/utils/event';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { DEFAULT_LAYOUTS_MAP, DEFAULT_LAYOUT } from '@/layouts/XlLayout/layout';

export default function useStateAndLogin() {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { currentTheme } = useTheme();
  const { open, isLogin } = useLoginDrawer();
  const layouts = useSelector(state => state.setting.layouts);
  const currentLayout = useSelector(state => state.setting.currentLayout);
  const inLayoutIdMap = useSelector(state => state.setting.inLayoutIdMap);
  const openLayoutSetting = useSelector(state => state.setting.openLayoutSetting);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalProps, setEditModalProps] = useState(null);
  const [confirmModalProps, setConfirmModalProps] = useState(null);

  const isDefaultLayout = !!DEFAULT_LAYOUTS_MAP[currentLayout];

  const customizedLayouts = useMemo(() => {
    return layouts ? filter(Object.values(layouts), v => v.isCustomize) : [];
  }, [layouts]);

  const onClose = useCallback(() => {
    dispatch({
      type: 'setting/update',
      payload: {
        openLayoutSetting: false,
      },
    });
  }, []);

  const createLayout = useCallback((values) => {
    event.emit('layout.create', {
      ...values,
      cb: closeAddModal,
    });
  }, [closeAddModal]);

  const deleteLayout = useCallback(() => {
    if (confirmModalProps?.code) {
      dispatch({
        type: 'setting/deleteLayout',
        payload: {
          code: confirmModalProps.code,
        },
      }).then((res) => {
        if (res.success) {
          // 从布局中移除
          dispatch({
            type: 'setting/updateLayouts',
            payload: {
              code: confirmModalProps.code,
            },
          });
          if (currentLayout === confirmModalProps.code) {
            // 切换布局为默认布局
            dispatch({
              type: 'setting/updateLayout',
              payload: {
                currentLayout: DEFAULT_LAYOUT,
              },
            });
          }
          closeConfirmModal();
          message.success(_t('operation.succeed'));
        }
      });
    }
  }, [confirmModalProps?.code, closeConfirmModal, currentLayout]);

  const updateLayout = useCallback((values) => {
    if (editModalProps?.code) {
      dispatch({
        type: 'setting/editLayout',
        payload: {
          code: editModalProps.code,
          ...values,
        },
      }).then((res) => {
        if (res?.success) {
          dispatch({
            type: 'setting/updateLayouts',
            payload: {
              ...values,
              code: editModalProps.code,
            },
          });
          closeEditModal();
          message.success(_t('operation.succeed'));
        }
      });
    }
  }, [editModalProps?.code, closeEditModal]);

  const switchLayout = useCallback((payload) => {
    dispatch({
      type: 'setting/updateLayout',
      payload,
    });
    const _code = payload.currentLayout;
    dispatch({
      type: 'setting/editLayout',
      payload: {
        code: _code,
        isActive: true,
        isCustomize: !DEFAULT_LAYOUTS_MAP[_code],
      },
    });
    onClose();
  }, [onClose]);

  const resetLayout = useCallback(() => {
    const { defaultLayout } = DEFAULT_LAYOUTS_MAP[currentLayout] || {};
    if (!defaultLayout) return;
    dispatch({
      type: 'setting/editLayout',
      payload: {
        code: currentLayout,
        layoutConfig: defaultLayout,
      },
    });
    onClose();
  }, [currentLayout, onClose]);

  const updateModule = useCallback((checked, id) => {
    event.emit('module.change', { checked, id });
  }, []);

  const openAddModal = useCallback(() => {
    if (!isLogin) {
      open();
      return;
    }
    setAddModalVisible(true);
  }, [isLogin, open]);

  const closeAddModal = useCallback(() => {
    setAddModalVisible(false);
  }, []);

  const openEditModal = useCallback((e, params) => {
    e.stopPropagation();
    setEditModalProps({
      open: true,
      ...params,
    });
  }, []);

  const closeEditModal = useCallback(() => {
    setEditModalProps(null);
  }, []);

  const openConfirmModal = useCallback((e, params) => {
    e.stopPropagation();
    setConfirmModalProps({
      open: true,
      ...params,
    });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModalProps(null);
  }, []);

  return {
    /** 抽屉 */
    onClose,
    currentTheme,
    openLayoutSetting,
    /** 布局相关 */
    currentLayout,
    createLayout,
    deleteLayout,
    updateLayout,
    resetLayout,
    switchLayout,
    updateModule,
    inLayoutIdMap,
    isDefaultLayout,
    customizedLayouts,
    /** 新增布局弹窗 */
    isLogin,
    openAddModal,
    closeAddModal,
    addModalVisible,
    /** 修改布局(重命名)弹窗 */
    editModalProps,
    openEditModal,
    closeEditModal,
    /** 删除确认弹窗 */
    confirmModalProps,
    openConfirmModal,
    closeConfirmModal,
  };
}
