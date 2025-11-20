/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import usePagination from 'hooks/usePagination';
import useTheme from 'hooks/useTheme';
import KEYCODE from 'utils/keyCode';
import useEventCallback from 'hooks/useEventCallback';
import classNames from 'clsx';
import { composeClassNames } from 'styles/index';
import styled from 'emotion/index';
import PaginationItem from './PaginationItem';
import Box from '../Box';
import Input from '../Input';
import { PaginationRoot, TotalNum, PaginationUl, Text } from './styledComps';

import getPaginationClassName from './classNames';

const CusInput = styled(Input)`
  padding: 0;
  border-radius: 4px;
  .KuxInput-input {
    text-align: center;
    width: 100%;
    height: 28px;
    font-size: 14px;
  }
  fieldset {
    border-radius: 4px;
  }
`;

const useClassName = (state) => {
  const { classNames: classNamesFromProps, simple } = state;

  const slot = {
    navigation: ['navigation', simple && 'simpleNavigation'],
    root: ['root', simple && 'simpleRoot'],
    total: ['total'],
    previous: ['previous'],
    next: ['next'],
    item: ['item'],
    quick: ['quick'],
  };
  return composeClassNames(slot, getPaginationClassName, classNamesFromProps);
};

const Pagination = React.forwardRef((props, ref) => {
  const { pageItem = {} } = props;
  const {
    boundaryCount,
    siblingCount,
    total,
    defaultPageSize,
    pageSize,
    defaultCurrent,
    current,
    disabled,
    onChange,
    showTotal,
    simple,
    showJumpQuick,
    renderItem = (item) => <PaginationItem {...item} {...pageItem} />,
    className,
    ...others
  } = props;

  const _props = {
    disabled,
    onChange,
    boundaryCount,
    siblingCount,
    total,
    defaultCurrent,
    current,
    pageSize: pageSize || defaultPageSize,
    domPreventDefault: pageItem.domPreventDefault,
  };
  const theme = useTheme();

  const { items, totalPage, handlePageChange, current: currentNow } = usePagination({ ..._props });

  const [currentInputValue, setCurrentInputValue] = React.useState(currentNow);

  React.useEffect(() => {
    setCurrentInputValue(currentNow);
  }, [currentNow]);

  const handleKeyUp = useEventCallback((event) => {
    if (!currentInputValue) {
      return;
    }
    const value = currentInputValue;
    if (event.keyCode === KEYCODE.ENTER || event.type === 'click') {
      handlePageChange(event, Number(value));
    }
  });

  const handleBlur = useEventCallback((event) => {
    if (!currentInputValue) {
      return;
    }
    const value = currentInputValue;

    if (
      event.relatedTarget &&
      event.relatedTarget.nodeName &&
      event.relatedTarget.nodeName === 'BUTTON'
    ) {
      return;
    }

    handlePageChange(event, Number(value));
  });

  const handleInputChange = useEventCallback((event) => {
    let value = event?.target?.value?.replace(/[^\d]/g, '');
    if (value && value > totalPage) {
      value = totalPage;
    } else if (value && value < 1) {
      value = 1;
    }
    setCurrentInputValue(value);
  });

  const _classNames = useClassName({ ...others, simple });

  return (
    <PaginationRoot
      className={classNames(className, _classNames.navigation)}
      theme={theme}
      aria-label="pagination navigation"
      ref={ref}
      {...others}
    >
      <PaginationUl className={_classNames.root}>
        {showTotal ? (
          <TotalNum className={_classNames.total} theme={theme}>
            {showTotal(total)}
          </TotalNum>
        ) : null}
        {items.map((item) => {
          if (simple) {
            if (item.type === 'next' || item.type === 'previous') {
              return (
                <li
                  className={classNames({
                    [`${_classNames[item.type]}`]: true,
                    [`${_classNames[item.type]}-disabled`]: item.disabled,
                  })}
                  data-item={item.type}
                  key={`paginationItem_${item.type}_${item.page}`}
                >
                  {renderItem(item)}
                </li>
              );
            }
            return null;
          }
          return (
            <li
              className={classNames({
                [`${_classNames.item}`]: true,
                [`${_classNames.item}-selected`]: item.selected,
              })}
              data-item={item.type}
              key={`paginationItem_${item.type}_${item.page}`}
            >
              {renderItem(item)}
            </li>
          );
        })}
        {showJumpQuick ? (
          <Box className={_classNames.quick} display="flex" marginLeft="8px">
            <Box width="28px">
              <CusInput
                theme={theme}
                size="small"
                value={currentInputValue}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                classNames={{ input: 'Pagination-Input' }}
              />
            </Box>
            <Box width="28px" display="flex" alignItems="center" justifyContent="center">
              /
            </Box>
            <Box width="28px" display="flex" alignItems="center" justifyContent="center">
              <Text theme={theme}>{totalPage}</Text>
            </Box>
          </Box>
        ) : null}
      </PaginationUl>
    </PaginationRoot>
  );
});

Pagination.displayName = 'Pagination';

Pagination.propTypes = {
  total: PropTypes.number,
  boundaryCount: PropTypes.number,
  siblingCount: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  current: PropTypes.number,
  defaultCurrent: PropTypes.number,
  defaultPageSize: PropTypes.number,
  pageSize: PropTypes.number,
  showTotal: PropTypes.func,
  simple: PropTypes.bool,
  showJumpQuick: PropTypes.bool,
};

Pagination.defaultProps = {
  total: 0,
  boundaryCount: 1,
  siblingCount: 2,
  defaultCurrent: 1,
  defaultPageSize: 10,
  simple: false,
  showJumpQuick: false,
};

export default Pagination;
