/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';

export const Container = styled.div``;

export const Title = styled.div`
  color: #000;
  font-size: 16px;
  font-weight: 600;
  line-height: 200%; /* 32px */
`;

export const Desc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 14px;
  font-weight: 400;
  line-height: 200%;
`;

export const List = styled.ul`
  padding-left: 1em;
  list-style: ${({ listStyle = 'auto' }) => listStyle};
  color: ${({ theme, deepen }) => (deepen ? theme.colors.text : theme.colors.text60)};
  font-size: 14px;
  font-weight: 400;
  line-height: 200%;
`;
export const Item = styled.li``;
