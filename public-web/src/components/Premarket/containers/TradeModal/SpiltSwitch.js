/**
 * Owner: jessie@kupotech.com
 */
import { ICQuestionOutlined } from '@kux/icons';
import { Switch } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import Tooltip from '../../components/Tooltip';
import { lessThan } from '../../util';
import { StyledSplitSwitch } from './styledComponent';

// 吃单
export default function SpiltSwitch({ totalFuns, price }) {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const splitInfo = useSelector((state) => state.aptp.splitInfo, shallowEqual);
  const { orderFunds = 0, orderPrice = 0, splitOrderEnabled } = splitInfo || {};

  const handleStatus = (status) => {
    setOpen(status);
  };

  const enableSplitShow = useMemo(() => {
    if (!splitOrderEnabled) {
      return false;
    }
    return (
      totalFuns >= 0 &&
      price >= 0 &&
      !lessThan(totalFuns, orderFunds) &&
      !lessThan(price, orderPrice)
    );
  }, [orderFunds, orderPrice, totalFuns, price, splitOrderEnabled]);

  useEffect(() => {
    dispatch({
      type: 'aptp/update',
      payload: {
        enableSplit: enableSplitShow && open,
      },
    });
  }, [enableSplitShow, open, dispatch]);

  if (!enableSplitShow) return null;

  return (
    <StyledSplitSwitch>
      <div className="title">
        <div className="name">
          {_t('faba9dba44bd4000a8bf')}
          <Tooltip title={_t('3f885cb02a364000a472')}>
            <ICQuestionOutlined />
          </Tooltip>
        </div>
        <Switch size="small" checked={open} onChange={handleStatus} />
      </div>
    </StyledSplitSwitch>
  );
}
