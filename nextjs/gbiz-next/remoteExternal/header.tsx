import { default as OriHeader } from 'packages/header/Header';
import { default as OriPWATip } from 'packages/header/PWATip';
import { RestrictNoticeWithTheme as OriRestrictNotice } from 'packages/header/Header/RestrictNotice';
import withI18nReady from 'adaptor/tools/withI18nReady';

export const Header = withI18nReady(OriHeader, 'header');
export const PWATip = withI18nReady(OriPWATip, 'header');
export const RestrictNotice = withI18nReady(OriRestrictNotice, 'header');

function setPush(_push) {
  window.pushTo = _push;
}

export const pushTool = { setPush };
