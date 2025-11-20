/**
 * Owner: iron@kupotech.com
 */
import { PREFIX } from '../common/constants';

export const namespace = `${PREFIX}_pwatip`;

export default {
  namespace,
  state: {
    showPwaTip: true,
  },
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
