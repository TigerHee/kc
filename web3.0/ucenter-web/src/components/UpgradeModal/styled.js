/**
 * Owner: willen@kupotech.com
 */

import { Dialog, styled } from '@kux/mui';

export const MyDialogBody = styled(Dialog)`
  .KuxDialog-body {
    max-width: 520px !important;
    padding: 0;
  }
  .KuxDialog-content {
    padding: 0;
  }
`;

export const Topbg = styled.img`
  width: 100%;
`;

export const MyDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
`;
export const LinkToSupport = styled.div`
  padding-bottom: 24px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const DialogTitle = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  font-size: 16px;
`;

export const DialogDes = styled.div`
  font-size: 12px;
`;
