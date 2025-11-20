/**
 * Owner: ella@kupotech.com
 */
import withI18nReady from '@hooks/withI18nReady';
import OriLearnHeader from '@packages/learnHeader/src/componentsBundle';
import { setPush } from '@packages/learnHeader/src/pushRouter';

export const LearnHeader = withI18nReady(OriLearnHeader, 'learnHeader');
export const pushTool = { setPush };
