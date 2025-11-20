/**
 * Owner: jessie@kupotech.com
 */
import { ICQuestionOutlined } from '@kux/icons';
import { Button, Tooltip } from '@kux/mui';
import { cloneElement, useMemo, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { useResponsiveSize } from '../../hooks';
import {
  StyledMToolTip,
  StyledTooltipContent,
  StyledTooltipFooter,
  StyledTooltipLabel,
} from './styledComponent';

export function MToolTip({ title, children }) {
  const [open, setOpen] = useState(false);
  const childrenBox = cloneElement(title, {
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
    },
  });

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledMToolTip
        open={open}
        showCloseX={true}
        maskClosable
        title={_t('iuDRyxRoWafb3KvU3KNdmj')}
        onCancel={() => setOpen(false)}
        footer={
          <StyledTooltipFooter>
            <Button onClick={onClose}>{_t('confirm')}</Button>
          </StyledTooltipFooter>
        }
      >
        {children}
      </StyledMToolTip>
      {childrenBox}
    </>
  );
}

export default function WrapperToolTip() {
  const size = useResponsiveSize();
  const taxTips = useSelector((state) => state.aptp.taxTips);

  const _isMobile = size === 'sm';
  const title = useMemo(() => {
    return <StyledTooltipContent>{taxTips || _t('common_tax_tips')}</StyledTooltipContent>;
  }, [taxTips]);

  if (!_isMobile) {
    return (
      <Tooltip title={title}>
        <StyledTooltipLabel>
          <ICQuestionOutlined />
        </StyledTooltipLabel>
      </Tooltip>
    );
  }
  return <MToolTip title={<ICQuestionOutlined />}>{title}</MToolTip>;
}
