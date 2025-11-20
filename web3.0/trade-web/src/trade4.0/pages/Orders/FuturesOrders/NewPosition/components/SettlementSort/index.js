/**
 * Owner: clyne@kupotech.com
 */
import { ReactComponent as SettleIcon } from '@/assets/futures/settle-date.svg';
import Text from '@/components/Text';
import useI18n from '@/hooks/futures/useI18n';
import { name as fund } from '@/pages/Fund/config';
import { colors, styled } from '@/style/emotion';
import { useDispatch, useSelector } from 'dva';
import React, { memo } from 'react';
import { useTradeType } from 'src/trade4.0/hooks/common/useTradeType';
import { FUTURES } from 'src/trade4.0/meta/const';
import { namespace } from '../../config';

const Wrapper = styled.span`
  .text-tip {
    color: ${(props) => colors(props, 'complementary')};
    vertical-align: middle;
    border-bottom: none;
    svg {
      color: inherit;
    }
    svg:hover {
      color: inherit;
    }
  }
  .settle-active {
    color: ${(props) => colors(props, 'primary')}!important;
  }
  .icon-settle {
    position: relative;
    top: -2px;
    display: inline-flex;
    box-sizing: content-box;
    width: 16px;
    height: 16px;
    margin-left: 12px;
    line-height: 16px;
    vertical-align: middle;
  }
`;

const SettlementSort = memo(({ isFilter, underline }) => {
  const { _t } = useI18n();
  const active = useSelector((state) => {
    return (state.setting?.inLayoutIdMap || {})[fund];
  });
  const tradeType = useTradeType();
  const isFutures = tradeType === FUTURES;
  const settleFilter = useSelector((state) => state[namespace].settleFilter);
  const classN = settleFilter ? 'settle-active' : '';
  const dispatch = useDispatch();
  const onClick = React.useCallback(async () => {
    await dispatch({
      type: `${namespace}/update`,
      payload: {
        settleFilter: !settleFilter,
      },
    });
  }, [dispatch, settleFilter]);

  // 非仓位不展示
  if (!isFutures || active !== 1) {
    return null;
  }
  return (
    <Wrapper>
      <Text
        cursor="help"
        tooltipClassName={classN}
        underline={underline}
        tips={_t('settlement.position.tips')}
      >
        <SettleIcon className="icon-settle" onClick={onClick} />
      </Text>
    </Wrapper>
  );
});

export default SettlementSort;
