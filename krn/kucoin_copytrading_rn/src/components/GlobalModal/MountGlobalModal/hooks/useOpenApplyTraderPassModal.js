import {useMemoizedFn} from 'ahooks';
import {useDispatch} from 'react-redux';

export const useOpenApplyTraderPassModal = () => {
  const dispatch = useDispatch();

  const open = useMemoizedFn(() =>
    dispatch({type: 'globalModal/toggleTraderApprovalModal', payload: true}),
  );

  return open;
};
