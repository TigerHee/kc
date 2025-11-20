/**
 * Owner: victor.ren@kupotech.com
 */
import useMergedState from './useMergedState';

export default function usePagination(props = {}) {
  const {
    boundaryCount,
    siblingCount,
    total,
    defaultCurrent,
    disabled,
    onChange,
    current: currentFromProp,
    pageSize,
    domPreventDefault,
    ...other
  } = props;

  const totalPage = Math.ceil(total / pageSize);

  const [current, setCurrentPageState] = useMergedState(defaultCurrent, {
    value: currentFromProp,
  });

  const handlePageChange = (_, value) => {
    // 阻止事件的默认行为
    if (domPreventDefault) {
      _.preventDefault();
    }
    if (!currentFromProp) {
      setCurrentPageState(value);
    }
    if (onChange) {
      onChange(value, value, pageSize);
    }
  };

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, totalPage));

  const endPages = range(Math.max(totalPage - boundaryCount + 1, boundaryCount + 1), totalPage);

  const siblingsStart = Math.max(
    Math.min(current - siblingCount, totalPage - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(current + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPage - 1,
  );

  const itemList = [
    ...['previous'],
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < totalPage - boundaryCount
      ? [boundaryCount + 1]
      : []),

    ...range(siblingsStart, siblingsEnd),

    ...(siblingsEnd < totalPage - boundaryCount - 1
      ? ['end-ellipsis']
      : totalPage - boundaryCount > boundaryCount
      ? [totalPage - boundaryCount]
      : []),
    ...endPages,
    ...['next'],
  ];

  const buttonPage = (type) => {
    switch (type) {
      case 'previous':
        return current - 1;
      case 'next':
        return current + 1;
      default:
        return null;
    }
  };

  const items = itemList.map((item) => {
    return typeof item === 'number'
      ? {
          onClick: (event) => {
            handlePageChange(event, item);
          },
          type: 'page',
          page: item,
          selected: item === current,
          disabled,
          'aria-current': item === current ? 'true' : undefined,
        }
      : {
          onClick: (event) => {
            handlePageChange(event, buttonPage(item));
          },
          type: item,
          page: buttonPage(item),
          selected: false,
          disabled:
            disabled ||
            (item.indexOf('ellipsis') === -1 &&
              (item === 'next' || item === 'last' ? current >= totalPage : current <= 1)),
        };
  });

  return {
    items,
    totalPage,
    current,
    handlePageChange,
    ...other,
  };
}
