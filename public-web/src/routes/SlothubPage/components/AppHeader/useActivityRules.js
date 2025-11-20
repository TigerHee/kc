/*
 * @owner: larvide.peng@kupotech.com
 */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SENSORS } from 'routes/SlothubPage/constant';

export default function useActivityShare() {
  const dispatch = useDispatch();

  const openRulesModal = useCallback(() => {
    dispatch({
      type: 'slothub/updateRulesModalConfig',
      payload: {
        open: true,
      },
    });
    SENSORS.rules();
  }, [dispatch]);

  return {
    onClick: openRulesModal,
  };
}
