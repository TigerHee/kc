/*
 * owner: june.lee@kupotech.com
 */
import { filter, reduce } from 'lodash';
import { useTranslation } from '@tools/i18n';
import { useDispatch, useSelector } from 'react-redux';
import React, { useMemo, useState, useEffect } from 'react';
import { styled, useTheme, useEventCallback, css } from '@kux/mui';
import { ICArrowDownOutlined } from '@kux/icons';
import { NAMESPACE } from '../../config';
import CoinIcon from '../../components/common/CoinIcon';
import CoinCodeToName from '../../components/common/CoinCodeToName';
import CoinSelectDialog from '../../components/common/CoinSelectDialog';
import useContextSelector from '../../hooks/common/useContextSelector';
import { useCurrencies } from '../../hooks/form/useStoreValue';

const FlexBox = styled.div`
  display: flex;
  align-items: center;
`;
const Container = styled(FlexBox)`
  height: 40px;
  ${(props) =>
    !props.readOnly
      ? css`
          cursor: pointer;
        `
      : ''}
  padding: 8px;
  border-radius: 24px;
  justify-content: space-between;
  flex-direction: row-reverse;
  border: 1px solid ${(props) => props.theme.colors.cover8};
  background-color: ${(props) => props.theme.colors.overlay};

  .biz-convert-CurrencySelect-coinName {
    max-width: 98px;
    font-size: 18px;
    font-weight: 500;
    margin-left: 6px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: ${(props) => props.theme.colors.text};

    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-left: 4px;
      font-size: 16px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 35px;
    font-size: 16px;
    padding: 6px;
  }
`;
const ArrowIcon = styled(ICArrowDownOutlined)`
  margin-left: 4px;
`;

const getTag = (v) => {
  if (v?.marginMark && v.marginMark !== 'NO_MARGIN') {
    return v.marginMark;
  }
  return v?.tag;
};

const StakingCurrencySelect = ({
  value,
  onChange,
  checkItem,
  tradeDirection,
  updateAtOpen = true,
  readOnly: readOnlyFromProps = false,
  ...otherProps
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t: _t } = useTranslation('convert');
  const isLogin = useContextSelector((state) => Boolean(state.user));
  const currencies = useCurrencies();
  const loading = useSelector(
    (state) => state.loading.effects[`${NAMESPACE}/queryStakingCurrencyList`],
  );

  const [open, setOpen] = useState(false);

  const { hots, list: currencyList, map: currencyMap } = useMemo(() => {
    const filterFn = (item) => {
      const ret = !item?.tradeDirection || ['ALL', tradeDirection].includes(item.tradeDirection);
      if (!open || typeof checkItem !== 'function') {
        return ret;
      }
      return ret && checkItem(item);
    };
    const { list, map } = reduce(
      currencies?.currencies,
      (a, b) => {
        if (filterFn(b)) {
          a.list.push(b);
          a.map[b.currency] = b;
        }
        return a;
      },
      { list: [], map: {} },
    );
    const hots = filter(currencies?.hots, (item) => map[item]);
    return { list, map, hots };
  }, [open, tradeDirection, currencies, checkItem]);

  const readOnly =
    readOnlyFromProps || (currencyList.length === 1 && currencyList[0].currency === value);

  useEffect(() => {
    if (open && updateAtOpen) {
      dispatch({
        type: `${NAMESPACE}/queryStakingCurrencyList`,
        isInit: !isLogin, // 未登录的时候不用重复拉取
      });
    }
  }, [dispatch, isLogin, open, updateAtOpen]);

  const onOpen = useEventCallback(() => {
    if (readOnly) {
      return;
    }
    setOpen(true);
  });

  const onCancel = useEventCallback(() => {
    setOpen(false);
  });

  return (
    <>
      <Container
        readOnly={readOnly}
        onClick={onOpen}
        {...otherProps}
        data-inspector={`convert_${tradeDirection.toLowerCase()}_selector_trigger`}
      >
        {readOnly ? null : <ArrowIcon size={16} color={theme.colors.icon60} />}
        <FlexBox>
          <CoinIcon coin={value} size={22} icon={currencyMap[value]?.icon} />
          <div className="biz-convert-CurrencySelect-coinName">
            <CoinCodeToName coin={value} />
          </div>
        </FlexBox>
      </Container>
      <CoinSelectDialog
        open={open}
        value={value}
        getTag={getTag}
        onChange={onChange}
        onCancel={onCancel}
        currencyMap={currencyMap}
        currencyList={currencyList}
        loading={loading && !currencies}
        {...(isLogin ? { amountKey: 'availableBalance' } : null)}
      />
    </>
  );
};

export default React.memo(StakingCurrencySelect);
