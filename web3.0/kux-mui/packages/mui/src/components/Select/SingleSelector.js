/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import useTheme from 'hooks/useTheme';
import { ICSearchOutlined } from '@kux/icons';
import RenderFunctionOrNode from './renderFunctionOrNode';
import {
  SingleSelectSearch,
  StyledSearchInput,
  StyledSearchPlaceholder,
  StyledPlaceholder,
  SelectItem,
  SearchIconWrapper,
} from './StyledComps';
import { useSingleSelectorClassNames } from './useClassNames';

const SingleSelector = ({
  innerOpen,
  allowSearch,
  searchIcon,
  searchVal,
  classNames,
  searchPlaceholder,
  selectedOptions,
  size,
  searchRef,
  onChange,
  optionLabelProp,
  placeholder,
  multiple,
  noStyle,
  autoComplete,
}) => {
  const theme = useTheme();
  const _classNames = useSingleSelectorClassNames();

  const showIcon = searchIcon && allowSearch;

  return (
    <>
      {allowSearch && searchIcon ? (
        <SearchIconWrapper size={size} className={_classNames.searchIcon}>
          <ICSearchOutlined color={theme.colors.text} />
        </SearchIconWrapper>
      ) : null}
      {innerOpen && allowSearch ? (
        <>
          {!searchVal ? (
            <StyledSearchPlaceholder
              size={size}
              theme={theme}
              className={clsx(_classNames.placeholder, classNames.searchPlaceholder)}
              showIcon={showIcon}
            >
              {selectedOptions.length && selectedOptions[0] ? (
                <RenderFunctionOrNode
                  selected
                  renderInput
                  nodeOrFun={selectedOptions[0][optionLabelProp]}
                  className={classNames.dropdownContainer}
                />
              ) : (
                searchPlaceholder
              )}
            </StyledSearchPlaceholder>
          ) : null}
          <SingleSelectSearch
            showIcon={showIcon}
            size={size}
            className={_classNames.inputContainer}
          >
            <StyledSearchInput
              multiple={multiple}
              autoComplete={autoComplete}
              value={searchVal}
              theme={theme}
              size={size}
              onChange={onChange}
              onClick={(e) => e.stopPropagation()}
              ref={searchRef}
              className={_classNames.input}
            />
          </SingleSelectSearch>
        </>
      ) : selectedOptions.length && selectedOptions[0] ? (
        <SelectItem noStyle={noStyle} theme={theme} showIcon={showIcon} selected size={size}>
          <RenderFunctionOrNode
            single
            size={size}
            selected
            renderInput
            nodeOrFun={selectedOptions[0][optionLabelProp]}
          />
        </SelectItem>
      ) : (
        <StyledPlaceholder
          className={clsx(_classNames.searchPlaceholder, classNames.placeholder)}
          size={size}
          theme={theme}
          showIcon={showIcon}
        >
          {placeholder}
        </StyledPlaceholder>
      )}
    </>
  );
};

export default SingleSelector;
