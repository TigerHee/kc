/**
 * Owner: vijay.zhou@kupotech.com
 */
import { PADDING_LG, PADDING_XL, PADDING_XS } from '../constants/paddingSize';

export default (theme) => {
  return `
    margin-left: ${PADDING_XL}px;
    margin-right: ${PADDING_XL}px;
    ${theme.breakpoints.down('lg')} {
      margin-left: ${PADDING_LG}px;
      margin-right: ${PADDING_LG}px;
    }
    ${theme.breakpoints.down('sm')} {
      margin-left: ${PADDING_XS}px;
      margin-right: ${PADDING_XS}px;
    }
  `;
};
