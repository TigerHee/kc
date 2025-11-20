/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import personalInfoFormModel from './components/PersonalInfoForm/model';

remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
  uniqueModel(dva, extendModel(m, personalInfoFormModel));
});

export { default as DrawerPersonalInfo } from './DrawerPersonalInfo';
export { default as KycLevel } from './components/KycLevel';
export { default as PersonalInfoForm } from './components/PersonalInfoForm';
export { default as Compliance, ComplianceDialog } from './components/Compliance';
export { default as TaxInfoCollect, TaxInfoCollectDialog } from './components/TaxInfoCollect';
export { default as PanConfirmDialog } from './components/TaxInfoCollect/PanConfirmDialog';
