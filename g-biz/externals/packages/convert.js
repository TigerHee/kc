/**
 * Owner: Borden@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import { setPush } from '@packages/convert/src/utils/pushRouter';
import { Convert as OriConvert, ConvertDialog as OriConvertDialog } from '@packages/convert';

export const Convert = withI18nReady(OriConvert, 'convert');
export const ConvertDialog = withI18nReady(OriConvertDialog, 'convert');
export const pushTool = { setPush };
