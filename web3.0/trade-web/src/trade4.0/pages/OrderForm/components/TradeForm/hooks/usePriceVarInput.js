/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-16 20:33:20
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-14 16:22:10
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/usePriceVarInput.js
 * @Description:
 */
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { numberFixed, multiplyAndFixed, divide } from 'helper';
import { _t, _tHTML } from 'src/utils/lang';
import Unit from '../components/Unit';
import Form from '@mui/Form';
import DropdownSelect from '@/components/DropdownSelect';
import styled from '@emotion/styled';
import usePair from '@/hooks/common/usePair';
import { validateEmpty, numberFormatter } from '../../../utils';
import { greaterThan, lessThan } from 'src/utils/operation';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { isNil } from 'lodash';

const { useForm, FormItem } = Form;

export const rangeValidator = ({
  value,
  lastPriceVal,
  distanceTypeState,
  currency,
  timeWeightedOrderConfig,
  pricePrecision,
}) => {
  if (isNil(value)) {
    return Promise.resolve();
  }
  const {
    distanceMinPercent = 0.0001, // 下单距离最小比例,
    distanceMaxPercent = 0.05, // 下单距离最大比例
  } = timeWeightedOrderConfig;
  let errorStr = '';
  if (lastPriceVal) {
    if (distanceTypeState === 'FIXED') {
      const max = multiplyAndFixed(lastPriceVal, distanceMaxPercent, pricePrecision, 1);
      const min = multiplyAndFixed(lastPriceVal, distanceMinPercent, pricePrecision, 0);
      if (lessThan(value)(min) || greaterThan(value)(max)) {
        // 挂单价距离盘口需为 0.0001 USDT（市价*0.01%） ~ 3500 USDT （市价*5%）
        errorStr = _t('nCdJAeLANHDjFgFLzeBwjC', {
          min: numberFixed(min, pricePrecision),
          max: numberFixed(max, pricePrecision),
          currency,
        });
      }
    } else if (distanceTypeState === 'PERCENT') {
      const max = multiplyAndFixed(distanceMaxPercent, 100, 2, 1);
      const min = multiplyAndFixed(distanceMinPercent, 100, 2, 0);
      if (lessThan(value)(min) || greaterThan(value)(max)) {
        // 挂单价距离盘口需为 0.01% ~ 5 %
        errorStr = _t('nCdJAeLANHDjFgFLzeBwjC', {
          min,
          max,
          currency: '%',
        });
      }
    }
  }
  return errorStr ? Promise.reject(errorStr) : Promise.resolve();
};

export const DropdownSpan = styled.div`
  display: flex;
  width: 100%;
  height: 32px;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.text};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  .dropdown-value {
    padding-left: 4px;
  }
`;

const UnitWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:first-child {
    margin-right: 8px;
    overflow: visible;
  }
  margin-left: 8px;
`;

export const PiceVarTypeEum = [
  {
    value: 'FIXED',
    label: () => _t('1gsdNTWk5yMBXitcaeACe7'),
  },
  {
    value: 'PERCENT',
    label: () => _t('wKxRPUXMLWDrnpWrZ6Y6jw'),
  },
];
// 比率范围
const usePriceVarInput = (conf) => {
  const { name, setFieldsValue, lastPriceVal, timeWeightedOrderConfig = {}, distanceType } = conf;
  const [distanceTypeState, setPriceVarType] = useState('FIXED');
  const { quoteInfo } = usePair();
  const { currencyName: quoteName } = quoteInfo;
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const { pricePrecision } = currentSymbolInfo;
  const onChange = useCallback(
    (val) => {
      setFieldsValue({
        distanceType: val,
      });
      setPriceVarType(val);
    },
    [setFieldsValue, name],
  );

  useEffect(() => {
    if (distanceType) {
      setPriceVarType(distanceType);
    }
  }, [distanceType]);

  return {
    formItemProps: {
      name,
      rules: [
        {
          validator: validateEmpty,
          validateTrigger: 'onSubmit',
        },
        {
          validator: (_, value) =>
            rangeValidator({
              value,
              lastPriceVal,
              distanceTypeState,
              currency: quoteName,
              timeWeightedOrderConfig,
              pricePrecision,
            }),
        },
      ],
    },
    inputProps: {
      unit: (
        <UnitWrap>
          <Unit coinName={distanceTypeState === 'FIXED' ? quoteName : '%'} />
          <FormItem noStyle name="distanceType">
            <DropdownSpan>
              <DropdownSelect
                configs={PiceVarTypeEum}
                onChange={onChange}
                value={distanceTypeState}
              />
            </DropdownSpan>
          </FormItem>
        </UnitWrap>
      ),
      controls: false,
      precision: distanceTypeState === 'FIXED' ? pricePrecision : 2,
      formatter: numberFormatter,
    },
  };
};

export default usePriceVarInput;
