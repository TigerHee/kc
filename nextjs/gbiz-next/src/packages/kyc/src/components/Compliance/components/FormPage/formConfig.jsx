/**
 * Owner: tiger@kupotech.com
 * 表单页面配置
 */
// eslint-disable-next-line no-restricted-imports
import moment from 'moment';
import loadable from '@loadable/component';
import { Input } from '@kux/mui';
import {
  COUNTRY_CODE,
  PHONE_CODE,
  ID_TYPE_CODE,
  ID_TYPE_2_CODE,
  EXPIRY_DATE_CODE,
  TRANS_VOLUME_CODE,
  KYB_TYPE_CODE,
  LASER_ID_CODE,
  INVESTOR_TYPE_CODE,
  INVESTOR_TYPE1_CODE,
  COMPONENT_CODE_66,
  COMPONENT_CODE_119,
  COMPONENT_CODE_120,
  COMPONENT_CODE_121,
  COMPONENT_CODE_135,
} from 'kycCompliance/config';
import { StatementEl } from './style';

const CountrySelect = loadable(() => import('./CountrySelect'));
const Phone = loadable(() => import('./Phone'));
const IDTypeSelect = loadable(() => import('./IDTypeSelect'));
const UploadFile = loadable(() => import('./UploadFile'));
const ExpiryDateSelect = loadable(() => import('./ExpiryDateSelect'));
const CheckboxItem = loadable(() => import('./CheckboxItem'));
const CommonSelect = loadable(() => import('./CommonSelect'));
const KycDatePicker = loadable(() => import('./KycDatePicker'));
const LaserID = loadable(() => import('./LaserID'));
const SelectOrInput = loadable(() => import('./SelectOrInput'));
const Radio = loadable(() => import('./Radio'));
const Alert = loadable(() => import('./Alert'));
const AreaTip = loadable(() => import('./AreaTip'));
const PercentInput = loadable(() => import('./PercentInput'));
const Barcode = loadable(() => import('./Barcode'));

// CommonSelect code 对应的接口 - 如果code和接口url里的code对应不上需要配置
export const selectFetchUrlConfig = {
  [TRANS_VOLUME_CODE]: '/compliance/component/component_53/init',
  [KYB_TYPE_CODE]: '/compliance/component/component_54/init',
  [INVESTOR_TYPE_CODE]: '/compliance/component/component_92/init',
  [INVESTOR_TYPE1_CODE]: '/compliance/component/component_94/init',
  [COMPONENT_CODE_66]: '/compliance/component/component_41/init',
  [COMPONENT_CODE_119]: '/compliance/component/enum/list',
  [COMPONENT_CODE_120]: '/compliance/component/enum/list',
  [COMPONENT_CODE_121]: '/compliance/component/enum/list',
  [COMPONENT_CODE_135]: '/compliance/component/enum/list',
};

/**
 * 需要渲染公共下拉框的 componentCode
 * 这些需要等后端有时间优化
 * 新的下拉使用 componentType === 6
 */
const CommonSelectCodeList = [
  TRANS_VOLUME_CODE,
  KYB_TYPE_CODE,
  INVESTOR_TYPE_CODE,
  INVESTOR_TYPE1_CODE,
  COMPONENT_CODE_119,
  COMPONENT_CODE_120,
  COMPONENT_CODE_121,
  COMPONENT_CODE_135,
  'component_26',
  'component_27',
  'component_28',
  'component_29',
  'component_30',
  'component_91',
  'component_100',
  'component_101',
  'component_102',
  'component_103',
  'component_105',
  'component_108',
  'component_112',
  'component_114',
  'component_117',
  'component_118',
];

// 需要渲染 Input和Select之间切换的 componentCode
const SelectOrInputCodeList = ['component_41', 'component_40', 'component_39', COMPONENT_CODE_66];

// code对应的表单组件
export const FormItemRenderComponentMap = {
  [COUNTRY_CODE]: CountrySelect,
  [PHONE_CODE]: Phone,
  [ID_TYPE_CODE]: IDTypeSelect,
  [ID_TYPE_2_CODE]: IDTypeSelect,
  [EXPIRY_DATE_CODE]: ExpiryDateSelect,
  [LASER_ID_CODE]: LaserID,
  1: Input,
  2: UploadFile,
  3: StatementEl,
  4: KycDatePicker,
  5: CheckboxItem,
  6: CommonSelect,
  7: Radio,
  8: Alert,
  9: AreaTip,
  10: CountrySelect,
  11: PercentInput,
  12: IDTypeSelect,
  13: Barcode,
};
// 渲染 CommonSelect
CommonSelectCodeList.forEach((code) => {
  FormItemRenderComponentMap[code] = CommonSelect;
});
// 渲染 SelectOrInput
SelectOrInputCodeList.forEach((code) => {
  FormItemRenderComponentMap[code] = SelectOrInput;
});

// FormItem 基础props
export const baseFormComponentProps = {
  size: 'xlarge',
  // labelProps: { 'shrink': true },
  fullWidth: true,
};

// FormItem 一行渲染多少个
export const colsNumConfig = {
  componentGroupTemplate_1: 1,
  componentGroupTemplate_0: 2,
  componentGroupTemplate_2: 3,
};

// 获取 utc+8 时间戳
export const getUtc8Time = (val) => {
  const date = moment(val).format('YYYY-MM-DD');
  const isoString = `${date}T00:00:00+08:00`;
  return new Date(isoString).getTime();
};

export const getMetaCodeKey = (i) => {
  if (i.metaCode) {
    return i.metaCode;
  }
  return `${i.pageId}_${i.groupId}_${i.componentId}`;
};
