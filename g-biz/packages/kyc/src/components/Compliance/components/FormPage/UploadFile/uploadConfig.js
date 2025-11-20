/**
 * Owner: tiger@kupotech.com
 * 文件上传配置
 */
export const STATUS_PENDING = 'pending';
export const STATUS_ERROR = 'error';
export const STATUS_SUCCESS = 'success';
// 最多上传5个
export const UPLOAD_MAX_LENGTH = 5;

// 上传文件大小限制 5M
export const UPLOAD_FILE_SIZE = 5;

// 支持的文件类型 map
export const SupportTypeMap = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pdf: 'application/pdf',
};

// 支持的文件类型
export const SupportTypeList = Object.values(SupportTypeMap);

// 文件类型转简称
export const TypeToShortMap = Object.fromEntries(
  Object.entries(SupportTypeMap).map(([key, value]) => [value, key.toUpperCase()]),
);

export const getImgBase64 = (img) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', reject);
    reader.readAsDataURL(img);
  });
};

// 从 url 里解析文件名
export const getFileName = (url) => {
  const { pathname } = new URL(url);
  const filename = pathname.split('/').pop();
  return decodeURIComponent(filename);
};

// 从文件名判断是否图片
export const getIsImgFromName = (name = '') => {
  return name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg');
};
