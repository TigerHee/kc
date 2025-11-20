/**
 * Owner: victor.ren@kupotech.com
 */
import { generateClassName, composeClassNames } from 'styles/index';

function getTableClassName(slot) {
  return generateClassName('KuxTable', slot);
}

export default function useClassNames() {
  const slots = {
    virtualTable: ['virtual-table'],
    virtualGrid: ['virtual-grid'],
    virtualTableCell: ['virtual-table-cell'],
    virtualTableCellRowFirst: ['virtual-table-row-cell-first'],
    virtualTableCellRowLast: ['virtual-table-row-cell-last'],
    virtualTableRowHover: ['virtual-table-row-hover'],
  };
  return composeClassNames(slots, getTableClassName);
}
