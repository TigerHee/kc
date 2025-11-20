/**
 * owner: larvide.peng@kupotech.com
 */
import { ICInfoOutlined } from '@kux/icons';
import { useColor, useResponsive } from '@kux/mui';
import { useState } from 'react';
import historyTooltipBkg from 'static/slothub/history-tooltip-bkg.svg';
import { _t } from 'tools/i18n';
import { ExpiredDescDialog, TooltipWrapper } from './styled';

const Tooltip = ({ expiringPoints, effectiveDays }) => {
  const { sm } = useResponsive();
  const colors = useColor();
  const [show, setShow] = useState(false);

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <TooltipWrapper img={historyTooltipBkg} onClick={handleOpen}>
        <span className="text">{_t('dc27a1def0fc4000a4cf', { x: expiringPoints })}</span>
        <ICInfoOutlined size={12} color={colors.icon} />
      </TooltipWrapper>
      <ExpiredDescDialog
        title={_t('dd33edcdff484000a5ab')}
        open={show}
        okText={_t('87135cebc25e4000aaab')}
        onOk={handleClose}
        onCancel={handleClose}
        cancelText={null}
        centeredFooterButton={true}
        showCloseX={!!sm}
        header={!sm && null}
      >
        {_t('ccc47d6eae6b4000a51b', { a: `${effectiveDays} × 24` })}
      </ExpiredDescDialog>
    </>
  );
};

export default Tooltip;
