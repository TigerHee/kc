/**
 * Owner: Ray.Lee@kupotech.com
 */
import styled from '@emotion/styled';

export const UlWrapper = styled.ul`
  background: ${(props) => props.theme.colors.layer};
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.cover4};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  list-style: none;
  margin: 0;
  overflow: hidden;
  padding: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    border: none;
    box-shadow: none;
  }
`;

export const ItemWrapper = styled.li`
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 40px;
  padding: 0 12px;
  svg {
    color: ${(props) => props.theme.colors.icon};
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.cover4};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 56px;
  }
`;

export const ItemText = styled.span`
  color: ${(props) => props.theme.colors.text};
  margin-left: 8px;
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
`;

export const SvgWrapper = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
