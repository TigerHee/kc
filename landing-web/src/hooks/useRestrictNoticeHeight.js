/*
 * @owner: borden@kupotech.com
 */
import { useSelector } from './useSelector';

export default function useRestrictNoticeHeight() {
  // 获取当前顶飘是否展示的状态
  const enable = useSelector((s) => s['$header_header']?.isShowRestrictNotice);
  // 获取顶飘高度（做布局偏移可能需要）
  const height = useSelector((s) => s['$header_header']?.restrictNoticeHeight);

  return enable ? height || 0 : 0;
}
