/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

export const ExDialog = styled(Dialog)`
  .KuxDialog-body {
    padding-top: 32px;
  }
  .KuxDialog-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    padding: 8px 32px;
  }
  .KuxModalFooter-root {
    padding-top: 24px;
  }
  .KuxModalFooter-buttonWrapper {
    gap: 16px;
    button {
      flex: 1;
    }
    button:first-child {
      margin-right: 0;
    }
  }
`;
export const DialogIcon = styled.img`
  width: fit-content;
  margin: 18.5px 0 23px;
`;
export const DialogTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  line-height: 140%;
`;
export const DialogDesc = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
`;
