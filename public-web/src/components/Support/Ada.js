/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { ADA_URL, loadAdaScript, removeAda, setAdaMetaFields } from 'utils/ada';
import './style.less';

const Ada = ({ userInfo }) => {
  const [isAdaReady, setIsAdaReady] = useState(false);
  const { isLogin } = useSelector((state) => state.user);
  // 页面载入加载ada, app暂时不加ada
  useEffect(() => {
    if (!isAdaReady) {
      loadAda();
    }
    return () => {
      if (isAdaReady) {
        unloadAda();
      }
    };
  }, [loadAda, unloadAda, isAdaReady]);
  // 卸载ada
  const unloadAda = useCallback(async () => {
    await removeAda();
    setIsAdaReady(false);
  }, []);
  // 加载ada
  const loadAda = useCallback(async () => {
    try {
      await loadAdaScript(ADA_URL);
      setIsAdaReady(true);
    } catch (e) {
      // eslint-disable-next-line
      console.error('Load ada failed!');
    }
  }, []);

  // ada 传递用户元变量信息
  useEffect(() => {
    if (isAdaReady) {
      setAdaMetaFields(userInfo);
    }
  }, [isAdaReady, isLogin, userInfo]);

  return null;
};

Ada.propTypes = {
  userInfo: PropTypes.object,
};

export default Ada;
