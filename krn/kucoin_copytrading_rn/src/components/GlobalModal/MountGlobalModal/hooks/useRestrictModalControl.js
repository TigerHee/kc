import {useMemoizedFn} from 'ahooks';
import {useDispatch, useSelector} from 'react-redux';

import {RestrictByBusCodeType} from 'components/GlobalModal/RestrictModal/constant';

export const useRestrictModalControl = () => {
  const {visible, restrictType} =
    useSelector(state => state.globalModal.restrictModal) || {};
  const dispatch = useDispatch();

  const closeModal = useMemoizedFn(() =>
    dispatch({
      type: 'globalModal/update',
      payload: {
        restrictModal: {
          visible: false,
          restrictType: '',
        },
      },
    }),
  );

  const openModalByRestrictBusCode = useMemoizedFn(restrictBusCode => {
    if (!RestrictByBusCodeType[restrictBusCode]) {
      return;
    }
    dispatch({
      type: 'globalModal/update',
      payload: {
        restrictModal: {
          visible: true,
          restrictType: RestrictByBusCodeType[restrictBusCode],
        },
      },
    });
  });

  return {
    visible,
    restrictType,
    closeModal,
    openModalByRestrictBusCode,
  };
};
