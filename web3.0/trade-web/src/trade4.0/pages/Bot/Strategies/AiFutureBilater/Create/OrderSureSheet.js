/**
 * Owner: mike@kupotech.com
 */
import React, { useState } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { formatNumber } from 'Bot/helper';
import _ from 'lodash';
import { useDispatch } from 'dva';
import Row from 'Bot/components/Common/Row';
import { Text } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import { trackClick } from 'src/utils/ga';
import { submitData, handleLinkClick } from '../config';
import { MIcons } from 'Bot/components/Common/Icon';
import FutureTag from 'Bot/components/Common/FutureTag';
import styled from '@emotion/styled';
// import { CouponRow } from 'strategies/components/Coupon';

const StatementBox = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  > svg,
  .link {
    vertical-align: middle;
  }
  .link {
    cursor: pointer;
    padding-left: 4px;
    text-decoration: underline;
  }
`;
const Layer = ({ dialogRef, setInProp: options, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    symbolInfo: { quota, symbolNameText, precision },
  } = options;

  const onConfirm = () => {
    if (loading) return;
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'confirm',
      resultType: 'WIN_TWO_WAY',
      yesOrNo: !!options.coupon,
    });
    setLoading(true);
    dispatch({
      type: 'BotRunning/runMachine',
      payload: submitData(options),
    })
      .then(() => {
        dialogRef.current.toggle();
        onSuccess();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const onCancel = () => {
    dialogRef.current.toggle();
    trackClick(['confirmCreate', '1'], {
      clickPosition: 'close',
      resultType: 'WIN_TWO_WAY',
      yesOrNo: !!options.coupon,
    });
  };

  if (_.isEmpty(options)) return null;
  return (
    <DialogRef
      title={_t('gridwidget5')}
      ref={dialogRef}
      okText={_t('gridwidget6')}
      cancelText={null}
      onOk={onConfirm}
      onCancel={onCancel}
      okButtonProps={{ loading }}
      size="medium"
    >
      <div className="mb-24">
        <Text color="text60" fs={16} lh="130%">
          {_tHTML('futrgrid.ordersecondsure', {
            amount: formatNumber(options.limitAsset, precision),
            quota,
          })}
        </Text>
      </div>

      <Row
        label={_t('share5')}
        value={
          <Text color="text">
            {symbolNameText}
            &nbsp;
            <FutureTag direction="long" leverage={options.leverage} />
            &nbsp;
            <FutureTag direction="short" leverage={options.leverage} />
          </Text>
        }
      />
      <Row
        label={_t('ueS3e1XQFdMxQuQB6sXnP1')}
        value={options.riskVersion === 1 ? _t('conservative') : _t('radical')}
      />
      <Row
        label={_t('lossstop')}
        value={options.stopLossPercent ? `${options.stopLossPercent}%` : _t('robotparams7')}
      />

      <StatementBox>
        <MIcons.Info color="primary" size={12} />
        <span data-type="link1" onClick={handleLinkClick} className="link">
          {_t('eB9JUQfaikjAJSfELiwJRZ')}
        </span>
        <span className="mr-6 ml-6">&</span>
        <MIcons.Info color="primary" size={12} />
        <span data-type="link2" onClick={handleLinkClick} className="link">
          {_t('99kqXcjkPsczMef5m5YC6i')}
        </span>
      </StatementBox>
    </DialogRef>
  );
};

export default React.memo(Layer);
