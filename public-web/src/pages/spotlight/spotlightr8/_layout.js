/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-11-21 21:19:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-11-21 22:35:07
 * @FilePath: /public-web/src/pages/spotlight/spotlightr8/_layout.js
 * @Description:
 */
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Global, Snackbar, ThemeProvider } from '@kux/mui';
import { get } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
import useAppInit from 'TradeActivity/hooks/useAppInit';
const { SnackbarProvider } = Snackbar;

export default (props) => {
  useAppInit();
  const dispatch = useDispatch();
  const { isRTL } = useLocale();

  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const match = useRouteMatch('/spotlight_r8/:id?');
  const { id } = match.params;

  const matchRecord = useRouteMatch('/spotlight_r8/purchase-record/:recordId?');
  const { recordId } = matchRecord ? matchRecord.params : { recordId: null };

  const realId = recordId ? recordId : id;

  const pageData = useSelector((state) => state.spotlight8.pageData, shallowEqual);

  const activityCode = get(pageData, 'activity[0].code');
  // 目前id均为数字，可据此验证传参是否合法，后续如果改动这里判断需调整
  const activityId = useMemo(() => {
    if (realId) {
      const _id = `${realId}`.split('_')[0];
      return +_id > 0 ? _id : null;
    }
    return null;
  }, [realId]);

  useEffect(() => {
    if (activityId) {
      dispatch({ type: 'spotlight8/filter', payload: { id: activityId } });
    }
  }, [dispatch, activityId]);

  useEffect(() => {
    if (activityCode) {
      dispatch({ type: 'spotlight8/getDetailInfo', payload: { id: activityCode } });
    }
  }, [dispatch, activityCode]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme={currentTheme}>
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
