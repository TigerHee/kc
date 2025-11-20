/*
 * owner: borden@kupotech.com
 */
import React, { useMemo } from 'react';
import { styled, Select, useEventCallback } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_TYPE_LIST, NAMESPACE, ORDER_TYPE_MAP } from '../../config';
import AccountOption from './AccountOption';
import { useFromCurrency, useToCurrency } from '../../hooks/form/useStoreValue';

const StyledSelect = styled(Select)`
  /* padding: 8px 0; */
  .KuxSelect-itemLabel {
    font-size: 13px;
    line-height: 130%;
    font-weight: 500;
  }
`;

const FundingAccount = () => {
  const dispatch = useDispatch();
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  const pullPositionEffectName = ORDER_TYPE_MAP[orderType]?.pullPositionEffectName;
  const loading = useSelector((state) =>
    pullPositionEffectName
      ? state.loading.effects[`${NAMESPACE}/${pullPositionEffectName}`]
      : false,
  );

  const options = useMemo(() => {
    return ACCOUNT_TYPE_LIST.map(({ label, value }) => {
      const balance = positions?.[value]?.[fromCurrency];
      return {
        value,
        label: (isInSelectInput, selected) => {
          if (isInSelectInput) {
            return label();
          }
          return (
            <AccountOption
              key={value}
              label={label()}
              value={balance}
              coin={fromCurrency}
              selected={selected}
            />
          );
        },
      };
    });
  }, [fromCurrency, positions]);

  const handleChange = useEventCallback((v) => {
    if (!pullPositionEffectName) return;
    dispatch({
      type: `${NAMESPACE}/${pullPositionEffectName}`,
      payload: {
        accountType: v,
        currencies: [toCurrency],
      },
    });
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        accountType: v,
      },
    });
  });

  const handleDropDownVisibleChange = useEventCallback((visible) => {
    if (visible && pullPositionEffectName) {
      dispatch({
        type: `${NAMESPACE}/${pullPositionEffectName}`,
        payload: {
          currencies: [fromCurrency],
          accountType: 'BOTH',
        },
      });
    }
  });

  return (
    <StyledSelect
      noStyle
      size="small"
      loading={loading}
      options={options}
      value={accountType}
      listItemHeight={58}
      onChange={handleChange}
      style={{ width: '100%' }}
      onDropDownVisibleChange={handleDropDownVisibleChange}
    />
  );
};

export default React.memo(FundingAccount);
