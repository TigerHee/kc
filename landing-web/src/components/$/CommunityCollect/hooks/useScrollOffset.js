/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { useMediaQuery } from '@kux/mui/hooks';
import { getNoticeHeightValue } from 'components/$/CommunityCollect/tools/calculateTop';

export function useScrollOffset(props) {
  const { enableRestrictNotice = false, restrictNoticeHeight = 0, isInApp } = props ?? {};
  const down1439 = useMediaQuery((theme) => theme.breakpoints.down('1439px'));
  const downSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const headerDtx = getNoticeHeightValue(enableRestrictNotice, restrictNoticeHeight, 0);

  // 基础的距离，主要是 1 个边距 40px(顶部 sticky 后会向上多 8px) 和标题高度 50px
  let baseOffset = -(40 + 50) - headerDtx;

  if (down1439) {
    return baseOffset - 64; // 64 -> header 变化的高度
  }

  if (downSm) {
    return isInApp ? - 39 : -44 - 39 - headerDtx;
  }

  return baseOffset - 80;
}
