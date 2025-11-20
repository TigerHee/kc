/**
 * Owner: willen@kupotech.com
 */
import { BoardWithdraw } from 'components/Assets/Withdraw/Board';
import SecuritySetting from 'components/SecuritySetting';
import React from 'react';

import { injectLocale } from 'src/components/LoadLocale';
import { _t } from 'tools/i18n';

@injectLocale
export default class ProtectWithDraw extends React.Component {
  render() {
    const { tip, title, hideBtn } = this.props;
    return (
      <BoardWithdraw title={title} hideBtn={hideBtn} isCard={false} titleLeft={true} hideWithdraw>
        {/* <AccountHeader title={_t('subaccount.subaccount')} /> */}
        <SecuritySetting tip={tip || _t('withdrawal.requirement')} />
      </BoardWithdraw>
    );
  }
}
