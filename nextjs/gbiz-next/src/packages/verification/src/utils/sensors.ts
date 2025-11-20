import { kcsensorsManualTrack } from 'tools/sensors';

const CUSTOM_EVENT = 'verify_check_result';

/** 埋点：组件初始化（渲染表单或弹窗） */
export const initialized = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'init', bizType, transactionId },
    },
    CUSTOM_EVENT,
  );
};

/** 埋点：直接通过，不需要验证 */
export const noVerify = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'get_verify', bizType, transactionId, result: 1 },
    },
    CUSTOM_EVENT,
  );
};

/** 埋点：抛出异常，组件渲染失败 */
export const throwException = ({ bizType, transactionId, code, message }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'get_verify', bizType, transactionId, result: code, message },
    },
    CUSTOM_EVENT,
  );
};

/** 埋点：提交 */
export const submitted = ({ bizType, transactionId, methods }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'submit_verify', bizType, transactionId, verify_method: methods.toString() },
    },
    CUSTOM_EVENT,
  );
};

/** 埋点：验证成功 */
export const passed = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'closed', bizType, transactionId, result: 0 },
    },
    CUSTOM_EVENT,
  );
};

/** 埋点：取消验证 */
export const canceled = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      checkID: false,
      data: { stage: 'closed', bizType, transactionId, result: -1 },
    },
    CUSTOM_EVENT,
  );
};

const SPM_PAGE_ID = 'B0VerifyUnits';
const SPM_BLOCK_IDS = {
  FaceIDVerify: 'FaceIDVerify',
  FingerIDVerify: 'FingerIDVerify',
  EmailLinkVerify: 'EmailLinkVerify',
  TextVerify: 'TextVerify',
  Exit: 'Exit',
  ChangeMethod: 'ChangeMethod',
  VerifyNotAvailable: 'VerifyNotAvailable',
};
/** 埋点：弹窗曝光 */
export const exposeModal = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.TextVerify],
      data: { bizType, transactionId },
    },
    'expose',
  );
};

/** 埋点：发送邮箱验证码 */
export const sendEmailCode = ({ bizType, transactionId, result }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.TextVerify, '1'],
      data: { bizType, transactionId, SendResult: result ? 1 : 0 },
    },
    'page_click',
  );
};


/** 埋点：发送手机验证码 */
export const sendPhoneCode = ({ bizType, transactionId, result }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.TextVerify, '2'],
      data: { bizType, transactionId, SendResult: result ? 1 : 0 },
    },
    'page_click',
  );
};

/** 埋点：粘贴google验证码 */
export const pasteG2fa = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.TextVerify, '3'],
      data: { bizType, transactionId },
    },
    'page_click',
  );
};

/** 埋点：关闭弹窗 */
export const closeModal = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.Exit, '1'],
      data: { bizType, transactionId },
    },
    'page_click',
  );
};

/** 埋点：点击切换验证方式 */
export const clickChangeMethod = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.ChangeMethod, '1'],
      data: { bizType, transactionId },
    },
    'page_click',
  );
};

/** 埋点：点击验证方式不可用 */
export const clickVerifyNotAvailable = ({ bizType, transactionId }) => {
  kcsensorsManualTrack(
    {
      spm: [SPM_PAGE_ID, SPM_BLOCK_IDS.VerifyNotAvailable, '1'],
      data: { bizType, transactionId },
    },
    'page_click',
  );
};
