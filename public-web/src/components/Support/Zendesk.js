/**
 * Owner: lori@kupotech.com
 */
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import searchToJson from 'utils/searchToJson';

const zendeskAnswerBot = (key) =>
  `https://assets.staticimg.com/natasha/npmzendesk/2.0.0/ekr/snippet.min.js?key=${key}`;

const zendeskAnswerBotId = 'ze-snippet';

const LoadZendek = ({ showZendesk }) => {
  let timer = null;
  const dispatch = useDispatch();
  const query = searchToJson();
  const { isLogin } = useSelector((state) => state.user);

  // 页面载入加载
  useEffect(() => {
    if (showZendesk) {
      loadZendesk();
      window.zE && window.zE('messenger:set', 'zIndex', 999);
      window.zE && window.zE('messenger', 'open');
    } else {
      unloadZendek();
    }
    return () => {
      clearTimeout(timer);
      unloadZendek();
      window.zE && window.zE('messenger:set', 'zIndex', -999);
    };
  }, [window.zE, loadZendesk, unloadZendek, showZendesk, timer]);

  useEffect(() => {
    timer = setTimeout(() => {
      if (isLogin) {
        dispatch({ type: 'support/getJwtToken' }).then((token) => {
          window.zE &&
            window.zE('messenger', 'loginUser', function (callback) {
              callback(token);
            });
          window.zE && window.zE('messenger', 'open');
        });
      }
    }, 0);
  }, [window.zE, isLogin]);

  // 加载
  const loadZendesk = useCallback(async () => {
    // 普通服务和应急方案服务使用的品牌服务key: c449650a-d00c-46ec-9afc-89391fb55c63
    // 客户经理VIP的key: 0860389b-bd6a-4ae8-9e69-3feca79c283e
    const key =
      query?.type === 'userbox'
        ? '0860389b-bd6a-4ae8-9e69-3feca79c283e'
        : 'c449650a-d00c-46ec-9afc-89391fb55c63';
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = zendeskAnswerBot(key);
      script.id = zendeskAnswerBotId;
      document.body.appendChild(script);
      script.onload = resolve;
      script.onerror = reject;
    });
  }, [query]);

  // 卸载
  const unloadZendek = useCallback(async () => {
    await new Promise(() => {
      const adaScript = document.getElementById(zendeskAnswerBotId);
      adaScript && document.body.removeChild(adaScript);
    });
  }, [window.zE]);

  return null;
};

export default LoadZendek;
