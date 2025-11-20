/**
 * Owner: john.zhang@kupotech.com
 */

import { styled } from '@kux/mui';

export const DotList = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: 16px;
  gap: 8px;
  list-style-type: disc;
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 6px;
  }
`;

export const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const DotListItem = styled(ListItem)`
  display: list-item;
  list-style-type: disc;
  font-size: 14px;
  &::marker {
    color: ${({ theme }) => theme.colors.text30};
  }
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: 1px;
  text-underline-position: from-font;
`;
