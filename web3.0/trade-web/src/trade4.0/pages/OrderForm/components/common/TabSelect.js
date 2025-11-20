/*
 * @owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { noop } from 'lodash';
import styled from '@emotion/styled';
import Select from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';

const Label = styled.div`
  font-weight: 500; 
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  color: ${(props) =>
    props.theme.colors[props.isRealValue ? 'text' : 'text40']};
`;
const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    padding: 0;
  `,
  Icon: styled(dropStyle.Icon)`
    padding-left: 4px;
  `,
  List: styled(dropStyle.List)`
    transform: translate3d(0, 12px, 0px);
    & .dropdown-item {
      min-width: unset;
      &:hover {
        background-color: ${(props) => props.theme.colors.cover4};
      }
      padding: 11px 12px;
      font-size: 14px;
      color: ${(props) => props.theme.colors.text};
    }
    & .active-dropdown-item {
      color: ${(props) =>
        props.theme.colors[props.v === props.realValue ? 'primary' : 'text']};
    }
  `,
};

const TabSelect = React.memo(
  ({
    value,
    onClick,
    options,
    onChange,
    realValue,
    renderLabel = v => v,
    ...otherProps
  }) => {
    const onSelect = useCallback((v) => {
      if (v !== realValue && onChange) {
        onChange(v);
      }
    }, [onChange, realValue]);

    return (
      <Select
        value={value}
        configs={options}
        disablePortal={false}
        extendStyle={DropdownExtend}
        overlayProps={{ realValue, onSelect }}
        renderLabel={(v) => (
          <Label
            isRealValue={value === realValue}
            onClick={value !== realValue ? onClick : noop}
          >
            {renderLabel(v)}
          </Label>
        )}
        {...otherProps}
      />
    );
  },
);

export default TabSelect;
