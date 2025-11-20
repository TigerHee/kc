/**
 * Owner: terry@kupotech.com
 */
import { Dialog } from "@kufox/mui";
import { styled } from '@kufox/mui/emotion';

const TradeDialog = styled(Dialog)`
  background: #181e29;
  border-radius: 4px;
  @media (max-width: 767px) {
    background: #212631;
    border-radius: 8px;
    max-width: 300px;
  }
  .KuxDialog-footer {
    width: initial;
    button {
      background: #21c397;
      color: #fff;
      @media (max-width: 767px) {
        background: #01bc8d;
        border-radius: 4px;
      }
    }
    @media (max-width: 767px) {
      padding: 0 24px 32px;
    }
  }
  .KuxDialog-content {
    padding: 20px 24px 24px;
    @media (max-width: 767px) {
      padding: 32px 24px 24px;
    }
  }
  .content {
    color: #e1e8f5;
    margin-bottom: 0;
    > p {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 26px;
      margin-bottom: 0;
      @media (max-width: 767px) {
        font-family: "Roboto";
        line-height: 150%;
      }
    }
  }
`;

const Tip = ({ children, ...rest }) => {
  return (
    <TradeDialog
      {...rest}
      okButtonProps={{
        className: "okBtn",
      }}
      maskProps={{
        style: {
          backgroundColor: `rgba(0,0,0,0.7)`,
        },
      }}
    >
      <p className={"content"}>{children}</p>
    </TradeDialog>
  );
};

export default Tip;
