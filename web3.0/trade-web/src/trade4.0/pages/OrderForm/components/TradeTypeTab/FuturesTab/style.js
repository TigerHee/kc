/*
  * owner: borden@kupotech.com
 */
import styled from '@emotion/styled';

export const Container = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.theme.colors.text40};
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

export const Label = styled.span`
  margin-right: 3px;
  white-space: nowrap;
`;
