import { variant } from 'styled-system';
import styled from 'emotion/index';

export const VirtualTableCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 130%;
  font-weight: 500;
  border-right: transparent;
  border-left: transparent;
  border-bottom: 1px solid
    ${(props) => (props.isEmpty || !props.bordered ? 'transparent' : props.theme.colors.cover4)};
  color: ${(props) => props.theme.colors.text};
  &.KuxTable-virtual-table-row-hover {
    background: ${(props) => props.theme.colors.cover2};
  }
  &.KuxTable-virtual-table-row-cell-first {
    padding-left: 16px;
  }
  &.KuxTable-virtual-table-row-cell-last {
    padding-right: 16px;
  }
  ${variant({
    prop: 'size',
    variants: {
      small: {
        padding: '21.5px 0',
      },
      basic: {
        padding: '29.5px 0',
      },
    },
  })}
`;
