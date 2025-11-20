/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import Popover from 'Bot/components/Common/Popover';
import { _t, _tHTML } from 'Bot/utils/lang';
import ReturnAsset from './ReturnAsset';

/**
 * @description: 显示关闭策略之后,退回币币账户的金额
 * @return {*}
 */
export default ({ children, coupon, transferDetails }) => {
  return (
    <Popover
      placement="top-start"
      content={
        <div className="notDir">
          <div>{_tHTML('clsgrid.backbibi')}</div>
          <div>
            <ReturnAsset transferDetails={transferDetails} coupon={coupon} />
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};
