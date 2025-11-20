/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { SnackbarContext } from 'context/index';

const useSnackbar = () => {
  return React.useContext(SnackbarContext);
};

export default useSnackbar;
