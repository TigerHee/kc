import { useCallback } from 'react';
import { IUploadProps, ICustomRequestOptions } from '../types';

export const useUploadCore = (options: IUploadProps) => {
  // 图片模式处理逻辑
  const handleImageMode = useCallback(async (files: FileList) => {
    const file = files[0]; // 图片模式只处理第一个文件

    if (!file) {
      return;
    }

    // 执行 beforeUpload
    if (options.beforeUpload) {
      const shouldUpload = await options.beforeUpload?.(file);
      if (!shouldUpload) return;
    }

    // 触发 onStart
    options.onStart?.(file);
    (options as any).onLoadingStart?.();
    
    // 执行 customRequest
    if (options.customRequest) {
      const fileItem = {
        uid: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        originalFile: file,
      };
      const customRequestOptions: ICustomRequestOptions = {
        file: fileItem,
        files: [fileItem],
        onError: (error) => {
          options.onError?.(error, file);
          (options as any).onLoadingEnd?.();
        },
        onSuccess: (data: any) => {
          options.onSuccess?.(data);
          (options as any).onLoadingEnd?.();
        }
      };
      options.customRequest(customRequestOptions);
      return;
    }
    options.onError?.(new Error('custom request is required'));
  }, [options]);

  const handleFileMode = useCallback(async (files: FileList) => {
    if (!files.length) {
      options.onError?.(new Error('no files'));
      return;
    }

    if (options.beforeUpload) {
      const shouldUpload = await options.beforeUpload?.(files);
      if (!shouldUpload) return;
    }

    options.onStart?.(files);
    (options as any).onLoadingStart?.();

    const validFiles = Array.from(files).map(file => ({
      uid: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      originalFile: file,
    }));
    
    // 执行 customRequest
    if (options.customRequest) {
      const customRequestOptions: ICustomRequestOptions = {
        file: validFiles[0]!,
        files: validFiles,
        onError: (error, data?: any) => {
          options.onError?.(error, data);
        },
        onSuccess: (data: any) => {
          options.onSuccess?.(data);
        }
      };
      options.customRequest(customRequestOptions);
      return;
    }
    options.onError?.(new Error('custom request is required'));
  }, [options]);

  // 统一的文件选择处理
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (options.disabled) return;
    const isImageMode = options.uploadMode === 'image';
    
    if (isImageMode) {
      return handleImageMode(files);
    } else {
      return handleFileMode(files);
    }
  }, [handleImageMode, handleFileMode, options.disabled, options.uploadMode]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (options.disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [options.disabled, handleFileSelect]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  
  return {
    handleFileSelect,
    handleDrop,
    handleDragOver,
    isDisabled: options.disabled,
    accept: options.accept,
    multiple: options.multiple,
    error: options.error,
  };
}; 