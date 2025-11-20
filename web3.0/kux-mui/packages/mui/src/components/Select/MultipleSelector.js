/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import useTheme from 'hooks/useTheme';
import RenderFunctionOrNode from './renderFunctionOrNode';
import Box from '../Box';

import {
  MultipleStyledSelectInputContainer,
  MultipleStyledSelectInputContainerItem,
  StyledSearchInput,
  StyledSearchPlaceholder,
  SearchMirror,
} from './StyledComps';

import TranBtn from './TranBtn';

const MultipleSelector = ({
  size,
  searchVal,
  onChange,
  searchRef,
  searchPlaceholder,
  placeholder,
  selectedOptions,
  onRemove,
  optionLabelProp,
  autoComplete
}) => {
  const measureRef = React.useRef(null);
  const [inputWidth, setInputWidth] = React.useState(0);
  const theme = useTheme();
  const handleRemove = (value) => {
    onRemove(value);
  };
  React.useLayoutEffect(() => {
    setInputWidth(measureRef.current.scrollWidth);
  }, [searchVal]);
  return (
    <MultipleStyledSelectInputContainer theme={theme}>
      {selectedOptions.map((selectedOption) => {
        selectedOption = selectedOption || {};
        const { value } = selectedOption;
        return (
          <MultipleStyledSelectInputContainerItem theme={theme} key={value}>
            <TranBtn size={size} onRemove={() => handleRemove(value)}>
              <RenderFunctionOrNode
                nodeOrFun={selectedOption[optionLabelProp]}
                renderInput
                selected
              />
            </TranBtn>
          </MultipleStyledSelectInputContainerItem>
        );
      })}
      <MultipleStyledSelectInputContainerItem theme={theme}>
        <Box
          style={{
            marginInlineStart: '8px',
          }}
          position="relative"
          maxWidth="100%"
          width={inputWidth}
        >
          <StyledSearchInput
            autoComplete={autoComplete}
            ref={searchRef}
            value={searchVal}
            size={size}
            onChange={onChange}
            theme={theme}
            style={{ width: inputWidth }}
          />
          <SearchMirror ref={measureRef}>{searchVal}&nbsp;&nbsp;</SearchMirror>
        </Box>
      </MultipleStyledSelectInputContainerItem>
      {!selectedOptions || (!selectedOptions.length && !searchVal) ? (
        <StyledSearchPlaceholder
          style={{
            left: '10px',
          }}
          theme={theme}
          size={size}
        >
          {searchPlaceholder || placeholder}
        </StyledSearchPlaceholder>
      ) : null}
    </MultipleStyledSelectInputContainer>
  );
};

export default MultipleSelector;
