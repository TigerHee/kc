/**
 * Owner: iron@kupotech.com
 */
import { useSelector, useDispatch } from 'react-redux';
import filter from 'lodash/filter';
import { namespace } from '../model';

export default (action, errorNow) => {
  const { errors } = useSelector((state) => state[namespace]);
  const dispatch = useDispatch();
  return () => {
    if (errorNow) {
      const updatedErrors = filter(errors, (o) => {
        return o.validationType !== action.toLowerCase();
      });
      dispatch({
        type: `${namespace}/update`,
        payload: {
          errors: updatedErrors,
        },
      });
    }
  };
};
