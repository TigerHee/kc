/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

interface ImgPreviewProps {
  // 图片地址
  url: string;

  // 显示预览
  show: boolean;

  // 关闭事件
  onClose: React.MouseEventHandler<HTMLInputElement>;
}

declare const ImgPreview: React.FC<ImgPreviewProps>;

export default ImgPreview;