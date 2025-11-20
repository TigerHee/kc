/*
 * owner: borden@kupotech.com
 */
import React from 'react';
import { useTranslation } from '@tools/i18n';
import { useDispatch } from 'react-redux';
import { styled, useResponsive, useSnackbar, Spin } from '@kux/mui';
import useDebounceFn from '../hooks/common/useDebounceFn';
import { NAMESPACE } from '../config';
import SwapIcon from './SwapIcon';
import { useCurrenciesMap, useFromCurrency, useToCurrency } from '../hooks/form/useStoreValue';

const LineContainer = styled.div`
  position: relative;
  height: 4px;
  background: ${(props) => props.theme.colors.overlay};
`;
const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: ${(props) => props.theme.colors.overlay};
  cursor: pointer;
`;

const InnerContent = styled.div`
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.cover4};
  border: 4px solid ${(props) => props.theme.colors.overlay};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 32px;
    height: 32px;
  }

  svg {
    transform: rotate(90deg);
  }
`;

const StyledSpin = styled(Spin)`
  position: static;
`;

const SwapButton = ({ onClick, ...otherProps }) => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { message } = useSnackbar();
  const { t: _t } = useTranslation('convert');
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const currenciesMap = useCurrenciesMap();

  const { run } = useDebounceFn(
    (pair) => {
      const [newFromCurrency, newToCurrency] = pair;
      const { currencyName: fromCurrencyName, tradeDirection: fromTradeDirection } =
        currenciesMap?.[newFromCurrency] || {};
      const { currencyName: toCurrencyName, tradeDirection: toTradeDirection } =
        currenciesMap?.[newToCurrency] || {};
      if (fromTradeDirection && !['ALL', 'FROM'].includes(fromTradeDirection)) {
        return message.info(_t('248fe41f0ce84000aaa7', { currency: fromCurrencyName }));
      }
      if (toTradeDirection && !['ALL', 'TO'].includes(toTradeDirection)) {
        return message.info(_t('d68e7bc31c2b4800a6cd', { currency: toCurrencyName }));
      }
      const currencyGroup = {
        toCurrency: newToCurrency,
        fromCurrency: newFromCurrency,
      };
      dispatch({
        type: `${NAMESPACE}/updateCurrency`,
        payload: currencyGroup,
      });
      if (onClick) onClick();
      // const fieldName = getOppositionFieldName(preFetchPriceParams.current);
      // fetchPrice({
      //   ...newCurrencies,
      //   [fieldName]: preFetchPriceParams.current.toCurrencySize || preFetchPriceParams.current.fromCurrencySize,
      // });
      // if (params.fromCurrencySize !== params.toCurrencySize) {
      //   const newValue = {
      //     fromCurrencySize: params.toCurrencySize,
      //     toCurrencySize: params.fromCurrencySize,
      //   };
      //   form.setFieldsValue(newValue);
      //   const fields = ['fromCurrencySize', 'toCurrencySize'].filter((v) => !isNil(newValue[v]));
      //   if (fields.length) {
      //     form.validateFields(fields);
      //   }
      // }
    },
    { wait: 500, leading: true },
  );

  return (
    <LineContainer>
      <Content
        onClick={() => (currenciesMap ? run([toCurrency, fromCurrency]) : null)}
        {...otherProps}
      >
        <InnerContent>
          {currenciesMap ? <SwapIcon size={sm ? 16 : 12} /> : <StyledSpin type="normal" />}
        </InnerContent>
      </Content>
    </LineContainer>
  );
};

export default SwapButton;
