/**
 * Owner: victor.ren@kupotech.com
 */
import styled from 'emotion/index';

export const Text = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

export const PaginationRoot = styled.nav`
  display: block;
  font-family: ${(props) => props.theme.fonts.family};
`;

export const PaginationUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
  li[data-item='page'],
  li[data-item*='ellipsis'] {
    margin: 0 3px;
  }
  li[data-item='previous'] {
    margin-right: 3px;
  }
  li[data-item='next'] {
    margin-left: 3px;
  }
  [dir='rtl'] & {
    li[data-item='previous'] {
      margin-right: 0;
      left: 3px;
    }
    li[data-item='next'] {
      margin-right: 3px;
    }
  }
`;

export const TotalNum = styled.li`
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
  margin-right: ${(props) => props.theme.space(2)}px;
  [dir='rtl'] & {
    margin-right: 0;
    margin-left: ${(props) => props.theme.space(2)}px;
  }
`;
