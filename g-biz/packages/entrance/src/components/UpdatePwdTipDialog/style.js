/**
 * Owner: tiger@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

export const DialogWrapper = styled(Dialog)``;
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
  .KuxCheckbox-wrapper {
    width: fit-content;
  }
  .desc {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    margin-bottom: 28px;
    color: ${({ theme }) => theme.colors.text60};
  }
  .ignoreTime {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    color: ${({ theme }) => theme.colors.text60};
  }
  .btnBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 12px;
    margin-top: 24px;
  }
`;
