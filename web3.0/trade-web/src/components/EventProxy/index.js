/**
 * Owner: borden@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'dva';
import { trackClick } from 'utils/ga';

// TODO 不再使用
export default (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.addEventListener('click', (e) => {
      if (e && e.target) {
        if (e.target.getAttribute('data-key') === 'login') {
          dispatch({
            type: 'app/update',
            payload: {
              open: true,
            },
          });
          trackClick(['login', '1']);
        } else if (e.target.getAttribute('data-key') === 'register') {
          trackClick(['register', '1']);
        }
      }
    }, false);
  }, []);
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
};
