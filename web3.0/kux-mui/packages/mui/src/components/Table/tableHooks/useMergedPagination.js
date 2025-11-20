/**
 * Owner: victor.ren@kupotech.com
 */
export function getPaginationParam(pagination, mergedPagination = {}) {
  const param = {
    current: mergedPagination.current,
    pageSize: mergedPagination.pageSize,
  };
  const paginationObj = pagination && typeof pagination === 'object' ? pagination : {};

  Object.keys(paginationObj).forEach((pageProp) => {
    const value = mergedPagination[pageProp];

    if (typeof value !== 'function') {
      param[pageProp] = value;
    }
  });

  return param;
}

export default function usePagination(pagination, onChange) {
  const mergedPagination = { ...pagination };

  const onInternalChange = (event, current, pageSize) => {
    if (pagination) {
      pagination.onChange?.(event, current, pageSize);
    }
    onChange(current, pageSize || mergedPagination?.pageSize);
  };

  if (pagination === false) {
    return [{}, () => {}];
  }

  return [
    {
      ...mergedPagination,
      onChange: onInternalChange,
    },
  ];
}
