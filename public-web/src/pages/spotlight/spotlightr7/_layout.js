/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-11-21 21:19:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-21 22:35:07
 * @FilePath: /public-web/src/pages/spotlight/spotlightr7/_layout.js
 * @Description:
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import { get } from 'lodash-es';
import { useEffect, useMemo, useRef } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
const { SnackbarProvider } = Snackbar;

export default (props) => {
  const dispatch = useDispatch();
  const { isRTL } = useLocale();
  const isInApp = JsBridge.isApp();
  const timerRef = useRef();

  const match = useRouteMatch('/spotlight7/:id?');
  const { id } = match.params;

  const matchRecord = useRouteMatch('/spotlight7/purchase-record/:recordId?');
  const { recordId } = matchRecord ? matchRecord.params : { recordId: null };

  const realId = recordId ? recordId : id;

  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const activityCode = get(pageData, 'activity[0].code');

  const activityId = useMemo(() => {
    return realId ?? null; 
  }, [realId]);

  useEffect(() => {
    if (activityId) {
      dispatch({ type: 'spotlight7/filter', payload: { id: activityId } });
    }
  }, [dispatch, activityId]);

  useEffect(() => {
    if (activityCode) {
      dispatch({ type: 'spotlight7/getDetailInfo', payload: { id: activityCode } });
    }
  }, [dispatch, activityCode]);

  // 如果在app内，从app登录返回时，应再次触发init
  useEffect(() => {
    if (isInApp) {
      window.onListenEvent('onLogin', () => {
        dispatch({
          type: 'app/initApp',
        });
      });
    }
  }, [dispatch, isInApp]);

  useEffect(() => {
    if (isInApp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isInApp]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme="dark">
        <SnackbarProvider>
          <Global
            styles={`
            body *{
              font-family: 'Roboto';
            }
            body fieldset {
              min-width: initial;
              padding: initial;
              margin: initial;
              border: initial;
              margin-inline-start: 2px;
              margin-inline-end: 2px;
              padding-block-start: 0.35em;
              padding-inline-start: 0.75em;
              padding-inline-end: 0.75em;
              padding-block-end: 0.625em;
            }
            body legend {
              width: initial;
              padding: initial;
              padding-inline-start: 2px;
              padding-inline-end: 2px;
            }
          `}
          />
          {props.children}
        </SnackbarProvider>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};
