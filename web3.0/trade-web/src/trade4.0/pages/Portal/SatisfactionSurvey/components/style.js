/**
 * Owner: harry.lai@kupotech.com
 */
import { styled } from '@/style/emotion';
import Dialog from '@mui/Dialog';

export const StarImg = styled.img`
  width: 24px;
  height: 24px;
`;

export const StarWrap = styled.section`
  display: flex;
  justify-content: space-between;
  width: 184px;
`;

export const AnswerWrap = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 等宽 */
  transition: grid-template-rows 0.3s ease-out;

  gap: 8px 12px;
  width: 100%;

  .item {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.colors.divider8};
    color: ${({ theme }) => theme.colors.text60};
    font-size: 12px;
    font-weight: 500;
    line-height: 130%;
    cursor: pointer;

    &.active {
      border: 1px solid ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const Tip = styled.span`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-family: Roboto;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-top: 8px;
  margin-bottom: 24px;
`;

export const FinishDialogWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 18px;
`;

export const FinishStyledDialog = styled(Dialog)`
  .KuxDialog-body {
    width: 400px;
    min-height: 323px;
    padding: 32px;
  }

  .KuxDialog-content {
    flex: 1;
    padding: 0;
  }
`;
