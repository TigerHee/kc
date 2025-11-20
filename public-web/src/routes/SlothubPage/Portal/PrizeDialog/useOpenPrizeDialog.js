/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-12 14:55:06
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-23 17:48:19
 */
import { useMemoizedFn } from 'ahooks';
import { useDispatch } from 'react-redux';

export const useOpenPrizeDialog = () => {
  const dispatch = useDispatch();
  const open = useMemoizedFn((prizeType, data) => {
    if (!data) return;

    dispatch({
      type: 'slothub/updatePrizeDialogConfig',
      payload: {
        visible: true,
        prizeType,
        data,
      },
    });
  });

  return { open };
};
