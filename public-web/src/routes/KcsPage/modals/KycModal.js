/**
 * Owner: chris@kupotech.com
 */
import { Dialog } from '@kux/mui';
import { styled } from '@kux/mui/emotion';
// import { kcsensorsManualTrack } from 'utils/sensors';
import JsBridge from '@knb/native-bridge';
import ErrorDark from 'static/kcs-intro/error_dark.svg';
import siteCfg from 'utils/siteConfig';
import { callJump } from '../utils';

// ImageBitmapRenderingContext

const Modal = styled(Dialog)`
  .KuxDialog-body {
    max-width: 319px;
  }
  .img {
    display: block;
    margin: 32px auto 0px;
  }
  .title {
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 20px;
    line-height: 130%;
    text-align: center;
  }
  .subtitle {
    margin-top: 12px;
    color: ${(props) => props.theme.colors.text60};
    font-size: 16px;
    line-height: 130%;
    text-align: center;
  }
  .cancelBtn {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.cover8};
    border: none;
    &:hover {
      background-color: ${({ theme }) => theme.colors.cover8};
    }
  }
  .okBtn {
    color: ${({ theme }) => theme.colors.textEmphasis};
    background-color: ${({ theme }) => theme.colors.text};
    &:hover {
      background-color: ${({ theme }) => theme.colors.text};
    }
  }
`;

function KycModal({ kycConfig = {}, kycModalVisible, onCancel }) {
  const isInApp = JsBridge.isApp();
  const {
    title = '',
    content = '',
    buttonAgree = '',
    buttonRefuse = '',
    buttonAgreeWebUrl = '',
    buttonAgreeAppUrl,
  } = kycConfig;

  // 点击去认证
  const clickHandle = () => {
    callJump(
      {
        url: buttonAgreeAppUrl,
      },
      `${siteCfg.MAINSITE_HOST}${buttonAgreeWebUrl}`,
    );
    onCancel();
  };

  return (
    <Modal
      showCloseX={false}
      header={null}
      centeredFooterButton
      open={kycModalVisible}
      onCancel={onCancel}
      okText={buttonAgree}
      cancelText={buttonRefuse}
      onOk={clickHandle}
      okButtonProps={{ className: 'okBtn' }}
      cancelButtonProps={{ className: 'cancelBtn' }}
      maskClosable
    >
      <img className="img" src={ErrorDark} alt="status" />
      <div className="title">{title}</div>
      <div className="subtitle">{content}</div>
    </Modal>
  );
}
export default KycModal;
