/**
 * Owner: jessie@kupotech.com
 */
import { Dialog, styled, Tooltip, useResponsive } from '@kux/mui';
import { cloneElement, useState } from 'react';
import { _t } from 'tools/i18n';

const StyledMToolTip = styled(Dialog)`
  .KuxDialog-body {
    max-width: calc(100% - 32px);
    max-width: 320px;

    .KuxModalHeader-root {
      min-height: unset;
      padding: 24px 24px 16px;
      font-size: 20px;

      .KuxModalHeader-close {
        top: 24px;
        right: 24px;
        width: 28px;
        height: 28px;
      }
    }

    .KuxDialog-content {
      padding: ${({ title }) => (title ? '0 24px 24px' : '32px 24px 24px')};
      color: ${(props) => props.theme.colors.text60};
      font-weight: 400;
      font-size: 16px;
      font-style: normal;
      line-height: 150%;
    }
  }
`;

const MToolTip = ({ children, title, header, maskClosable=true, showCloseX= false, ...rest }) => {
  const [open, setOpen] = useState(false);
  const childrenBox = cloneElement(title, {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    },
  });
  return (
    <>
      <StyledMToolTip
        open={open}
        maskClosable={maskClosable}
        cancelText=""
        header={header ? undefined : null}
        title={header}
        showCloseX={showCloseX}
        okText={_t('i.know')}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okButtonProps={{ fullWidth: true }}
        footerProps={{
          style: {
            padding: '0 24px 32px',
          },
        }}
        {...rest}
      >
        {children}
      </StyledMToolTip>
      {childrenBox}
    </>
  );
};

export default function WrapperToolTip({ children, title, ...rest }) {
  const { sm } = useResponsive();
  if (sm) {
    return <Tooltip title={title}>{children}</Tooltip>;
  }
  return (
    <MToolTip title={children} {...rest}>
      {title}
    </MToolTip>
  );
}
