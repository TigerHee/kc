/**
 * Owner: victor.ren@kupotech.com
 */
import { findIndex, forEach } from 'lodash-es';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import useForkRef from 'hooks/useForkRef';
import clsx from 'clsx';
import VariableSizeList from '../Virtualized/VariableSizeList';
import AutoSizer from '../Virtualized/AutoSizer';
import {
  StyledOptionGroupLabel,
  StyledOptionItem,
  StyledSelectionContainer,
  EmptyContainer,
} from './StyledComps';
import Empty from '../Empty';
import RenderFunctionOrNode from './renderFunctionOrNode';
import { usePanelClassNames } from './useClassNames';

const defaultEmptyContentNode = (
  <EmptyContainer>
    <Empty size="small" />
  </EmptyContainer>
);

export default React.forwardRef(function OptionList(props, ref) {
  const {
    popperStyles,
    popperAttributes,
    theme,
    selectionWidth,
    matchWidth,
    classNames,
    handleDropdownClick,
    dropdownHeight,
    listItemHeight,
    options,
    dropdownAddonBefore,
    dropdownAddonAfter,
    dropdownAddonBeforeHeight,
    dropdownAddonAfterHeight,
    selectedValues,
    size,
    onSelect,
    autoScrollToSelected,
    emptyContent = false,
  } = props;
  const [listRef, setListRef] = React.useState(null);
  const hasScrollRef = useRef(false);
  const containerRef = useRef();
  const handleRef = useForkRef(containerRef, ref);
  const [calculatedDropdownHeight, setCalculatedDropdownHeight] = useState(dropdownHeight);
  const _classNames = usePanelClassNames();
  const [direction, setDirection] = useState('ltr');

  const list = React.useMemo(() => {
    const output = [...options];
    if (dropdownAddonAfter) {
      output.push(dropdownAddonAfter);
    }
    if (dropdownAddonBefore) {
      output.unshift(dropdownAddonBefore);
    }
    return output;
  }, [dropdownAddonAfter, dropdownAddonBefore, options]);

  const itemCount = React.useMemo(() => {
    return list.length;
  }, [list]);

  const shouldRenderList = React.useMemo(() => {
    return options && options.length > 0;
  }, [options]);

  const getItemSize = React.useCallback(
    (idx) => {
      const opt = list[idx];
      if (dropdownAddonBefore && idx === 0) {
        return dropdownAddonBeforeHeight;
      }
      if (dropdownAddonAfter && idx === itemCount - 1) {
        return dropdownAddonAfterHeight;
      }
      const { isGroupLabel } = opt;
      return isGroupLabel ? 20 : listItemHeight;
    },
    [
      list,
      dropdownAddonAfter,
      dropdownAddonAfterHeight,
      dropdownAddonBefore,
      dropdownAddonBeforeHeight,
      listItemHeight,
      itemCount,
    ],
  );

  const onSelectValue = React.useCallback(
    (val) => {
      if (val !== undefined) {
        onSelect(val, { selected: !selectedValues.has(val) });
      }
    },
    [onSelect, selectedValues],
  );

  useEffect(() => {
    if (autoScrollToSelected && listRef && hasScrollRef.current === false) {
      const value = (Array.from(selectedValues) || [])[0];
      const idx = findIndex(list, (o) => o.value === value);
      if (idx >= 0) {
        hasScrollRef.current = true;
        setTimeout(() => {
          listRef.scrollToItem(idx, 'center');
        }, 0);
      }
    }
  }, [autoScrollToSelected, selectedValues, list, listRef]);

  /**
   * 用于计算当前dropdown的实际高度
   * 比如数量过少，高度不够dropdownHeight的时候
   */
  useLayoutEffect(() => {
    /**
     * @type {HTMLDivElement}
     */
    if (!shouldRenderList) {
      setCalculatedDropdownHeight('inherit');
      return;
    }

    const el = containerRef.current;
    if (el) {
      const cs = window.getComputedStyle(el);
      const pt = parseInt(cs.paddingTop, 10);
      const pb = parseInt(cs.paddingBottom, 10);

      let outputHeight = pt + pb;
      forEach(list, (_, idx) => {
        outputHeight += getItemSize(idx);
      });
      if (outputHeight > dropdownHeight) {
        outputHeight = dropdownHeight;
      }
      setCalculatedDropdownHeight(outputHeight);
    } else {
      setCalculatedDropdownHeight(dropdownHeight);
    }
  }, [dropdownHeight, listItemHeight, list, getItemSize, shouldRenderList]);

  // ============================ direction =============================
  useEffect(() => {
    const _direction = document.querySelector('html').dir || 'ltr';
    setDirection(_direction);
  }, []);

  return (
    <StyledSelectionContainer
      style={popperStyles.popper}
      ref={handleRef}
      theme={theme}
      width={selectionWidth}
      matchWidth={matchWidth}
      className={clsx(_classNames.panelContainer, classNames.dropdownContainer)}
      onClick={handleDropdownClick}
      height={calculatedDropdownHeight}
      {...popperAttributes.popper}
    >
      {shouldRenderList ? (
        <AutoSizer>
          {({ width, height }) => {
            return (
              <VariableSizeList
                itemCount={itemCount}
                height={height}
                width={width}
                itemSize={getItemSize}
                ref={(ref) => setListRef(ref)}
                direction={direction}
              >
                {({ index, style }) => {
                  const item = list[index];
                  if (React.isValidElement(item) && (index === 0 || index === list.length - 1)) {
                    return <div style={style}>{item}</div>;
                  }

                  const { group, groupOption, label, value, key, disabled } = item;

                  if (group) {
                    return (
                      <StyledOptionGroupLabel theme={theme} style={style} key={key}>
                        {label !== undefined ? label : key}
                      </StyledOptionGroupLabel>
                    );
                  }

                  const selected = selectedValues.has(value);
                  return (
                    <StyledOptionItem
                      theme={theme}
                      key={value}
                      style={style}
                      size={size}
                      disabled={disabled}
                      selected={selected}
                      className={clsx(_classNames.option, classNames.optionItem, {
                        'KuxSelect-optionItem-disabled': disabled,
                      })}
                      onClick={() => {
                        if (!disabled) {
                          onSelectValue(value);
                        }
                      }}
                      isGroup={groupOption}
                    >
                      <RenderFunctionOrNode
                        nodeOrFun={label}
                        renderInput={false}
                        selected={selected}
                        className={classNames.dropdownContainer}
                      />
                    </StyledOptionItem>
                  );
                }}
              </VariableSizeList>
            );
          }}
        </AutoSizer>
      ) : (
        <>
          {dropdownAddonBefore}
          {React.isValidElement(emptyContent) ||
          typeof emptyContent === 'string' ||
          typeof emptyContent === 'number' ? (
            emptyContent
          ) : emptyContent.text || emptyContent.description ? (
            <EmptyContainer>
              <Empty
                size={emptyContent.size || 'small'}
                subDescription={emptyContent.subDescription}
                description={emptyContent.text || emptyContent.description}
              />
            </EmptyContainer>
          ) : emptyContent === false ? null : (
            defaultEmptyContentNode
          )}
          {dropdownAddonAfter}
        </>
      )}
    </StyledSelectionContainer>
  );
});
