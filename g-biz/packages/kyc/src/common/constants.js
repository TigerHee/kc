/**
 * Owner: iron@kupotech.com
 */
import siteConfig from '@packages/kyc/src/common/siteConfig';
import ID_Card from '../../static/images/idCard.svg';
import Passport from '../../static/images/pass_port.svg';
import Driverlicense from '../../static/images/driverLicense.svg';
import GoodIcon from '../../static/images/kyc2/guide/good.svg';
import CroppedIcon from '../../static/images/kyc2/guide/cropped.svg';
import BlurIcon from '../../static/images/kyc2/guide/blur.svg';
import ReflectiveIcon from '../../static/images/kyc2/guide/reflective.svg';
import RightIcon from '../../static/images/kyc2/guide/right_icon.svg';
import ErrorIcon from '../../static/images/kyc2/guide/error_icon.svg';
import PhotoIcon from '../../static/images/kyc2/guide/photo.svg';
import NoteIcon from '../../static/images/kyc2/guide/note.svg';
import VideoIcon from '../../static/images/kyc2/guide/video.svg';

const { KUCOIN_HOST } = siteConfig;

export const PREFIX = '$kyc'; // 前缀

export const SOURCE = 'web'; // 应用来源

export const IDPhotoExampleList = [
  { img: GoodIcon, icon: RightIcon, text: '5cRQxsDdbEt7ZxZrUYWjah', id: 'good' },
  { img: CroppedIcon, icon: ErrorIcon, text: '1zGCWczvpJtDniuXgy1QGN', id: 'cropped' },
  { img: BlurIcon, icon: ErrorIcon, text: 'hNiML3z1kaHE5MgUcoy9KN', id: 'blur' },
  { img: ReflectiveIcon, icon: ErrorIcon, text: 'fQ89NvYyk4ujZtTyNrNVTf', id: 'reflective' },
];

export const getRequirementList = (realName, code, date) => {
  return [
    {
      title: 'x9RET5sBG2emmW3CoNkSHh',
      type: 'photo',
      content: [{ text: 'u8RX5X8HRr9PimE9tqTM1a' }, { text: 'pqBi4eUx25mbyAmXJGBcmP' }],
    },
    {
      title: '7mqU4yfaVduP5cMSCf4Yd1',
      type: 'note',
      subTitle: 'aU95sjdfnXjr6UoLUPfag9',
      content: [
        { text: 'oFBXkzCjsni7htvax3zTxr', value: realName },
        { text: 'iKNne4ENgP9JGWrSwR3qpG', value: code },
        { text: 'dRu1v2xtMa71zfcVr6JBha', value: date },
      ],
    },
  ];
};
export const HandleldPthotoExampleList = [
  { title: '45LZrDkAHjjgMWRvxUDtfd', img: PhotoIcon, type: 'photo' },
  { title: 'u9heRLeRtFzHPn7K4tDHqw', img: NoteIcon, type: 'note' },
  { title: 'nTSJLHv5q5moe3Trcp7oDm', img: VideoIcon, type: 'video' },
];

// kyc2证件标题
export const TitleMap = {
  'idcard': 'onAacUeLB7xJUtCwkuCRny',
  'drivinglicense': 'iw44SNvTxJu4qxAwP1RLhg',
  'passport': '8Wgfii7UpXXMsphT2BzFbK',
};
// kyc2 formItem label
export const LabelMap = {
  'idcard': '5LaB9ccEwHCYPWskW8BP2E',
  'drivinglicense': '5LaB9ccEwHCYPWskW8BP2E',
  'passport': 'c75jDbYTTcvf32CMGc5UPW',
};
export const IDENTITY_TYPE = [
  { type: 'passport', name: '6rmVnq9QKmvPdJEYHUUTiv', src: ID_Card, selected: false },
  { type: 'idcard', name: 'reeTmJrZNwsMD1J7d8FSnw', src: Passport, selected: false },
  { type: 'drivinglicense', name: 'aPzQHFr4utVLLPfiPVyxkR', src: Driverlicense, selected: false },
];

// 进度条
export const StepsListMap = {
  normal: [
    { title: '6jRRR6sAzWZT5ceQxwoGQY' }, // 個人信息
    { title: 'fNR4hYqSMxeyxQpyNwRuEV' }, // 證件認證
    { title: '52cpZNpqXFboyTrGC43iAJ' }, // 人臉識別
  ],
};
export const KYC_TYPE = {
  PERSONAL: 0, // 个人
  MECHANISM: 1, // 机构
};

