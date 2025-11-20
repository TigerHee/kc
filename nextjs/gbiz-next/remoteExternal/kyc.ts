import {
  Compliance as OriCompliance,
  ComplianceDialog as OriComplianceDialog,
  TaxInfoCollect as OriTaxInfoCollect,
  TaxInfoCollectDialog as OriTaxInfoCollectDialog,
  PanConfirmDialog as OriPanConfirmDialog,
} from 'packages/kyc/src';
import withI18nReady from 'adaptor/tools/withI18nReady';

export const Compliance = withI18nReady(OriCompliance, 'kyc');
export const ComplianceDialog = withI18nReady(OriComplianceDialog, 'kyc');
export const TaxInfoCollect = withI18nReady(OriTaxInfoCollect, 'kyc');
export const TaxInfoCollectDialog = withI18nReady(OriTaxInfoCollectDialog, 'kyc');
export const PanConfirmDialog = withI18nReady(OriPanConfirmDialog, 'kyc');
