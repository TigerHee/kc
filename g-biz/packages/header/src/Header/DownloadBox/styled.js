import { styled } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';

export const AppDownloadWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 32px 32px;
  // margin: 0 0 0 -12px;
  // [dir='rtl'] & {
  //   margin: 0 -12px 0 0;
  // }
  svg {
    margin: 0 6px;
  }
  & img {
    width: 16px;
  }
  &:hover {
    svg {
      fill: ${(props) => props.theme.colors.primary};
    }
  }
  ${(props) =>
    props.inTrade && {
      width: '32px',
      height: '32px',
    }}
`;

export const OverlayWrapper = styled.div`
  padding: 16px 24px;
  width: 244px;
  background: ${(props) => props.theme.colors.layer};
  box-shadow: 0px 10px 60px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  max-height: calc(100vh - 100px);
  overflow: auto;

  margin-top: ${(props) => (props.inTrade ? '8px' : '18px')};
  ${(props) => props.theme.breakpoints.down('xl')} {
    margin-top: ${(props) => (props.inTrade ? '8px' : '12px')};
  }

  & .title {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 14px;
    line-height: 130%;
    width: 100%;
    word-break: break-word;
    margin-bottom: 12px;
    white-space: normal;
    text-align: center;
  }
  & .QRCode {
    margin-bottom: 16px;
    .QRCodeBox {
      text-align: center;
    }
  }
  & .more {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.colors.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 130%;
    text-decoration: none !important;
  }
`;

export const ExICArrowRight2Outlined = styled(ICArrowRight2Outlined)`
  margin-left: 4px;
  [dir='rtl'] & {
    transform: rotate(180deg);
    margin-left: unset;
    margin-right: 4px;
  }
`;
