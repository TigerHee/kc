/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useMemo, useCallback } from 'react';
import Dropdown from '@mui/Dropdown';
import Input from '@mui/Input';
import Empty from '@mui/Empty';
import { useTheme } from '@kux/mui';
import Virtualized from '@kux/mui/Virtualized';
import { ICSearchOutlined } from '@kux/icons';
import styled from '@emotion/styled';
import Arrow from 'src/trade4.0/components/DropdownSelect/Arrow';
import { Icon } from 'src/trade4.0/components/DropdownSelect/style';
import { _t } from 'Bot/utils/lang';
import { useIsRTL } from '@/hooks/common/useLang';

import { getColors } from 'src/helper';
import { useSelector } from 'dva';
import { debounce } from 'lodash';

const { FixedSizeList, AutoSizer } = Virtualized;
const ALL = 'ALL';


const getName = (value, list) => {
  return list?.find((item) => item.currency === value)?.currencyName || value;
};

const IconPro = styled(Icon)`
  svg {
    fill: ${(props) => props.theme.colors.icon60};
  }
`;

const OverlayWrapper = styled.div`
  display: flex;
  overflow: hidden;
  background: ${getColors('layer')};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  height: 300px;
  flex-direction: column;
`;

export const Text = styled.div`
  display: flex;
  color: ${(props) => props.theme.colors.text};
  background-color: transparent;
  padding: 0 2px 0 16px;
  cursor: pointer;
  font-size: 12px;
`;

const Container = styled.div`
  flex: 1;
`;

const Row = styled.div`
  height: 38px;
  padding: 0 16px;
  font-size: 12px;
  color: ${getColors('text')};
  display: flex;
  align-items: center;
  font-weight: 500;
  cursor: pointer;

  &.active {
    color: ${getColors('primary')};
  }

  &:hover {
    background-color: ${getColors('cover4')};
  }
`;

const handleSort = (lists) => {
  return lists.sort((a, b) => {
    if (a.currencyName < b.currencyName) {
      return -1;
    }
    if (a.currencyName > b.currencyName) {
      return 1;
    }
    return 0;
  });
};

const Overlay = (props) => {
  const { value, list, onSelect } = props;
  const theme = useTheme();
  const [search, setSearch] = useState();
  const isRTL = useIsRTL();

  const handleSearchChange = debounce(
    useCallback((e) => {
      setSearch(e?.target?.value?.trim()?.toUpperCase());
    }, []),
    300,
  );

  const filterd = useMemo(() => {
    if (!search) {
      return list;
    }
    return list.filter(({ currencyName }) => currencyName?.toUpperCase()?.includes(search));
  }, [search, list]);

  return (
    <OverlayWrapper>
      <Input
        addonBefore={<ICSearchOutlined color={theme.colors.icon60} />}
        width={248}
        allowClear
        style={{ margin: '16px 16px 4px' }}
        onChange={handleSearchChange}
        placeholder={_t('gridwidget4')}
        size="small"
      />
      <Container>
        {filterd.length ? (
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                className="List"
                height={height}
                itemCount={filterd.length}
                itemSize={38}
                width={width}
                direction={isRTL ? 'rtl' : 'ltr'}
              >
                {({ index, style }) => {
                  const currency = filterd[index];
                  return (
                    <Row
                      style={style}
                      onClick={() => onSelect(currency.currency)}
                      className={value === currency.currency ? 'active' : ''}
                    >
                    {currency.currencyName}
                    </Row>
                  );
                }}
              </FixedSizeList>
            )}
          </AutoSizer>
        ) : (
          <Empty />
        )}
      </Container>
    </OverlayWrapper>
  );
};

/**
 * CoinSelect
 */
const CoinSelect = memo((props) => {
  const { value, onChange, ...restProps } = props;
  const [visible, setVisible] = useState(false);
  const conins = useSelector((state) => state.coins.list);
  const ALL_ITEM = {
    currency: ALL,
    currencyName: _t('allcoin'),
  };
  const list = [ALL_ITEM, ...handleSort(conins)];

  const handlevisibleChange = (v) => {
    setVisible(v);
  };

  const handleSelect = (v) => {
    onChange && onChange(v);
    setVisible(false);
  };

  return (
    <Dropdown
      {...restProps}
      trigger="click"
      height="auto"
      contentPadding={0}
      title={_t('smart.choosecoin')}
      visible={visible}
      onVisibleChange={handlevisibleChange}
      overlay={<Overlay list={list} onSelect={handleSelect} value={value} />}
    >
      <Text>{getName(value, list)}</Text>
      <IconPro isActive={visible}>
        <Arrow />
      </IconPro>
    </Dropdown>
  );
});

export default CoinSelect;
