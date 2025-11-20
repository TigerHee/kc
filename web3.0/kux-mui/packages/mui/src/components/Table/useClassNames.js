/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getTableClassName(slot) {
  return generateClassName('KuxTable', slot);
}

export default function useClassNames() {
  const slots = {
    root: ['root'],
    header: ['header'],
    virtualTable: ['virtual-table'],
    virtualGrid: ['virtual-grid'],
    virtualTableCell: ['virtual-table-cell'],
    virtualTableCellLast: ['virtual-table-cell-last'],
  };
  return composeClassNames(slots, getTableClassName);
}
