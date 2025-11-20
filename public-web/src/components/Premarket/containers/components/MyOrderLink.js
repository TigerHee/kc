/**
 * Owner: june.lee@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICHistoryOutlined } from '@kux/icons';
import { _t } from 'src/tools/i18n';
import { useResponsiveSize } from '../../hooks';
import { StyledMyOrderLink } from '../../styledComponents';
import { useSkip2Myorder } from '../../util';

export function MyOrderLink({ variant, size }) {
  const isInApp = JsBridge.isApp();
  const rvSize = useResponsiveSize();
  const isH5 = rvSize === 'sm';
  const handleSkip2Myorder = useSkip2Myorder();
  // 如果是在app内部，则直接用app header中的我的订单入口。
  if (isInApp) {
    return null;
  }
  return (
    <StyledMyOrderLink
      variant={variant}
      startIcon={<ICHistoryOutlined size={isH5 ? 20 : 16} />}
      size={size || 'mini'}
      onClick={handleSkip2Myorder}
    >
      {/* <img src={myOrderEntry} alt="" /> */}
      <span>{_t('hkh1Ezk6muufQVCTAaiiRH')}</span>
    </StyledMyOrderLink>
  );
}
