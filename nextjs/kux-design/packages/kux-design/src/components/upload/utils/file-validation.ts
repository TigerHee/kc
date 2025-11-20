/**
 * Check if file type is accepted
 */
export function isFileTypeAccepted(file: File, accept: string): boolean {
  if (!accept) return true;

  const acceptedTypes = accept.split(',')
    .map(type => type.trim())
    .filter(type => type.length > 0);

  return acceptedTypes.some(type => {
    // 处理通配符 */*
    if (type === '*/*') return true;

    // 处理扩展名 (如 .jpg)
    if (type.startsWith('.')) {
      const ext = type.toLowerCase();
      const fileName = file.name.toLowerCase();
      // 更严格的扩展名检查，防止evil.exe.jpg这种情况
      return fileName === ext || fileName.endsWith(ext);
    }

    // 处理MIME类型 (如 image/* 或 image/jpeg)
    if (type.includes('/')) {
      const [mainType, subType] = type.toLowerCase().split('/');
      const fileType = file.type.toLowerCase();
      
      if (subType === '*') {
        // 处理通配符如 image/*
        return fileType.startsWith(mainType + '/');
      } else {
        // 处理完整MIME类型如 image/jpeg
        return fileType === type.toLowerCase();
      }
    }

    // 处理通用类型 (如 image)
    return file.type.toLowerCase().startsWith(type.toLowerCase() + '/');
  });
}

/**
 * 验证文件大小
 */
export const isFileSizeValid = (file: File, maxSize?: number): boolean => {
  if (!maxSize) return true;
  return file.size <= maxSize;
}; 

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 