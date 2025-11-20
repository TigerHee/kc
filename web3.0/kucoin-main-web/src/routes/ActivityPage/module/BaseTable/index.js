/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Table } from '@kc/ui';
import style from './style.less';
import Empty from 'components/common/Empty';

export default ({ dataSource, columns, baseTableClassName, styles, ...others }) => {
  return (
    <div className={`${style.baseTable} ${baseTableClassName || ''}`} style={styles}>
      <Table
        dataSource={dataSource}
        columns={columns}
        locale={{
          emptyText: <Empty size={50} style={{ textAlign: 'center', padding: '40px 0' }} />,
        }}
        {...others}
      />
      {dataSource.length > 0 && others.pagination}
    </div>
  );
};
