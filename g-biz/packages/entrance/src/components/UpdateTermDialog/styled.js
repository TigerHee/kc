/**
 * Owner: sean.shi@kupotech.com
 */
import { Dialog, Button, styled, MDialog } from '@kux/mui';

export const DialogWrapper = styled(Dialog)`
  .KuxDialog-body {
    .KuxDialog-content {
      padding: 32px 32px 16px;
    }
  }
`;

export const TextMDialog = styled(MDialog)`
  .KuxDrawer-content {
    .KuxMDialog-content {
      .agreement-container {
        flex: 1;
        display: flex;
        flex-flow: nowrap column;
      }
      .agreement-content {
        flex: 1;
        display: flex;
        flex-flow: nowrap column;
      }
      .agreement-content-term {
        flex: 1;
        position: relative;
      }
      .agreement-box,
      .agreement-fail {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        height: 100% !important;
      }
    }
  }
`;

export const DialogContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextDialogContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .agreement-step {
    margin-bottom: 4px;
  }
  .agreement-box {
    padding-top: 12px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    .agreement-box,
    .agreement-fail {
      height: 409px !important;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    height: calc(100vh - 64px);
    padding: 24px 16px 42px 16px;
  }
  .agreement-checkbox {
    padding: 0 4px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0;
    }
    label {
      display: flex;
    }
  }

  .agreement-btns {
    padding: 0 4px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 0;
    }
    button {
      font-size: 14px;
      height: 40px;
    }
  }
`;

export const TextRetainDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 36px 24px 42px 24px;
  }
`;

export const ImgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 9px;
  margin-bottom: 8px;
  img {
    max-width: 136px;
    height: auto;
    pointer-events: none;
  }
`;

export const TextTermTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-family: 'KuFox Sans';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 25.2px */
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 12px;
    line-height: 130%;
  }
`;

export const TipTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-family: 'KuFox Sans';
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 28px */
  margin-bottom: 16px;
`;

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text60};
  font-family: 'KuFox Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin-bottom: 16px;
`;

export const ContentItem = styled.div`
  text-align: center;
  a {
    color: ${({ theme }) => theme.colors.text};
  }
`;
export const ContentDesc = styled.div`
  text-align: center;
  margin-top: 16px;
`;

export const Operate = styled.section`
  display: flex;
  flex-direction: column;
  align-self: stretch;
  justify-content: space-between;
  margin-top: 16px;
  gap: 12px;
  button {
    height: 40px;
  }
`;

export const TextTermExitButton = styled(Button)`
  width: 100%;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.text60};
`;

export const ModalExitButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text60};
`;

export const DialogContent = ({
  titleText,
  contentText,
  descText,
  agreeText,
  refuseText,
  onAgreeHandle,
  onLeaveHandle,
}) => {
  return (
    <>
      {titleText && <TipTitle>{titleText}</TipTitle>}
      <ContentWrap>
        <ContentItem>{contentText}</ContentItem>
        <ContentDesc>{descText}</ContentDesc>
      </ContentWrap>
      <Operate>
        <Button onClick={onAgreeHandle}>{agreeText}</Button>
        <ModalExitButton variant="text" onClick={onLeaveHandle}>
          {refuseText}
        </ModalExitButton>
      </Operate>
    </>
  );
};
