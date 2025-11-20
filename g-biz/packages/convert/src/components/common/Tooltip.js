/*
 * owner: Borden@kupotech.com
 */
import { useTranslation } from '@tools/i18n';
import React, { useState, forwardRef } from 'react';
import { styled, Tooltip, Dialog, useResponsive } from '@kux/mui';
import { checkIsMobile } from '../../utils/tools';

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
  const { t: _t } = useTranslation('convert');

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
    <>
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
    </>
  );
});

const MuiTooltip = forwardRef(
  ({ footer, isUsePc, trigger, children, className, disabledOnMobile, ...props }, ref) => {
    const isMobile = checkIsMobile();
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
      <Tooltip ref={ref} trigger={_trigger} className={className} {...props}>
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
