/**
 * Owner: solar.xia@kupotech.com
 */
import { Tooltip } from '@kux/mui';
import { cloneElement, useState } from 'react';
import isMobile from 'src/utils/isMobile';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../hooks';
import { StyledMToolTip } from './styledComponents';

const MToolTip = ({ children, title, header, ...rest }) => {
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
        maskClosable
        cancelText=""
        header={header ? undefined : null}
        title={header}
        showCloseX={false}
        okText={_t('i.know')}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        okButtonProps={{ fullWidth: true }}
        footerProps={{
          style: {
            padding: '8px 24px 32px',
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
  const size = useResponsiveSize();
  const _isMobile = size === 'sm' && isMobile();
  if (!_isMobile) {
    return <Tooltip title={title}>{children}</Tooltip>;
  }
  return (
    <MToolTip title={children} {...rest}>
      {title}
    </MToolTip>
  );
}
