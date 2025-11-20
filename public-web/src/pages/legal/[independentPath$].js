/**
 * Owner: mcqueen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import Detail from 'routes/AnnouncementPage/Detail';

export default () => {
  const match = useRouteMatch();
  const keys = match.url.split('/');
  const key = keys[keys.length - 1] || keys[keys.length - 2]; // 截取的 path 取最后一段，如果以 / 结尾取倒数第二段

  const { currentLang } = useLocale();

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch({
      type: 'announcement/pullDetail',
      payload: { key, currentLang },
    });
  }, [key, currentLang, dispatch]);

  // React.useEffect(() => {
  //   exposePageStateForSSG((dvaState, models) => {
  //     const pageState = dvaState.news;
  //     const initialState = models.filter((v) => v.namespace === 'news')[0] || {};
  //     return {
  //       news: {
  //         ...(initialState.state || {}),
  //         ...(pageState || {}),
  //       },
  //     };
  //   });
  // }, []);

  return <Detail key={key} />;
};
