/**
 * Owner: Ray.Lee@kupotech.com
 */

import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const useCompliantRule = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.app.isLogin);

  // 需要请求两次，登录和未登录拿到的数据可能不一样
  useEffect(() => {
    if (typeof isLogin === 'boolean') {
      dispatch({
        type: 'app/getCompliantRulers',
      });
    }
  }, [isLogin]);
};

export default useCompliantRule;
