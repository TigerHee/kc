/**
 * Owner: jesse.shao@kupotech.com
 */
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import { useCallback } from 'react';

const STATUS_LIST = [
  {
    value: 0,
    code: 'doing',
    // text: '新建',
  },
  {
    value: 1,
    // text: '正在生成',
    code: 'doing',
  },
  {
    value: 2,
    // text: '成功',
    code: 'success',
  },
  {
    value: 3,
    // text: '失败',
    code: 'failed',
  },
  {
    value: 4,
    code: 'failed',
    // text: '删除',
  },
];

const useExport = () => {
  const dispatch = useDispatch();
  const loadingMore = useSelector((state) => state.loading.effects['v2Affiliate/exportListLazy']);
  const { showExportDrawer, exportListObj, exportListAll, exportMsgData } = useSelector(
    (state) => state.v2Affiliate,
  );
  const hasMore = exportListObj?.totalNum > exportListAll.length;
  // 有请求，但没数据
  const showEmpty = exportListObj?.pageSize > 0 && exportListAll?.length === 0;

  const setShowDrawer = useCallback((id) => {
    dispatch({
      type: 'v2Affiliate/update',
      payload: {
        showExportDrawer: true,
        exportListAll: [],
      },
    });
  }, []);

  const closeDrawer = useCallback((id) => {
    dispatch({
      type: 'v2Affiliate/update',
      payload: {
        showExportDrawer: false,
        exportListAll: [],
        exportListObj: {},
      },
    });
    // 关闭侧边时，刷新消息状态,消除新消息状态
    dispatch({
      type: 'v2Affiliate/update',
      payload: {
        exportMsgData: {
          ...exportMsgData,
          hasNewMsg: false,
        },
      },
    });
  }, []);

  // 导出列表，init=true代表首次展现
  const exportListLazy = useCallback(async (init = false) => {
    let res = await dispatch({
      type: 'v2Affiliate/exportListLazy',
    });
    // 首次展现列表触发读消息和closeDrawer
    if (init) {
      if (res?.success) {
        // 读消息
        dispatch({
          type: 'v2Affiliate/exportMsgRead',
        });
      } else {
        closeDrawer();
      }
    }
  }, []);

  const _list = exportListAll;

  const getDescText = useCallback((status) => {
    if (status === 1 || status === 0) {
      return _t('8vY9PZqvAdg8YiQVB4vHiJ');
    }

    if (status === 2) {
      return _t('1N4RhNyFr7KmPXuB6FZpHq');
    }

    if (status === 3) {
      return _t('8BCeF8YUSNebngfpAk1KQK');
    }
    if (status === 4) {
      return _t('aaqS2fnFfRPCupakTWjFR9');
    }
  }, []);

  const getCode = useCallback((status) => {
    return STATUS_LIST.find((e) => e.value === status)?.code || '';
  }, []);

  return {
    showExportDrawer,
    showEmpty,
    closeDrawer,
    setShowDrawer,
    exportListObj,
    exportListAll,
    hasMore,
    loadingMore,
    exportListLazy,
    getCode,
    _list,
    getDescText,
    showEmpty,
  };
};

export default useExport;
