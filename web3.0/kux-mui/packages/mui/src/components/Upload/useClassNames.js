/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';
import capitalize from 'utils/capitalize';

export default function useClassNames(state) {
  // const {  } = state;

  const slots = {
    root: ['root'],
    wrapper: ['wrapper'],
    contentWrapper: ['contentWrapper'],
    actionWrapper: ['actionWrapper'],
    actionContent: ['actionContent'],
    actionPreview: ['actionPreview'],
    actionDelete: ['actionDelete'],
    previewImg: ['previewImg'],
    uploadTextWrapper: ['uploadTextWrapper'],
    uploadText: ['uploadText'],
    uploadDes: ['uploadDes'],
  };
  return composeClassNames(slots, (slot) => generateClassName('KuxUpload', slot));
}
