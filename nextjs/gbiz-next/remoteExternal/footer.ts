import { default as OriFooter } from 'packages/footer/Footer';
import withI18nReady from 'adaptor/tools/withI18nReady';

export const Footer = withI18nReady(OriFooter, 'footer');

export { replaceHost } from 'packages/footer/common/tools';