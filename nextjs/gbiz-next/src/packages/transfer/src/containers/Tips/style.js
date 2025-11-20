/**
 * Owner: solar@kupotech.com
 */
import { styled, Alert } from '@kux/mui';

export const StyledTip = styled.div`
    ${({ theme }) => theme.fonts.size.md}
    color: ${({ theme }) => theme.colors.text30};
    opacity: 1;
    margin-top: 4px;
`;

export const StyledSavingsAlert = styled(Alert)`
  margin-bottom: 8px;
  .KuxAlert-content {
    & > p {
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 400;
    }
  }
`;
