import { styled } from '@kux/mui';
import { Link } from 'components/Router';

export const BaseInfoWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px 0;
  /** 这个样式别动，否则会导致子元素不能顶部对齐，分割线的隐藏/显示将会失效 */
  align-items: initial !important;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: block;
  }
`;

export const BaseInfoDivider = styled.div`
  flex: 0 0 65px;
  display: flex;
  justify-content: center;
  .KuxDivider-vertical {
    margin: 0;
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`;

export const BaseInfoTopWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-bottom: 22px;
  }
`;
export const BottomItem = styled.div`
  flex-shrink: 0;
  & + div {
    margin-left: 40px;
  }
`;

export const ItemTitle = styled(Link)`
  font-weight: 400;
  font-size: 13px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: ${({ hasBorder }) => (hasBorder ? '7px' : '8px')};
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 14px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const NoLinkItemTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    font-size: 14px;
  }
`;

export const ItemDesc = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  word-break: break-word;
  text-align: left;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    text-align: right;
  }
`;
