/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import SeoLink from '@/components/SeoLink';
import dropStyle from '@/components/DropdownSelect/style';
import SvgComponent from '@/components/SvgComponent';
import ScrollWrapper from '@/components/ScrollWrapper';

// header
export const HeaderWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${fx.padding('0px')}
  border-bottom: 1px solid;
  border-bottom-color: ${(props) => props.theme.colors.divider4};
`;

export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    padding: 0;
  `,
  List: styled(dropStyle.List)`
    & .dropdown-item {
      padding: 11px 12px;
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      svg {
        margin: 0 8px 0 0;
      }
    }
  `,
};

export const SymbolsWrapper = styled(ScrollWrapper)`
  flex: 1;
  height: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const ItemWrapper = styled(SeoLink)`
  display: inline-flex;
  align-items: center;
  height: 100%;
  padding: 8px;

  svg {
    color: ${(props) => props.theme.colors.icon};

    &:hover {
      color: ${(props) => props.theme.colors.text};
    }
  }

  &:hover,
  &.active {
    background: ${(props) => props.theme.colors.cover4};
  }
`;

export const Item = styled.div`
  padding-right: 4px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: ${({ theme }) => {
    return theme.colors.text60;
  }};
  .name {
    color: ${({ theme }) => {
      return theme.colors.text;
    }};
  }

  .st {
    margin-left: 2px;
  }

  flex: 1;

  > span {
    padding-right: 4px;
  }

  .futures-symbol {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 8px;
    &:hover {
      color: ${(props) => props.theme.colors.icon};
    }
  }
`;

export const ChartTypeWrapper = styled.div`
  width: 32px;
  max-width: 32px;
  min-width: 32px;
  height: 32px;

  svg {
    width: 16px;
    height: 16px;
    margin: 8px;
  }
`;

export const Icon = styled(SvgComponent)`
  cursor: pointer;
  display: inline-flex;
  margin-right: 4px;
  color: ${(props) => props.theme.colors.icon};
  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

// const Change = styled.span`
//   color: ${props => (props.changeRate < 0 ? props.down : props.up)};
// `;
