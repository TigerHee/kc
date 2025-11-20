/**
 * Owner: jesse.shao@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';
import { Dialog } from '@kufox/mui';
import { px2rem } from '@kufox/mui/utils';
import { ReactComponent as SearchSvg } from 'assets/recall/search.svg';
import { ReactComponent as CheckedSvg } from 'assets/recall/checked.svg';

export const LangSelectModal = styled(Dialog)`
  margin-bottom: 0;
  max-width: 100%;
  border-radius: ${px2rem(16)} ${px2rem(16)} 0 0;
  .content {
    padding: 0;
    overflow: hidden;
  }
`;

export const FakeDrag = styled.div`
  width: ${px2rem(40)};
  height: ${px2rem(4)};
  background: ${props => props.theme.colors.cover20};
  border-radius: ${px2rem(2)};
`;

export const ModalHeader = styled.div`
  height: ${px2rem(20)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InputWrapper = styled.div`
  margin: ${px2rem(6)} ${px2rem(12)};
  .search-input {
    height: ${px2rem(32)};
    border-radius: ${px2rem(6)};
  }
`;

export const SearchIcon = styled(SearchSvg)`
  color: ${props => props.theme.colors.icon};
  width: ${px2rem(24)};
  height: ${px2rem(24)};
`;

export const LangList = styled.ul`
  overflow-x: hidden;
  overflow-y: auto;
  height: ${px2rem(624)};
`;

export const ItemWrapper = styled.li`
  ${props => props.active && `background: ${props.theme.colors.cover4};`}
  height: ${px2rem(48)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  :hover {
    background: ${props => props.theme.colors.cover4};
  }
  span {
    margin-left: ${px2rem(16)};
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
    /* identical to box height, or 157% */

    /* 亮色主题/文字/text */

    color: ${props => props.theme.colors.text};
  }
`;

export const CheckedIcon = styled(CheckedSvg)`
  margin-right: ${px2rem(12)};
  width: ${px2rem(24)};
  height: ${px2rem(24)};
  color: ${props => props.theme.colors.primary};
`;
