/*
 * Owner: terry@kupotech.com
 */
import { dynamic } from 'umi';

export default dynamic({
  loader: async function () {
    const { ShareModal } = await System.import('@remote/share');
    return ShareModal;
  },
  loading: () => null,
});
