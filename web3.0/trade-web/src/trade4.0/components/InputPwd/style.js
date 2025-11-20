/*
 * @owner: borden@kupotech.com
 */
import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DisplayInput = styled.div`
  border-radius: 8px;
  border: none;
  box-shadow: none;
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  /* text-align: center; */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.cover8};
  ${props => {
    return props.isActive ? `
      box-shadow: none;
      outline: none;
      border: 1px solid ${props.theme.colors.primary};
    ` : '';
  }}
`;

export const HiddenInput = styled.input`
  opacity: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Password = styled.span`
  // 解决*垂直居中显示偏上的问题
  transform: translateY(4px);
`;
