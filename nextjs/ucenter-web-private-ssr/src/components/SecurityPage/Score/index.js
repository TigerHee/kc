import JsBridge from 'gbiz-next/bridge';
import { useTheme } from '@kux/mui';
import LottieProvider from 'components/LottieProvider';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'src/utils/router';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import ScoreLarge from './components/ScoreLarge';
import ScoreSmall from './components/ScoreSmall';
import { LoadingBox } from './components/styled';
import { LEVEL_ENUMS } from './constants';
import useConfig from './hooks/useConfig';
import useDetail from './hooks/useDetail';
import { getBrowserType, getChromeExtensions } from './utils';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const IS_IN_APP = JsBridge.isApp();
const IS_SSG = navigator.userAgent.indexOf('SSG_ENV') !== -1;

export default function SecurityScore() {
  // 在 app 里不需要 loading，用 app 的 loading
  // SSG 也不需要 loading
  const [loading, setLoading] = useState(!IS_SSG);
  const dispatch = useDispatch();
  const result = useSelector((state) => state.securityGuard?.result ?? {});
  const config = useConfig();
  const { score, level, title, desc, list } = useDetail({ config, data: result });
  const rv = useResponsiveSSR();
  const isH5 = IS_IN_APP || !rv?.sm;
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  const lottieName = useMemo(() => {
    return `security_score_${(level ?? LEVEL_ENUMS.LOW).toLowerCase()}`;
  }, [level]);

  const handleSetUp = (item) => {
    if (IS_IN_APP) {
      trackClick(['Suggestion', '1'], { url: item.appUrl });
      JsBridge.open({
        type: 'jump',
        params: {
          url: item.appUrl,
        },
      });
    } else {
      trackClick(['Suggestion'], { url: item.webUrl });
      push(item.webUrl);
    }
  };

  const handleBack = () => window.history.go(-1);

  const H5Style = { minHeight: IS_IN_APP ? '100vh' : '80vh' };
  const props = {
    score,
    level,
    title,
    desc,
    list,
    lottieName,
    onSetUp: handleSetUp,
    onBack: handleBack,
  };

  useEffect(() => {
    if (IS_IN_APP) {
      kcsensorsManualExpose(['window', '1']);
    } else {
      kcsensorsManualExpose(['window']);
    }
    const handleShow = async () => {
      try {
        const pluginList = getChromeExtensions();
        const pluginId = [];
        const scriptName = [];
        pluginList.forEach((pluginSrc) => {
          const id = pluginSrc.replace('chrome-extension://', '').match(/\w+/)?.[0];
          if (id) {
            pluginId.push(id);
            const path = pluginSrc.slice(pluginSrc.indexOf(id) + id.length).split('?')[0];
            scriptName.push(path);
          }
        });
        await dispatch({
          type: 'securityGuard/pullResult',
          payload: {
            browserType: getBrowserType(),
            pluginList,
            pluginId,
            scriptName,
          },
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    !IS_SSG && handleShow();
    if (IS_IN_APP) {
      JsBridge.listenNativeEvent.on('onShow', handleShow);
      return () => JsBridge.listenNativeEvent.off('onShow', handleShow);
    }
  }, []);

  useEffect(() => {
    if (IS_IN_APP && !loading) {
      /** 关闭 app loading 蒙层 */
      JsBridge.open({
        type: 'func',
        params: {
          name: 'onPageMount',
          dclTime: window.DCLTIME,
          pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
        },
      });
    }
  }, [loading]);

  if (loading && !IS_IN_APP) {
    return (
      <LoadingBox data-inspector="account_security_score_loading" isH5={isH5} style={H5Style}>
        <LottieProvider
          iconName={isDark ? 'security_score_loading_night' : 'security_score_loading_day'}
        />
      </LoadingBox>
    );
  }

  return isH5 ? (
    <ScoreSmall {...props} headerHidden={IS_IN_APP} style={H5Style} />
  ) : (
    <ScoreLarge {...props} />
  );
}
