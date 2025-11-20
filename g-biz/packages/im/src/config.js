/**
 * Owner: iron@kupotech.com
 */
// 上传文件大小限制 4M
export const UPLOAD_FILE_SIZE = 4 * 1024 * 1024;

// 每隔3分钟插入一条时间信息
export const TIME_DISTANCE = 3 * 60 * 1000; // 3分钟 ms

// NORMAL支持文件类型
export const NORMAL_FILE_TYPES = ['image/jpeg', 'image/png'];

export const SCROLL_DISTANCE = 200; // 如果往上滚动超过这个距离，新消息来时则不会自动滚动到底部

export const NAME_SPACE = '$im';

export const ERROR_CONFIG = {
  880103: '用户不存在',
  880104: '用户名或密码错误',
};

export const ERROR_ENUM = {
  SUCCESS: 0, // 成功
  USER_NOT_EXIST: 880103, // 用户不存在
  ALREADY_LOGIN: 880107, // 已经登录
};

export const TMP_PASSWORD = 123456;

export const APP_KEY = {
  DEV: '23886870d8be83f49f43cccc',
  PROD: 'a27ff59aba259d5c61749eeb',
};

export const SEC_KEY = {
  DEV: '09c2d4406df22892aacd447f',
  PROD: '3f5e22524063c23dcc672793',
};
