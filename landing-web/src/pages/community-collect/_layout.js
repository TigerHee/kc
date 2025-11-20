/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useDispatch } from 'dva';

export default ({ children }) => {
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      function init() {
        return dispatch({
          type: 'community/queryCommunityGroupConfig',
        });
      }

      init();
    },
    [dispatch],
  );

  return <React.Fragment>{children}</React.Fragment>;
};
