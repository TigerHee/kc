/**
 * Owner: garuda@kupotech.com
 */
import React from 'react';

import { styled } from '../../builtinCommon';
import { Select, dropStyle } from '../../builtinComponents';

const Label = styled.div`
  font-weight: 500;
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
  color: ${(props) => props.theme.colors[props.isRealValue ? 'text' : 'text40']};
`;
const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    padding: 0;
  `,
  Icon: styled(dropStyle.Icon)`
    padding-left: 5px;
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
      color: ${(props) => props.theme.colors.primary};
    }
  `,
};

const TabSelect = React.memo(({ value, options, realValue, ...otherProps }) => {
  return (
    <Select
      value={value}
      configs={options}
      disablePortal={false}
      extendStyle={DropdownExtend}
      renderLabel={(v) => {
        return <Label isRealValue={realValue}>{v}</Label>;
      }}
      {...otherProps}
    />
  );
});

export default TabSelect;
