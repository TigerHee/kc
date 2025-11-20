import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {KRNEventEmitter} from '@krn/bridge';

export const useRefreshAvailableBalance = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const subscriptionOnShow = KRNEventEmitter.addListener('onShow', () => {
      dispatch({type: 'assets/pullAccountCoins'});
    });

    return () => {
      subscriptionOnShow && subscriptionOnShow.remove();
    };
  }, [dispatch]);
};
