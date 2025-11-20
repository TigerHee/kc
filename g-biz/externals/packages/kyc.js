/**
 * Owner: iron@kupotech.com
 */
import '@packages/kyc/src/common/httpInterceptors';
import withI18nReady from '@hooks/withI18nReady';
import {
  PersonalInfoForm as OriPersonalInfoForm,
  DrawerPersonalInfo as OriDrawerPersonalInfo,
  KycLevel as OriKycLevel,
  Compliance as OriCompliance,
  ComplianceDialog as OriComplianceDialog,
  TaxInfoCollect as OriTaxInfoCollect,
  TaxInfoCollectDialog as OriTaxInfoCollectDialog,
  PanConfirmDialog as OriPanConfirmDialog,
} from '@packages/kyc/src/componentsBundle';

// 合约简约版在用
export const DrawerPersonalInfo = withI18nReady(OriDrawerPersonalInfo, 'kyc');
export const KycLevel = withI18nReady(OriKycLevel, 'kyc');

export const PersonalInfoForm = withI18nReady(OriPersonalInfoForm, 'kyc');
export const Compliance = withI18nReady(OriCompliance, 'kyc');
export const ComplianceDialog = withI18nReady(OriComplianceDialog, 'kyc');
export const TaxInfoCollect = withI18nReady(OriTaxInfoCollect, 'kyc');
export const TaxInfoCollectDialog = withI18nReady(OriTaxInfoCollectDialog, 'kyc');
export const PanConfirmDialog = withI18nReady(OriPanConfirmDialog, 'kyc');
