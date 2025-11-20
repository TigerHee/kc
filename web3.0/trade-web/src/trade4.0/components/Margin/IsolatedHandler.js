/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-05-07 15:32:09
 * @Description: 逐仓仓位数据处理
 */
import { memo, useEffect, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { throttle } from 'lodash';
// 定时检测推送的时长(单位：ms)
const INTERVAL_TIME = 30 * 1000;

export default connect((state) => {
  const { changePosition } = state.isolated;
  return {
    changePosition,
  };
})(
  memo((props) => {
    const {
      dispatch,
      changePosition,
    } = props;
    const timestamp = useRef(0);

    const throttleUpdatePosition = useMemo(() => throttle((payload) => {
      dispatch({
        type: 'isolated/updatePosition',
        payload,
      });
    }, 3000, { leading: true }), []);

    useEffect(() => {
      const timer = setInterval(() => {
        if (timestamp.current) {
          if (Date.now() - timestamp.current > INTERVAL_TIME) {
            dispatch({
              type: 'isolated/updatePosition',
            });
          }
        } else {
          timestamp.current = Date.now();
        }
      }, INTERVAL_TIME);
      return () => {
        clearInterval(timer);
        dispatch({
          type: 'isolated/pullIsolatedAppoint@polling:cancel',
        });
        // 重置activeSymbol, 以在其他交易类型重新切到逐仓的时候，重刷数据
        dispatch({
          type: 'isolated/update',
          payload: {
            activeSymbol: '',
          },
        });
      };
    }, []);

    useEffect(() => {
      if (changePosition) {
        throttleUpdatePosition(changePosition);
        timestamp.current = changePosition.timestamp;
      }
    }, [changePosition]);

    return null;
  }),
);