// 证件照分类
export const PHOTO_TYPE = {
  POSITIVE: 0, // 正面
  BACK: 1, // 背面
  PHOTO_WITH_ID: 2, // 手持证件照片,
  CERTIFICATE_OF_INCORPORATION: 3, // 公司注册证书
  PHOTO_OF_CERTIFICATE: 4, // 手持证书照
  BOARD_OF_DIRECTORS: 5, // 董事名单
  PROOF_OF_EMPLOYMENT: 6, // 在职证明
};

// 认证方式 0 上传证件照人工审核 1 活体认证
export const VERIFY_TYPE = {
  PERSONAL_VERIFY: 0,
  LIVE_VERIFY: 1,
};

export const KYC2_STATUS = {
  NOT_VERIFIED: -1, // 未认证
};

// 不需要切分姓和名的国家
export const DOT_NEED_DIVIDE_COUNTRIES = ['CN', 'TW', 'HK'];

// 需要固定填写身份证的国家
export const NEED_IDCARD = ['CN'];

// 用户声明相关信息
export const USER_KYC_IDENTITY_INFO = {
  CN_USER_AUTH: `${KUCOIN_HOST}/announcement/kyc-user-identity-authentication-statement`,
  EN_USER_AUTH: `${KUCOIN_HOST}/announcement/en-kyc-user-identity-authentication-statement`,
  CN_USER_CERTIFICATE: `${KUCOIN_HOST}/announcement/kyc-user-identity-statement`,
  EN_USER_CERTIFICATE: `${KUCOIN_HOST}/announcement/en-kyc-user-identity-statement`,
};

// 交易量(BTC/24H)
export const TRADE_OPTIONS = [
  { code: 't001', value: '<5' },
  { code: 't002', value: '5-10' },
  { code: 't003', value: '10-20' },
  { code: 't004', value: '20-30' },
  { code: 't005', value: '30-50' },
  { code: 't006', value: '50-100' },
  { code: 't007', value: '>100' },
];

// kyc 错误code记录
export const ERROR_CODE = [
  '710000',
  '710001',
  '710002',
  '710003',
  '710004',
  '710005',
  '710006',
  '710007',
  '710008',
  '710012', // 身份证所属国家不支持
];

