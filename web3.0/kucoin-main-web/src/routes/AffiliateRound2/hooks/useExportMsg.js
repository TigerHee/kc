/**
 * Owner: alen.su@kupotech.com
 */
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import useModals from './useModals';
import { MODAL_MAP } from '../utils';

const useExportMsg = () => {
  const dispatch = useDispatch();
  const { showModal } = useModals();
  const { exportMsgData } = useSelector((state) => state.v2Affiliate);
  const msgTimer = useRef(null);

  const initGetMsgStatus = () => {
    setInterval(msgTimer.current);
    dispatch({
      type: 'v2Affiliate/exportMsg',
    });
    msgTimer.current = setInterval(() => {
      dispatch({
        type: 'v2Affiliate/exportMsg',
      });
    }, 30000);
  };

  return {
    initGetMsgStatus,
    exportMsgData,
    msgTimer,
  };
};

export default useExportMsg;
