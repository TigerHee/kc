/*
 * owner: Borden@kupotech.com
 */
import React, { useState, forwardRef, Fragment } from 'react';
import styled from '@emotion/styled';
import classnames from 'classnames';
import { Tooltip, Dialog } from '@kux/mui';
import { useResponsive } from '@kux/mui/hooks';
// import useIsMobile from '@/hooks/common/useIsMobile';
import { _t } from 'src/utils/lang';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

const StyledTooltip = styled(Tooltip)`
  ${(props) => {
    if (props.size === 'small') {
      return `
        padding: 5px 8px;
        .KuxTooltip-title {
          font-weight: 400;
          font-size: 12px;
        }
      `;
    }
    return '';
  }}
`;
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
  (
    {
      footer,
      isUsePc,
      trigger,
      children,
      className,
      disabledOnMobile,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsH5();
    const { sm } = useResponsive();
    if (!sm && isMobile && !isUsePc) {
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

    const _trigger = isMobile ? 'click' : trigger;

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
      <StyledTooltip
        ref={ref}
        trigger={_trigger}
        className={classnames('kux-trade4-tooltip-root', {
          [className]: !!className,
          'kux-trade4-tooltip-small': props.size === 'small',
        })}
        {...props}
      >
        {_children}
      </StyledTooltip>
    );
  },
);

MuiTooltip.defaultProps = {
  size: 'small',
  isUsePc: false,
  disabledOnMobile: false, // 禁用移动端tooltip的弹出，一般用在children自带click事件的时候
};

export default MuiTooltip;
