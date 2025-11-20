/**
 * Owner: solar@kupotech.com
 */
import { styled } from '@kux/mui';

export const StyledTotalShow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${(props) => props.theme.fonts.size.xl}
  color: ${(props) => props.theme.colors.text40};
  line-height: 22px;
  margin: 8px 0;
  .amount-wrapper {
    color: ${(props) => props.theme.colors.text};
    margin-right: 4px;
  }
`;
