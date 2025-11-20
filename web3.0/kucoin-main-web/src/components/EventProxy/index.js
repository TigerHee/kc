/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';

export default (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    document.body.addEventListener(
      'click',
      (e) => {
        if (e && e.target && e.target.getAttribute('data-key') === 'login') {
          dispatch({
            type: 'app/update',
            payload: {
              loginOpen: true,
            },
          });
        }
      },
      false,
    );
  }, [dispatch]);
  return <React.Fragment>{props.children}</React.Fragment>;
};
