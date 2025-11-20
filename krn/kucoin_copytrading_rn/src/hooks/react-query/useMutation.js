import {useDispatch} from 'react-redux';
import {useMutation as innerUseMutation} from '@tanstack/react-query';

import showError from 'utils/showError';

export const useMutation = options => {
  const dispatch = useDispatch();
  const {onError, ...other} = options || {};

  return innerUseMutation({
    onError: error => {
      const errorHandler = () => {
        showError({...error, ...(error?.responseJson || null)}, dispatch);
      };
      if (typeof onError === 'function') {
        onError(error, errorHandler);
      } else {
        errorHandler();
      }
    },
    ...other,
  });
};
