import * as React from 'react';

export interface TableProps {
  columns?: Array<any>;
  size?: 'small' | 'basic';
  dataSource?: Array<any>;
  loading?: boolean;
  rowKey?: string | ((record: any, index: number) => string);
  pagination?: boolean | object;
  expandable?: object;
  showHeader?: boolean;
  bordered?: boolean;
  headerBorder?: boolean;
  headerType?: 'transparent' | 'filled';
}

declare class Table extends React.Component<TableProps, {}> {
  static defaultProps: {
    columns: [];
    dataSource: [];
    size: 'basic';
    loading: false;
    pagination: false;
    rowKey: 'key';
    showHeader: true;
    bordered: false;
    headerBorder: false;
    headerType: 'transparent';
  };
}

export default Table;