// 审核不通过原因
export const FAIL_REASON = {
  patternError: {
    zh_CN: '格式不正确',
    zh_HK: '格式不正確',
    en_US: 'Incorrect format',
    key: 'incorrect.format.warn',
  },
  notSameError: {
    zh_CN: '与证件不符',
    zh_HK: '與證件不符',
    en_US: 'Does not match with the identity document',
    key: 'credentials.error.warn',
  },
  numberError: {
    zh_CN: '查无此号码',
    zh_HK: '查無此號碼',
    en_US: 'Non-existent phone number',
    key: 'check.noNumber.warn',
  },
  addressError: {
    zh_CN: '查无此地址',
    zh_HK: '查無此地址',
    en_US: 'Non-existent address',
    key: 'check.noAddress.warn',
  },
  companyError: {
    zh_CN: '查无此公司',
    zh_HK: '查無此公司',
    en_US: 'Non-existent company name',
    key: 'check.noCompany.warn',
  },
  certificateError: {
    zh_CN: '证件已过期',
    zh_HK: '證件已過期',
    en_US: 'Identity document expired ',
    key: 'credential.expire.warn',
  },
  imageError: {
    zh_CN: '图片不清晰/反光/被遮挡/不完整',
    zh_HK: '圖片不清晰/反光/被遮擋/不完整',
    en_US: 'Picture is not clear/covered/incomplete',
    key: 'picture.dim.warn',
  },
  cardTypeError: {
    zh_CN: '证件类型不正确',
    zh_HK: '證件類型不正確',
    en_US: 'Wrong credential type',
    key: 'identity.type.warn',
  },
  cardImageError: {
    zh_CN: '证件图片不符合要求',
    zh_HK: '證件圖片不符合要求',
    en_US: 'Wrong photograph uploaded',
    key: 'identity.type.error',
  },
  InfoInadequateError: {
    zh_CN: '信息不完善',
    zh_HK: '信息不完善',
    en_US: 'Inadequate information',
    key: 'info.notPerfect.warn',
  },
  cardPhotoWrongError: {
    zh_CN: '人脸与证件照不一致',
    zh_HK: '人臉與證件照不一致',
    en_US: 'The face does not match with that on the identity document',
    key: 'face.different.warn',
  },
  identityError: {
    zh_CN: '实名认证不通过',
    zh_HK: '實名認證不通過',
    en_US: 'Real-name authentication failed',
    key: 'no.pass',
  },
  faceError: {
    zh_CN: '人脸认证不通过',
    zh_HK: '人臉認證不通過',
    en_US: 'Face authentication failed',
    key: 'no.pass',
  },
  /* 新增的审核不通过原因 */
  abbreviationlastNamerror: {
    zh_CN: '您输入的姓是缩写，与证件不符，请写全称',
    zh_HK: '您輸入的姓是縮寫，與證件不符，請寫全稱',
    en_US: 'Does not support abbreviations, please enter your full last name',
    key: 'identity.lastName.error',
  },
  symbolNameError: {
    zh_CN: '不能带有任何符号',
    zh_HK: '不能帶有任何符號',
    en_US: 'Please do not enter any symbol',
    key: 'identity.name.symbolError',
  },
  noSurnameError: {
    zh_CN: '没有姓就不用填写此项',
    zh_HK: '沒有姓就不用填寫此項',
    en_US: 'Not required if there is no last name ',
    key: 'identity.name.noSurname',
  },
  abbreviationfirstNamerror: {
    zh_CN: '您输入的名是缩写，与证件不符，请写全称',
    zh_HK: '您輸入的名是縮寫，與證件不符，請寫全稱',
    en_US: 'Do not support abbreviations, please enter your full first name ',
    key: 'identity.firstName.abbrevError',
  },
  notmatchCountryError: {
    zh_CN: '您选择的国家与证件上的国家不符合',
    zh_HK: '您選擇的國家與證件上的國家不符合',
    en_US: 'Selected country does not match with your identity document',
    key: 'identity.country.nomatch',
  },
  CertTypeError: {
    zh_CN: '您选择的证件类型与上传的证件照不符合',
    zh_HK: '您選擇的證件類型與上傳的證件照不符合',
    en_US: 'Selected identity document type does not match with your identity document',
    key: 'identity.type.notmatch',
  },
  CertificateNumberNotCompleteError: {
    zh_CN: '您输入的证件号不完整',
    zh_HK: '您輸入的證件號不完整',
    en_US: 'Identity document number incomplete',
    key: 'identity.idnumber.notcomplete',
  },
  CertificateNumberNotMatchError: {
    zh_CN: '您输入的证件号码与上传的证件不一致',
    zh_HK: '您輸入的證件號碼與上傳的證件不一致',
    en_US: 'Identity document number does not match with your identity document',
    key: 'identity.idnumber.notmatch',
  },
  passportWholePageError: {
    zh_CN: '护照未展示需要的上下两页',
    zh_HK: '護照未展示需要的上下兩頁',
    en_US: 'Please open the passport and take pictures on the cover page and the information page',
    key: 'identity.display.incomplete',
  },
  ResidentPermitError: {
    zh_CN: '您提供的是居住许可，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是居住許可，不符合要求，請您提供身份證，駕照或者護照',
    en_US:
      'Resident Permit is not supported, please upload your ID Card, Driving License or Passport ',
    key: 'identity.type.ResidentPermitError',
  },
  ElectionCardPermitError: {
    zh_CN: '您提供的是选举卡，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是選舉卡，不符合要求，請您提供身份證，駕照或者護照',
    en_US:
      'Election Card is not supported, please upload your ID Card, Driving License or Passport ',
    key: 'identity.type.ElectionCardError',
  },
  TaxCardPermitError: {
    zh_CN: '您提供的是税卡，不符合要求，请您提供身份证，驾照或者护照',
    zh_HK: '您提供的是稅卡，不符合要求，請您提供身份證，駕照或者護照',
    en_US: 'Tax Card is not supported, please upload your ID Card, Driving License or Passport ',
    key: 'identity.type.TaxCardError',
  },
  PermitedCardsError: {
    zh_CN: '只有驾驶执照，护照，证件身份证才符合要求',
    zh_HK: '只有駕駛執照，護照，證件身份證才符合要求',
    en_US: 'Only supports ID Card, Driving License or Passport',
    key: 'identity.type.matchWitch',
  },
  CertificateUnrecognizedError: {
    zh_CN: '证件无法识别信息（证件磨损严重）',
    zh_HK: '證件無法識別信息（證件磨損嚴重）',
    en_US: 'Cannot recognize the information on the identity document',
    key: 'identity.info.unrecognized',
  },
  reUploadPicError: {
    zh_CN: '图片无法加载',
    zh_HK: '圖片無法加載',
    en_US: 'Fail to load the picture, please upload again ',
    key: 'identity.info.cantOpen',
  },
  ageError: {
    zh_CN: '未成年不符合要求',
    zh_HK: '未成年不符合要求',
    en_US: 'Age below 18',
    key: 'identity.age.error',
  },
  NoMsgInPagerError: {
    zh_CN: '纸条上没写日期/签名/code',
    zh_HK: '紙條上沒寫日期/簽名/code',
    en_US: `There's no date/hand-written signature/dynamic code on the note`,
    key: 'identity.info.noHandWritting',
  },
  printedSignError: {
    zh_CN: '签名是打印的请手写',
    zh_HK: '簽名是打印的請手寫',
    en_US: 'The signature is printed, please write the signature by yourself',
    key: 'identity.type.noPrinted',
  },
  OcclusionError: {
    zh_CN: '手持遮挡人脸',
    zh_HK: '手持遮擋人臉',
    en_US: 'Identity document covered your face',
    key: 'identity.info.occlusionError',
  },
  printVersinError: {
    zh_CN: '手持证件不是原件',
    zh_HK: '手持證件不是原件',
    en_US: 'Identity document should be the original one',
    key: 'identity.type.noOriginal',
  },
  fabricationCertError: {
    zh_CN: '疑似伪造证件',
    zh_HK: '疑似偽造證件',
    en_US: 'Suspected fabrication of the identity document',
    key: 'identity.type.FakeError',
  },
  photoshoppedCertError: {
    zh_CN: '疑似P图',
    zh_HK: '疑似P圖',
    en_US: 'Suspected to be photoshopped',
    key: 'identity.type.photoshoppedError',
  },
  otherError: { zh_CN: '其他', zh_HK: '其他', en_US: 'Other Error', key: 'identity.other' },
  // 新增code：minica-在kucoin-main-web添加的code在人工的部分找不到失效导致页面崩溃
  directorError: { zh_CN: '查无此人', en_US: 'user unknown', zh_HK: '查無此人' },
  requireError: {
    zh_CN: '很抱歉，根据我们的机构KYC 要求，您的机构KYC 未能通过',
    zh_HK: '很抱歉，根据我们的机构KYC 要求，您的机构KYC 未能通过',
    en_US: 'Your institutional KYC cannot be approved as per our institutional KYC requirements',
    key: '',
  },
  notSameCompanyError: {
    zh_CN: '公司名不正确，请填入与注册证书上一致的公司名',
    zh_HK: '公司名不正确，请填入与注册证书上一致的公司名',
    en_US: 'The company name is incorrect, please enter name which matches with the certificate',
    key: '',
  },
  companyCodeError: {
    zh_CN: '公司编码不正确，请填入与注册证书上一致的公司编码',
    zh_HK: '公司编码不正确，请填入与注册证书上一致的公司编码',
    en_US:
      'The registration number is incorrect, please enter number which matches with the certificate',
    key: '',
  },
  companyDateError: {
    zh_CN: '公司注册日期不正确，请填入与注册证书上一致的注册日期',
    zh_HK: '公司注册日期不正确，请填入与注册证书上一致的注册日期',
    en_US:
      'The registration date is incorrect, please enter date which matches with the certificate',
    key: '',
  },
  companyCertificateError: {
    zh_CN: '请上传一张手持公司注册证书的照片，确保人脸和证书清晰可见',
    zh_HK: '请上传一张手持公司注册证书的照片，确保人脸和证书清晰可见',
    en_US: 'Please upload a selfie of you holding the company registration certificate',
    key: '',
  },
  companyLinkError: {
    zh_CN: '请上传验证公司注册的政府网站链接',
    zh_HK: '请上传验证公司注册的政府网站链接',
    en_US: 'Please upload the Government verify link',
    key: '',
  },
  requireApplicantInfoError: {
    zh_CN: '请填入申请人姓名，职位并上传在职证书',
    zh_HK: '请填入申请人姓名，职位并上传在职证书',
    en_US:
      "Please enter the applicant's name, working position and upload a working position certificate",
    key: '',
  },
  identityExpirationError: {
    zh_CN: '证件上无有效期信息，请提供显示有效期信息的证件（可接受身份证，驾照和护照）',
    zh_HK: '证件上无有效期信息，请提供显示有效期信息的证件（可接受身份证，驾照和护照）',
    en_US:
      'No expiration date on the document, please upload one which shows expiration date (ID, Driver license and Passport are accepted)',
    key: '',
  },
  identityCopyError: {
    zh_CN: '请提供证件原件，不接受打印件、复印件',
    zh_HK: '请提供证件原件，不接受打印件、复印件',
    en_US:
      'Please provide the original copy of the identity document, printed version is not accepted ',
    key: '',
  },
  documentSignError: {
    zh_CN: '请在文件上附上手写的签名',
    zh_HK: '请在文件上附上手写的签名',
    en_US: 'Please sign by hand on the document ',
    key: '',
  },
  documentBlurryError: {
    zh_CN: '证件照模糊，请重新上传',
    zh_HK: '证件照模糊，请重新上传',
    en_US: 'Document is blurry, please upload a clear one',
    key: '',
  },
  authorizeAttachmentRequiredError: {
    zh_CN: '若公司有董事会，请提交董事会决议文件；若公司是独董，请提交授权书文件',
    zh_HK: '若公司有董事会，请提交董事会决议文件；若公司是独董，请提交授权书文件',
    en_US:
      'If the company is equipped with a board of directors, the Corporate Board Resolution is required; Otherwise, Power of Attorney is required',
    key: '',
  },
  shareholdersRequiredError: {
    zh_CN: '请上传公司的股东名单/股份结构',
    zh_HK: '请上传公司的股东名单/股份结构',
    en_US: 'Please upload an official list of the Register of Shareholders',
    key: '',
  },
  shareholdersHoldIdentityError: {
    zh_CN: '公司中持股大于等于25%的股东，烦请提供有效证件',
    zh_HK: '公司中持股大于等于25%的股东，烦请提供有效证件',
    en_US:
      'For shareholders who hold more than 25% shares, please provide valid identity documents',
    key: '',
  },
  shareholdersCompanyError: {
    zh_CN:
      '若股东是公司，请提供该公司的注册证书和股东名单/股份结构；该公司中持股大于等于25%的最终受益人，烦请提供有效证件',
    zh_HK:
      '若股东是公司，请提供该公司的注册证书和股东名单/股份结构；该公司中持股大于等于25%的最终受益人，烦请提供有效证件',
    en_US:
      'For institution shareholder, its registration certificate and share structure are required. Valid identity documents of the applicant’s ultimate beneficiary owners (>25%) are also required. ',
    key: '',
  },
  directorsRequiredError: {
    zh_CN: '请上传公司的董事名单',
    zh_HK: '请上传公司的董事名单',
    en_US: 'Please upload an official list of the List of directors',
    key: '',
  },
};

