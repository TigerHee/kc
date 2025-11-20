/**
 * Owner: iron@kupotech.com
 */
import { setPush } from '@packages/header/src/pushRouter';
import withI18nReady from '@hooks/withI18nReady';
import {
  Header as OriHeader,
  PWATip as OriPWATip,
  RestrictNotice as OriRestrictNotice,
} from '@packages/header/src/componentsBundle';

export const Header = withI18nReady(OriHeader, 'header');
export const PWATip = withI18nReady(OriPWATip, 'header');
export const RestrictNotice = withI18nReady(OriRestrictNotice, 'header');

export const pushTool = { setPush };
