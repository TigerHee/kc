/**
 * Owner: brick.fan@kupotech.com
 */

import styled from '@emotion/styled';
import JsBridge from '@knb/native-bridge';
import { Dialog, MDialog } from '@kux/mui';
import successSVG from 'static/cert/success.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import CaseImgDesc from './CaseImgDesc';

import { tenant } from 'src/config/tenant';

const DialogWrapper = styled(Dialog)`
  .KuxDialog-content {
    padding: 0;
  }
  .KuxModalHeader-root {
    height: 90px !important;
  }
  .dialog-content {
    max-height: 498px;
    margin-top: 0;
    padding: 0 32px;
    overflow-y: auto;
  }

  .custom-scrollbar {
    &::-webkit-scrollbar {
      width: 3px;
      border-radius: 2px;
    }

    /* 定义滚动条轨道的样式 */
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    /* 定义滚动条的样式 */
    &::-webkit-scrollbar-thumb {
      background: rgba(29, 29, 29, 0.16);
      border-radius: 3px;
    }

    /* 当鼠标悬停在滚动条上时，定义滚动条的样式 */
    &::-webkit-scrollbar-thumb:hover {
      // background: #555;
    }
  }
`;

const MDialogWrapper = styled(MDialog)`
  .KuxModalHeader-root {
    /* height: 0; */
    border: none;
  }
  .KuxDrawer-content {
    /* 定义滚动条的宽度 */
    &::-webkit-scrollbar {
      width: 3px;
      border-radius: 2px;
    }

    /* 定义滚动条轨道的样式 */
    &::-webkit-scrollbar-track {
      background: transparent;
    }

    /* 定义滚动条的样式 */
    &::-webkit-scrollbar-thumb {
      background: rgba(29, 29, 29, 0.16);
      border-radius: 3px;
    }

    /* 当鼠标悬停在滚动条上时，定义滚动条的样式 */
    &::-webkit-scrollbar-thumb:hover {
      // background: #555;
    }
  }
  .KuxMDialog-content {
    padding-bottom: calc(72px + env(safe-area-inset-bottom));
    overflow: auto;
  }
  .KuxMDialog-footer {
    position: absolute;
    bottom: env(safe-area-inset-bottom);
    left: 0;
    background: white;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .successImg {
    width: 148px;
    height: 148px;
  }
  .cert-title {
    margin-top: 8px;
    color: #1d1d1d;
    font-weight: 700;
    font-size: 24px;
    line-height: 130%;
    text-align: center;
  }
  .cert-desc {
    margin-top: 8px;
    color: rgba(29, 29, 29, 0.6);
    font-weight: 400;
    font-size: 16px;
    font-family: Roboto;
    line-height: 150%;
    text-align: center;
    word-break: break-word;
    .account {
      color: #1d1d1d;
      font-weight: 500;
    }
    .staff_emphasize {
      color: rgba(248, 178, 0, 0.88);
      font-weight: 600;
    }
  }
  .highlight {
    color: #01bc8d;
    cursor: pointer;
  }
  .cert-divider {
    width: 100%;
    height: 1px;
    margin-top: 24px;
    background: rgba(29, 29, 29, 0.08);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const SuccessModal = ({ visible, onCancel, account, type, isH5 }) => {
  const cert_desc =
    type === 7
      ? _tHTML('0100d0971fe44000aa8f', { account })
      : _tHTML('88dbbb8774bd4000a20c', { account });

  const onClickTip = (e) => {
    if (!e || !e.target || !e.target.classList) return;
    if (e.target.classList.contains('highlight')) {
      const isInApp = JsBridge.isApp();
      const DEFAULT_MAIN_HOST = window._WEB_RELATION_?.MAINSITE_HOST_COM || window._WEB_RELATION_?.MAIN_HOST_COM;
      const url = addLangToPath(
        `${DEFAULT_MAIN_HOST}/blog/recognizing-phishing-email-traps-and-protecting-your-digital-assets`,
      );
      if (isInApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(url)}`,
          },
        });
      } else {
        window.open(url);
      }
    }
  };

  const renderContent = () => {
    /**
     * 主站才展示“Learn more ...”
     * @see https://klarkchat.sg.larksuite.com/wiki/YIgOwsVVdi3XyxkNEoflyizngMe
     */
    const isGlobalSite = tenant === 'KC';
    return (
      <Content className="dialog-content custom-scrollbar">
        <img src={successSVG} alt="success" className="successImg" />
        <div className="cert-title">{_t('cert.official.channel')}</div>
        <div className="cert-desc">{cert_desc}</div>
        {type === 2 ? (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div className="cert-desc" onClick={onClickTip}>
            { isGlobalSite ? _tHTML('cf2b5ba332684000aeae') : _t('61ac1693dc404800a77b')}
          </div>
        ) : null}
        {/* <div className="cert-desc">{_tHTML('official.channel.tips.v2', { account })}</div> */}
        {(type === 7 && (
          <>
            <div className="cert-divider" />
            <CaseImgDesc />
          </>
        )) ||
          null}
      </Content>
    );
  };

  if (isH5) {
    return (
      <MDialogWrapper
        show={visible}
        title={null}
        onClose={onCancel}
        onOk={onCancel}
        centeredFooterButton
        cancelButtonProps={{ display: 'none' }}
        okText={_t('cert.ok.button')}
        back={false}
        maskClosable
        // height={'65vh'}
      >
        {renderContent()}
      </MDialogWrapper>
    );
  }

  return (
    <DialogWrapper
      open={visible}
      onCancel={onCancel}
      onOk={onCancel}
      centeredFooterButton
      cancelButtonProps={{ display: 'none' }}
      okButtonProps={{ size: 'large' }}
      okText={_t('cert.ok.button')}
      size="medium"
      maskClosable
    >
      {renderContent()}
    </DialogWrapper>
  );
};

export default SuccessModal;
