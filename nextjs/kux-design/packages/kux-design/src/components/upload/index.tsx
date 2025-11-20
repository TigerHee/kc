/**
 * Owner: victor.ren@kupotech.com
 *
 * @description Upload component
 */

import React, { useRef, useMemo, useState } from 'react';
import { IUploadProps, IImageUploadProps } from './types';
import { useUploadCore } from './hooks/use-upload-core';
import { clx } from '@/common/style';
import { Loading } from '@/components/loading';
import DefaultText from './components/default-text';
import './style.scss';

const ACCEPT_MAP = {
  image: 'image/jpeg,image/png,image/gif,image/webp',
  file: '.pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.txt,.xls,.xlsx',
};

const Upload: React.FC<IUploadProps> = (props) => {
  const {
    uploadMode = 'image',
    title = 'Drag or Click to Upload',
    description = 'Only PDF, JPG, PNG types are accepted. The maximum file size is 100 MB',
    style,
    className,
    disabled,
    accept,
    multiple,
    error,
    onStart,
    onError,
    onSuccess,
    beforeUpload,
    customRequest,
    onDelete,
    children,
    fullWidth = false,
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImageMode = uploadMode === 'image';
  
  const uploadCore = useUploadCore({
    uploadMode,
    disabled,
    accept: accept || ACCEPT_MAP[uploadMode],
    multiple: isImageMode ? false : multiple,
    error,
    onStart,
    onError,
    onSuccess,
    beforeUpload,
    customRequest,
    onDelete,
    onLoadingStart: isImageMode ? () => {
      setIsLoading(true);
      (props as IImageUploadProps).onLoadingStart?.();
    } : undefined,
    onLoadingEnd: isImageMode ? () => {
      setIsLoading(false);
      (props as IImageUploadProps).onLoadingEnd?.();
    } : undefined
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const uploadClassName = useMemo(() => {
    return clx('kux-upload', className, {
      'kux-upload_disabled': disabled,
      'kux-upload_error': error,
      'kux-upload_full-width': fullWidth,
      [`kux-upload_${uploadMode}`]: true
    });
  }, [className, disabled, error, uploadMode, fullWidth]);
  
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div 
      className={uploadClassName}
      style={style}
      onDrop={uploadCore.handleDrop}
      onDragOver={uploadCore.handleDragOver}
      onClick={handleClick}
      data-upload-mode={uploadMode}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={uploadCore.accept}
        multiple={uploadCore.multiple}
        disabled={uploadCore.isDisabled}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            uploadCore.handleFileSelect(files);
          }
          // 避免下一次不能选择相同文件
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />
      {/* 默认文本提示等 */}
      <DefaultText title={title} description={description} error={error} />
      {/* 图片模式下，显示子元素 */}
      {isImageMode && children}
      
      {/* Loading 覆盖层 */}
      {isLoading && (
        <Loading 
          type="normal"
          size="small"
          className="kux-upload-loading-overlay"
          style={{
            color: 'var(--kux-brandGreen)'
          }}
        />
      )}
    </div>
  );
};

export default Upload;
export { FileList } from './components/file-list';
export { ImageOverlay } from './components/image-overlay';
export type { 
  IUploadProps, 
  IUploadFile, 
  UploadMode, 
  IFileListProps, 
  IImageOverlayProps,
  IFileItemProps,
  IItemStatus
} from './types';
export { isImageFile, formatFileSize } from './utils/file-utils';
