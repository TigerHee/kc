/*
 * @owner: borden@kupotech.com
 */
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { LINKS, SENSORS } from '../constant';
import { jumpTo } from '../utils';

const withKyc = (Component, showGuideDialog = true) =>
  memo(({ onClick, onPreClick, ...restProps }) => {
    const dispatch = useDispatch();
    const userSummary = useSelector((state) => state.slothub.userSummary);

    const handleClick = useCallback(
      (...rest) => {
        // 部分逻辑需要在跳转之前去执行
        if (onPreClick) onPreClick(...rest);
        if (userSummary && userSummary.kycLevel !== 3) {
          if (showGuideDialog) {
            dispatch({
              type: 'slothub/update',
              payload: {
                kycGuideVisible: true,
              },
            });
          } else {
            SENSORS.kycAuth();
            jumpTo(LINKS.kyc());
          }
          return;
        }
        if (onClick) onClick(...rest);
      },
      [userSummary, onPreClick, onClick, dispatch],
    );

    return <Component onClick={handleClick} {...restProps} />;
  });

export default withKyc;
