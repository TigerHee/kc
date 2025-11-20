/**
 * Owner: melono@kupotech.com
 */
import { useDispatch } from 'dva';

import { createDom2Base64 } from './utils';

const useShare = () => {
  const dispatch = useDispatch();
  /**
   * 获取生成后的dom文案base64图片 id是dom结构的class id
   * @param {*} id
   * @returns
   */
  const getSharePictures = async (id = 'KuShare_diy_text_wrapper') => {
    const KuShareDiyTextWrapper = document.getElementById(id);
    let target = [];
    if (KuShareDiyTextWrapper) {
      const { imgs = [] } = await createDom2Base64(id);
      target = imgs;
    }
    return target;
  };
  /**
   * 设置自定义文案生成的base64图片 并且 打开分享弹窗
   * @param {*} shareRef 弹窗ref
   * @param {*} id dom结构的class id
   */
  const goShare = async (shareRef, id = 'KuShare_diy_text_wrapper') => {
    // 生成自定义图片图片
    const sharePictures = await getSharePictures(id);
    dispatch({
      type: 'kcCommon/update',
      payload: {
        newSharePictures: sharePictures,
      },
    });
    if (shareRef?.current) {
      shareRef.current.goShare();
    }
  };
  return {
    goShare,
    getSharePictures,
  };
};

export default useShare;
