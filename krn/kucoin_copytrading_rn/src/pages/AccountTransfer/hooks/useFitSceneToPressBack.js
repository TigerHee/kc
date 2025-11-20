import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import useGoBack from 'hooks/useGoBack';
import {useParams} from 'hooks/useParams';
import {gotoMainCopyHome} from 'utils/native-router-helper';
import {TRANSFER_ROUTER_SCENE_TYPE} from '../constant';

export const useFitSceneToPressBack = () => {
  const {scene} = useParams();
  const goBack = useGoBack();
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.app.isLogin);

  useEffect(() => {
    if (!isLogin) return;
    dispatch({type: 'leadInfo/pullUserLeadInfo'});
  }, [isLogin, dispatch]);

  const onPressBack = useCallback(() => {
    if (
      scene === TRANSFER_ROUTER_SCENE_TYPE.applySuccess2TransferBackCopyHome
    ) {
      gotoMainCopyHome();
      return;
    }

    goBack();
  }, [goBack, scene]);

  return onPressBack;
};
