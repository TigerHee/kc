/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { MIcons } from 'Bot/components/Common/Icon';
import { Text, Flex, Div } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';
import Search from 'Bot/components/Common/Search';
import Button from '@mui/Button';
import styled from '@emotion/styled';
import { Tabs } from '@mui/Tabs';
import CoinTable from './CoinTable';
import { useDispatch, useSelector, shallowEqual } from 'dva';
import useStateRef from '@/hooks/common/useStateRef';
import AutoSizer from 'react-virtualized-auto-sizer';
import { mostCoinNum } from 'SmartTrade/config';
import CoinCodeToName from '@/components/CoinCodeToName';
import { useMediaQuery } from '@kux/mui/hooks';
import isEmpty from 'lodash/isEmpty';

const { Tab } = Tabs;
const MTabs = styled(Tabs)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  padding-left: 12px;
  .bot-create-float-wrapper & {
    div.KuxTabs-scrollButtonBg {
      background: none;
    }
    .KuxTabs-scrollButton {
      background: ${({ theme }) => theme.colors.layer};
    }
  }
`;
const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.divider8};
  padding: 12px;
`;

const Nav = ({ controlRef }) => {
  const close = () => {
    controlRef.current.close();
  };
  return (
    <Flex mt={12} mb={12}>
      <Flex vc onClick={close} cursor fs={12}>
        <MIcons.ArrowLeft color="icon" size="12" />
        <Text pl={4} color="text">
          {_t('coinadd')}
        </Text>
      </Flex>
    </Flex>
  );
};
const FullHeight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;
const Grow = styled.div`
  flex: 1;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.cover4};
  padding: 2px 4px;
  cursor: pointer;
  margin-right: 4px;
  margin-bottom: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover8};
  }
`;
const CoinTag = ({ coin, onDel }) => {
  return (
    <Tag onClick={() => onDel(coin)}>
      <Text fs={12} color="text60" mr={2}>
        <CoinCodeToName coin={coin} />
      </Text>
      <MIcons.Close size={12} color="icon60" />
    </Tag>
  );
};
const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 6px;
`;
const CoinSelected = React.memo(({ reducerName }) => {
  const dispatch = useDispatch();
  const createTargetCoins = useSelector((state) => state.smarttrade[reducerName]);
  const deleteCoin = useCallback((baseCurrency) => {
    dispatch({
      type: `smarttrade/deleteCoinPosition`,
      payload: {
        currency: baseCurrency,
        reducerName,
      },
    });
  }, []);
  return (
    <FlexWrap>
      {createTargetCoins.map((coin) => {
        return <CoinTag coin={coin} onDel={deleteCoin} key={coin} />;
      })}
    </FlexWrap>
  );
});
const FixedFooter = ({ children }) => {
  return <Footer>{children}</Footer>;
};
const selfChoose = 'collectionSymbol';
/**
 * @description:
 * @param {*} controlRef
 * @param {enum} mode (create, update)
 * @param {enum} reducerName (createTargetCoins, updateTargetCoins)
 * @return {*}
 */
const PickerCoin = ({ controlRef, mode = 'create', reducerName }) => {
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = useState('');
  const onSearchChange = useCallback((e) => {
    e = e.target.value;
    setSearchKey(e.toUpperCase());
  }, []);
  const onConfirm = useCallback(() => {
    controlRef.current.close();
  }, []);
  const tabChangeHandle = useCallback((e, val) => {
    setSearchKey('');
    dispatch({
      type: 'smarttrade/updateCoinSelect',
      payload: {
        area: val,
      },
    });
  }, []);
  const {
    symbolsAreas,
    displayNameMap,
    allSymbolsMap,
    area: tabValue,
  } = useSelector((state) => state.smarttrade.coinSelect, shallowEqual);
  const createTargetCoins = useSelector((state) => state.smarttrade[reducerName]);

  const dataSource = useMemo(() => {
    const source = allSymbolsMap[tabValue] ?? [];
    if (!searchKey) return source;
    return source.filter((row) => row.baseCurrency?.includes(searchKey));
  }, [tabValue, searchKey, allSymbolsMap]);

  const createTargetCoinsRef = useStateRef(createTargetCoins);

  useEffect(() => {
    dispatch({
      type: 'smarttrade/getCoinLists',
    });
  }, []);
  const onselect = useCallback((baseCurrency) => {
    const isSelected = createTargetCoinsRef.current.includes(baseCurrency);
    const nowSelected = !isSelected;
    if (nowSelected) {
      if (createTargetCoinsRef.current.length >= mostCoinNum) {
        // return message.error();
        return;
      }
    }
    dispatch({
      type: `smarttrade/${!isSelected ? 'addCoinPosition' : 'deleteCoinPosition'}`,
      payload: {
        currency: baseCurrency,
        reducerName,
      },
    });
  }, []);
  const isH5 = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <FullHeight>
      <Div pl={12} pr={12} className="bot-smart-search">
        {mode === 'create' && <Nav controlRef={controlRef} />}
        <Search
          placeholder={_t('gridwidget4')}
          value={searchKey}
          onChange={onSearchChange}
          size="small"
        />
      </Div>
      <MTabs value={tabValue} onChange={tabChangeHandle} size="small" className="bot-smart-tabs">
        {symbolsAreas.map((name) => {
          const label = name === selfChoose ? _t('selfchoose') : displayNameMap[name];
          return <Tab label={label} value={name} key={name} />;
        })}
      </MTabs>
      <Grow>
        <AutoSizer disableWidth>
          {({ height }) => {
            return (
              <CoinTable
                reducerName={reducerName}
                dataSource={dataSource}
                onselect={onselect}
                loading={isEmpty(allSymbolsMap)}
                y={height - 33}
              />
            );
          }}
        </AutoSizer>
      </Grow>
      {(mode === 'update' ? isH5 : true) && (
        <FixedFooter>
          <CoinSelected reducerName={reducerName} />
          <Button variant="contained" onClick={onConfirm} type="primary" fullWidth>
            {_t('gridwidget6')}
            &nbsp;
            {_t('selected', {
              count: createTargetCoins.length ?? 0,
            })}
          </Button>
        </FixedFooter>
      )}
    </FullHeight>
  );
};

export default PickerCoin;