// 错误返回字段对应FORM字段
export const ERROR_FIELD_MAP = {
  lastName: 'lastName',
  firstName: 'firstName',
  nationality: 'regionCode',
  idType: 'identityType',
  idNumber: 'identityNumber',
  idExpireDate: 'idExpireDateM',
  frontPhoto: 'frontPhoto',
  backendPhoto: 'backendPhoto',
  handlePhoto: 'handlePhoto',
};

// FORM字段对应错误返回字段
export const FIELD_ERROR_MAP = {
  lastName: 'lastName',
  firstName: 'firstName',
  regionCode: 'nationality',
  identityType: 'idType',
  identityNumber: 'idNumber',
  idExpireDateM: 'idExpireDate',
  frontPhoto: 'frontPhoto',
  backendPhoto: 'backendPhoto',
  handlePhoto: 'handlePhoto',
};

// 上传文件大小限制 3M
export const UPLOAD_FILE_SIZE = 3 * 1024 * 1024;

// NORMAL支持文件类型
export const NORMAL_FILE_TYPES = ['image/jpeg', 'image/png'];

// MULTIPLE支持文件类型
export const MULTIPLE_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/vnd.ms-excel', // xls
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/pdf', // pdf
];

// 文件大小错误提示
export const UPLOAD_SIZE_ERROR = {
  zh_CN: '请根据提示，上传正确的文件大小',
  en_US: 'Please follow the prompts to upload the correct file size',
};

// 文件类型错误提示
export const UPLOAD_TYPE_ERROR = {
  zh_CN: '请根据提示，上传正确的文件类型',
  en_US: 'Please follow the prompts to upload the correct file type',
};
