/**
 * Owner: tiger@kupotech.com
 */
import { ICArrowLeft2Outlined } from '@kux/icons';
import { styled } from '@kux/mui';

export const Wrapper = styled.section`
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  min-height: 80vh;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
  .goBack {
    display: flex;
    align-items: center;
    width: fit-content;
    margin-bottom: 40px;
    padding-top: 26px;
    padding-bottom: 12px;
    cursor: pointer;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-bottom: 32px;
      padding-top: 20px;
      padding-bottom: 0px;
    }
    span {
      color: ${({ theme }) => theme.colors.text60};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;
    }
  }
`;
export const ReturnIcon = styled(ICArrowLeft2Outlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text60};
`;
