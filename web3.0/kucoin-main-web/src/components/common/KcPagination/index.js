/**
 * Owner: willen@kupotech.com
 */
import React, { useMemo } from 'react';
import TablePagination from '@kc/mui/lib/components/TablePagination';

export default (props) => {
  const { total, current, pageSize, onChange, ...otherProps } = props;
  const { count, rowsPerPage, page } = useMemo(() => {
    let _page = Number(current) - 1;
    _page = _page >= 0 ? _page : 0;
    return {
      count: total || 0,
      rowsPerPage: pageSize,
      page: _page,
    };
  }, [total, current, pageSize]);
  return (
    <TablePagination
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onChangePage={(e, v) => {
        if (onChange) {
          onChange(Number(v) + 1);
        }
      }}
      {...otherProps}
    />
  );
};
