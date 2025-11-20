/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import KcPagination from 'components/common/KcPagination';
import style from './style.less';

const CustomPagination = (props) => {
  const { total, current, onChange } = props;
  return (
    <div className={style.paginationContainer}>
      <KcPagination total={total} current={current} pageSize={10} onChange={onChange} />
    </div>
  );
};

export default CustomPagination;
