/**
 * Owner: garuda@kupotech.com
 * 该 hooks 传递 介绍弹框所需参数
 */
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export const useIntroduceProps = () => {
  const dispatch = useDispatch();
  const introduceVisible = useSelector((state) => state.futuresForm.introduceVisible);
  const introduceKey = useSelector((state) => state.futuresForm.introduceKey);

  const openIntroduce = useCallback(
    (key) => {
      const params = {
        introduceVisible: true,
      };
      // 是否需要设置 introduceKey
      if (key) {
        params.introduceKey = key;
      }
      dispatch({
        type: 'futuresForm/update',
        payload: params,
      });
    },
    [dispatch],
  );

  const closeIntroduce = useCallback(() => {
    dispatch({
      type: 'futuresForm/update',
      payload: {
        introduceVisible: false,
      },
    });
  }, [dispatch]);

  const changeIntroduceKey = useCallback(
    (key) => {
      dispatch({
        type: 'futuresForm/update',
        payload: {
          introduceKey: key,
        },
      });
    },
    [dispatch],
  );

  return {
    introduceVisible,
    introduceKey,
    openIntroduce,
    closeIntroduce,
    changeIntroduceKey,
  };
};
