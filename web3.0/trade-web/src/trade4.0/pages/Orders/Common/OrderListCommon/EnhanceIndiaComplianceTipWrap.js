/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-04 17:15:34
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-07-01 17:23:58
 * @FilePath: /trade-web/src/trade4.0/pages/Orders/Common/OrderListCommon/EnhanceIndiaComplianceTipWrap.js
 * @Description:
 */
import React, { memo, useCallback } from 'react';
import { useSelector } from 'dva';
import { useToggle } from 'ahooks';
import { Dialog, Button } from '@kux/mui';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';
import { _t, _tHTML } from 'utils/lang';

import {
  InfoIcon,
  StyledTooltip,
  Wrap,
} from './EnhanceIndiaComplianceTipWrap.style';

export const TooltipContent = () => {
  const complianceTaxText = useSelector((state) => state.app.complianceTaxText);
    return (
      <div className="fs-12">
        <div>{complianceTaxText || _t('common_tax_tips')}</div>
      </div>
    );
  };

const EnhanceIndiaComplianceTipWrap = ({ children, taxRate }) => {
  const isMobile = useIsH5();
  const [visible, { toggle }] = useToggle();

  const handleOpenTipDialog = useCallback(() => isMobile && toggle(), [isMobile, toggle]);
  const complianceTaxText = useSelector((state) => state.app.complianceTaxText);

  return (
    <>
      {isMobile ? (
        <Wrap>
        <InfoIcon onClick={handleOpenTipDialog} />
        {children}
      </Wrap>
      ) : (
        <Wrap>
        <StyledTooltip title={<TooltipContent />} maxWidth={300}>
          <InfoIcon onClick={handleOpenTipDialog} pcSize />
        </StyledTooltip>
        {children}
      </Wrap>
      )}
      {isMobile && (
        <Dialog
          open={visible}
          onCancel={toggle}
          onOk={toggle}
          size="basic"
          title={_t('jupnbpN1kasi52ewvTzf4N')}
        >
          <span> {complianceTaxText || _t('common_tax_tips')}</span>
        </Dialog>
      )}
    </>
  );
};

export default memo(EnhanceIndiaComplianceTipWrap);
