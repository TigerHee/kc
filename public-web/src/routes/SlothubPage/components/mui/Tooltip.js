/*
 * owner: Borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Dialog, styled, ThemeProvider, Tooltip } from '@kux/mui';
import { useResponsive } from '@kux/mui/hooks';
import classnames from 'classnames';
import NoSSG from 'components/NoSSG';
import React, { forwardRef, Fragment, useState } from 'react';
import { _t } from 'src/tools/i18n';

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
  ${(props) => {
    if (!props.isUseH5) {
      return `
        .KuxModalHeader-root {
          min-height: unset !important;
          padding: 32px 24px ${props.title ? 12 : 0}px !important;
        }
        .KuxDialog-body {
          max-width: 319px;
        }
        .KuxDialog-content {
          padding: 0 24px;
        }
      `;
    }
    return '';
  }}
`;

const MTooltip = React.memo((props) => {
  const { title, dialogTitle, disabledOnMobile, children, isUseH5, ...otherProps } = props;
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
      <NoSSG>
        <StyledDialog
          open={open}
          maskClosable
          cancelText=""
          isUseH5={isUseH5}
          showCloseX={isUseH5}
          okText={_t('i.know')}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          okButtonProps={{ fullWidth: true }}
          footerProps={{
            style: {
              padding: '24px 24px 32px 24px',
            },
          }}
          title={dialogTitle}
          {...otherProps}
        >
          {title}
        </StyledDialog>
      </NoSSG>
      {childrenBox}
    </Fragment>
  );
});

const MuiTooltip = forwardRef(
  (
    {
      footer,
      isUsePc,
      isUseH5,
      trigger,
      children,
      className,
      disabledOnMobile,
      dialogTitle,
      ...props
    },
    ref,
  ) => {
    const { sm } = useResponsive();
    const isInApp = JsBridge.isApp();
    if (isUseH5 || ((!sm || isInApp) && !isUsePc)) {
      return (
        <MTooltip
          footer={footer}
          title={props.title}
          className={className}
          dialogTitle={dialogTitle}
          disabledOnMobile={disabledOnMobile}
          isUseH5={!sm && !isUsePc ? false : isUseH5}
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
      <ThemeProvider theme="dark">
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
      </ThemeProvider>
    );
  },
);

MuiTooltip.defaultProps = {
  // size: 'small',
  isUsePc: false,
  isUseH5: false,
  disabledOnMobile: false, // 禁用移动端tooltip的弹出，一般用在children自带click事件的时候
};

export default MuiTooltip;
