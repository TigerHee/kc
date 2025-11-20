/**
 * Owner: charles.yang@kupotech.com
 */
import React from 'react';

import { _t } from 'utils/lang';

import PrettySize from '@/pages/Orders/FuturesOrders/components/PrettySize';
import Text from '@/components/Text';
import { ICEyeOpenOutlined } from '@kux/icons';

const HiddenSize = ({ symbol, hidden, visibleSize }) => {
  if (!hidden) return null;

  return (
    <Text underline={false} tips={_t('orderActive.hidden.tip')}>
      <>
        <br />
        <PrettySize symbol={symbol} value={visibleSize} />
        <ICEyeOpenOutlined style={{ verticalAlign: 'middle' }} />
      </>
    </Text>
  );
};

export default React.memo(HiddenSize);
