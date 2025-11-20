/*
 * owner: jessie@kupotech.com
 */
import { Dialog, styled, Tooltip, useResponsive } from '@kux/mui';
import React, { forwardRef, Fragment, useState } from 'react';
import { _t } from 'tools/i18n';

const StyledDialog = styled(Dialog)`
  .KuxDialog-body {
    max-width: 80%;
  }
  .KuxDialog-content {
    padding: 24px;
  }
`;

const MTooltip = React.memo((props) => {
  const { title, disabledOnMobile, children, ...otherProps } = props;
  const [open, setOpen] = useState(false);

  const childrenBox = React.cloneElement(children, {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    },
  });

  if (disabledOnMobile) {
    return children;
  }
  return (
    <Fragment>
      <StyledDialog
        open={open}
        maskClosable
        cancelText=""
        header={null}
        showCloseX={false}
        okText={_t('i.know')}
        onOk={() => setOpen(false)}
        okButtonProps={{ fullWidth: true }}
        footerProps={{
          style: {
            padding: '8px 24px 32px',
          },
        }}
        {...otherProps}
      >
        {title}
      </StyledDialog>
      {childrenBox}
    </Fragment>
  );
});

const MuiTooltip = forwardRef(
  ({ footer, isUsePc, trigger, children, className, disabledOnMobile, ...props }, ref) => {
    const { sm } = useResponsive();
    if (!sm && !isUsePc) {
      return (
        <MTooltip
          className={className}
          footer={footer}
          title={props.title}
          disabledOnMobile={disabledOnMobile}
        >
          {children}
        </MTooltip>
      );
    }

    const _trigger = !sm ? 'click' : trigger;

    const _children =
      _trigger === 'click'
        ? React.cloneElement(children, {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (children.props.onClick) children.props.onClick(e);
            },
          })
        : children;
    return (
      <Tooltip ref={ref} trigger={_trigger} {...props}>
        {_children}
      </Tooltip>
    );
  },
);

MuiTooltip.defaultProps = {
  isUsePc: false,
  disabledOnMobile: false, // 禁用移动端tooltip的弹出，一般用在children自带click事件的时候
};

export default MuiTooltip;
