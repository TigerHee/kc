/**
 * Owner: solar@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledBatchSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 32px;
  span {
    ${(props) => props.theme.fonts.size.lg}
    color: ${(props) => props.theme.colors.text40};
  }
`;
