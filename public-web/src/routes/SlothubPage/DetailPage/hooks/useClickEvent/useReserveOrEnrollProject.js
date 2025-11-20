/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-21 12:37:35
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-23 17:39:50
 */
import { useSnackbar } from '@kux/mui/hooks';
import { useLockFn, useMemoizedFn } from 'ahooks';
import useRequest from 'src/hooks/useRequest';
import { useStore } from 'src/routes/SlothubPage/DetailPage/store';
import useReserveCallback from 'src/routes/SlothubPage/hooks/useReserveCallback';
import { enrollCurrencyProject, reserveCurrencyProject } from 'src/services/slothub';
import { _t } from 'src/tools/i18n';

export const useReserveOrEnrollProject = () => {
  const { state } = useStore();
  const { projectDetail, refreshProjectDetail } = state;
  const { id } = projectDetail || {};

  const { message } = useSnackbar();

  const refreshDetail = useMemoizedFn(() => {
    refreshProjectDetail();
  });

  const reserveCallback = useReserveCallback();

  const { runAsync: enrollCurrencyProjectFetch, loading: enrollCurrencyProjectLoading } =
    useRequest(async () => await enrollCurrencyProject({ projectId: id }), {
      manual: true,
      onSuccess: () => {
        message.success(_t('32f12027c63e4000ae9c'));
        refreshDetail();
      },
    });

  const { runAsync: reserveCurrencyProjectFetch, loading: reserveCurrencyProjectLoading } =
    useRequest(() => reserveCurrencyProject({ projectId: id }), {
      manual: true,
      onSuccess: () => {
        reserveCallback();
        refreshDetail();
      },
    });

  // 预约,报名操作加竞态锁
  const enroll = useLockFn(enrollCurrencyProjectFetch);
  const reserve = useLockFn(reserveCurrencyProjectFetch);

  return {
    enroll,
    reserve,
    loadings: {
      enrollCurrencyProjectLoading,
      reserveCurrencyProjectLoading,
    },
  };
};
