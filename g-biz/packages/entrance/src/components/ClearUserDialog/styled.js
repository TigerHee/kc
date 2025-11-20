/**
 * Owner: sean.shi@kupotech.com
 */
import { Dialog, styled } from '@kux/mui';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    .KuxDialog-content {
      padding: 32px;
    }
  }
`;

const DialogContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrap = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-width: 148px;
    height: auto;
    pointer-events: none;
  }
`;

const TipTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  margint-top: 8px;
`;

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  align-self: stretch;
  color: ${({ theme }) => theme.colors.text60};
  font-feature-settings: 'liga' off, 'clig' off;
  font-family: 'PingFang SC';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  white-space: pre-wrap;
`;

const ContentItem = styled.div`
  margin-top: 8px;
`;

const Operate = styled.section`
  display: flex;
  gap: 16px;
  align-self: stretch;
  justify-content: space-between;
  margin-top: 24px;
  button {
    flex: 1;
  }
`;

export {
  DialogWrapper,
  DialogContentWrapper,
  ImgWrap,
  TipTitle,
  ContentWrap,
  ContentItem,
  Operate,
};
