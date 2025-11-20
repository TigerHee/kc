/*
 * @owner: borden@kupotech.com
 */
import React, { memo, useCallback } from 'react';
import useShowMarginMask from '@/hooks/useShowMarginMask';
import { useDispatch } from 'dva';

/**
 * 开通杠杆协议 hoc
 */
const withMarginAuth = (Component) =>
  memo(({ onClick, ...restProps }) => {
    const MarginMask = useShowMarginMask();
    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
      if (MarginMask) {
        dispatch({
          type: 'marginMeta/update',
          payload: {
            openMarginVisible: true,
          },
        });
        return;
      }

      if (onClick) {
        onClick();
      }
    }, [MarginMask, onClick]);

    return <Component onClick={handleClick} {...restProps} />;
  });

export default withMarginAuth;
