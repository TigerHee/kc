/*
 * owner: Clyne@kupotech.com
 */
import { fx, styled, withMedia } from '@/style/emotion';
import { name } from '@/pages/Orderbook/config';
import dropStyle from '@/components/DropdownSelect/style';
import { ICSingleSelectOutlined, ICSuccessUnselectOutlined } from '@kux/icons';

const HOC = (FC) => withMedia(name, FC);

// header
export const HeaderWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.padding('8px 12px 0 12px')}
  ${fx.alignItems('center')}
  & > .header + .header {
    ${fx.marginLeft(26)}
  }
`;
// MD的样式
const DepthWrapperMd = () => `
  flex: 1;
  justify-content: flex-end;
`;
// depth
export const DepthWrapper = HOC(styled.div`
  ${fx.display('flex')}
  ${({ $media }) => $media('md', DepthWrapperMd())}
`);
export const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    ${fx.fontWeight(500)}
    font-size: 12px;
    ${(props) => fx.color(props, 'text60')}
    padding: 0;
  `,
  Icon: styled(dropStyle.Icon)`
    ${(props) => fx.color(props, 'icon60')}
    >svg {
      margin-left: 2px;
    }
  `,

  List: styled(dropStyle.List)`
    .dropdown-item {
      font-size: 14px;
    }
  `,
};

// 类型
// MD的样式
const TypeWrapperMd = () => `
  display: none;
`;
export const TypeWrapper = HOC(styled.div`
  ${fx.display('flex')}
  ${fx.flex(1)}
  ${({ $media }) => $media('md', TypeWrapperMd())}
`);
export const TypeIcon = styled.div`
  ${fx.cursor()}
  ${fx.marginLeft(12)}
  &:first-of-type {
    ${fx.marginLeft(0)}
  }
  svg {
    box-sizing: content-box;
    display: block;
    padding: 2px 0;
  }
`;

// 合约融合
export const More = styled.div`
  ${(props) => fx.color(props, 'icon')}
  padding-left: 8px;
`;

export const Option = styled.div`
  display: flex;
  ${fx.minHeight(20)}
  ${fx.alignItems('center')}
  div {
    padding-left: 8px;
    ${(props) => fx.color(props, 'text')}
  }
`;

export const SelectOutlinedIcon = styled(ICSingleSelectOutlined)`
  display: block;
  fill: ${({ theme }) => theme.colors.primary};
`;

export const UnselectOutlinedIcon = styled(ICSuccessUnselectOutlined)`
  display: block;
  fill: ${({ theme }) => theme.colors.icon40};
`;
