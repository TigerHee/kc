import * as React from 'react';

export interface TableProps {
  rowHeight?: number;
  onRowClick?: (record: object, index: number) => void;
}

export default Table;
