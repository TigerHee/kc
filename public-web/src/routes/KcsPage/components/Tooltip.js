/**
 * Owner: chris@kupotech.com
 */
import { Button, Dialog, styled, Tooltip } from '@kux/mui';
import { cloneElement, Fragment, useContext, useState } from 'react';
import { _t } from 'src/tools/i18n';
import Context from './Context';

const Dialogs = styled(Dialog)`
  .KuxDialog-body {
    padding: 32px 24px;
  }
  .KuxDialog-content {
    padding: 0px 0px 24px;
  }
`;

const Buttons = styled(Button)`
  background: ${({ theme }) => theme.colors.text};
  &:hover {
    background: ${({ theme }) => theme.colors.text};
  }
`;

const Tip = ({ title = '', children }) => {
  const { isSm } = useContext(Context);
  const [show, setShow] = useState(false);
  const showHandle = (e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }
    setShow(!show);
  };
  if (!title) return null;
  if (isSm)
    return (
      <Fragment>
        {cloneElement(children, { onClick: showHandle })}
        <H5Tip title={title} visible={show} onClose={showHandle} />
      </Fragment>
    );
  return (
    <Tooltip title={title}>
      {cloneElement(children, { onClick: showHandle })}
      {/* <ICInfoOutlined className="ml-4 help" size={12} /> */}
    </Tooltip>
  );
};

// 用于卡片 info 点击
export const H5Tip = ({ title, visible, onClose }) => {
  return (
    <Dialogs
      header={null}
      footer={
        <Buttons onClick={onClose} fullWidth>
          {_t('confirm')}
        </Buttons>
      }
      cancelText={null}
      open={visible}
      onCancel={onClose}
      onOk={onClose}
      maskClosable
    >
      <div className="tip">{title}</div>
    </Dialogs>
  );
};

export default Tip;
