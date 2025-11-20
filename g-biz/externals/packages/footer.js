/**
 * Owner: iron@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import { Footer as OriFooter } from '@packages/footer/src/componentsBundle';

export const Footer = withI18nReady(OriFooter, 'footer');

export { replaceHost } from '@packages/footer/src/common/tools';
