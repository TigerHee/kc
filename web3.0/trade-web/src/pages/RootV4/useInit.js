/**
 * Owner: garuda@kupotech.com
 * models 注册的 setUp 有优先级问题，删除部分 setUp ，挪到这个里面来
 */
import { useEffect } from 'react';
import { isBoolean, merge } from 'lodash';
import { useResponsive } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
// import { CmsComponents } from 'config';
import storage from 'utils/storage';
import voice from '@/utils/voice';
import {
  SOUND_STORAGE_KEY,
  DEFAULT_SOUND_SETTING,
} from '@/pages/InfoBar/SettingsToolbar/TradeSetting/SoundReminder/config';

const useInit = () => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    dispatch({ type: 'user/pullUser', payload: { firstCall: true } });

    // dispatch({
    //   type: 'components/fetch',
    //   payload: {
    //     componentsToload: CmsComponents._,
    //   },
    // });

    // models 的 setUp 放到这里来
    dispatch({ type: 'symbols/pullSymbols' });
    // 杠杆交易对信息，用来判断当前交易对是否支持杠杆交易
    dispatch({ type: 'symbols/pullMarginSymbols' });
    dispatch({ type: 'symbols/pullUnitDictionary' }); // 拉取1U quote币种金额字典

    dispatch({ type: 'categories/pull' });
    // FIXME: 原有逻辑，该接口有可能会请求两次, 登陆之后会请求一次用户存储的 currency 值
    dispatch({ type: 'currency/pullPrices', payload: {} });

    dispatch({ type: 'currency/pullRates' });
    // FIXME: @mike 后续看能否对该接口请求进行优化
    // dispatch({
    //   type: 'futuregrid/getFuturesSymbols',
    // });

    dispatch({
      type: 'socket/wsConnectedPull@polling',
    });

    return () => {
      dispatch({
        type: 'socket/wsConnectedPull@polling:cancel',
      });
    };
  }, [dispatch]);

  // 声音模块初始化
  useEffect(() => {
    if (isBoolean(isLogin)) {
      let soundReminderSettings = null;
      if (sm) {
        soundReminderSettings = merge(
          { ...DEFAULT_SOUND_SETTING },
          storage.getItem(SOUND_STORAGE_KEY),
        );
        voice.init({ isLogin, ...soundReminderSettings });
      } else {
        voice.destroy();
      }
      // 初始化soundReminderSettings
      dispatch({
        type: 'setting/update',
        payload: {
          soundReminderSettings,
        },
      });
    }
  }, [sm, isLogin]);
};

export default useInit;
