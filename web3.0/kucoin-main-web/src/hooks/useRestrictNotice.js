/**
 * Owner: larvide.peng@kupotech.com
 */
import { useSelector } from 'src/hooks/useSelector';

/**
 * 合规顶飘展示
 * @returns {isShowRestrictNotice: boolean, restrictNoticeHeight: number}
 */
export const useRestrictNotice = () => {
  const isShowRestrictNotice = useSelector((s) => s['$header_header']?.isShowRestrictNotice);
  const restrictNoticeHeight = useSelector((s) => s['$header_header']?.restrictNoticeHeight);
  return {
    /** 是否展示合规顶飘 */
    isShowRestrictNotice,
    /** 合规顶飘高度 */
    restrictNoticeHeight,
  };
};
