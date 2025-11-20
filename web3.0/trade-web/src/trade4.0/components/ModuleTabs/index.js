/*
 * owner: borden@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import { useDispatch } from 'dva';
import styled from '@emotion/styled';
import { map, noop } from 'lodash';
import { Tabs } from '@mui/Tabs';
import { _t, _tHTML } from 'src/utils/lang';
import { FUTURE_MODULE_MAP } from 'src/trade4.0/meta/futures';
import { isFuturesNew } from 'src/trade4.0/meta/const';

const { Tab } = Tabs;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.overlay};
  ${(props) => props.theme.breakpoints.up('lg')} {
    border-radius: 4px;
  }
`;
const Header = styled.header`
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
  .KuxTabs-container {
    height: 40px;
    .KuxTabs-scroller {
      display: flex;
      align-items: center;
    }
    .KuxTabs-Container {
      &[role='tablist'] {
        padding: unset;
      }
    }
  }
`;

const Content = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

const ModuleTabs = React.memo(({ tabs = [] }) => {
  const dispatch = useDispatch();
  const isFuturesAB = isFuturesNew();

  const [active, setActive] = useState(0);

  const { id, getComponent = noop, ...other } = tabs[active] || {};

  const handleChange = useCallback(
    (e, v) => {
      dispatch({
        type: 'setting/updateInLayoutIdMap',
        payload: {
          [id]: 0,
          [tabs[v].id]: 1,
        },
      });
      setActive(v);
    },
    [dispatch, id, tabs],
  );

  return (
    <Container>
      <Header>
        <Tabs size="xsmall" value={active} onChange={handleChange} variant="line">
          {map(tabs, (item, index) => {
            const { id: _id, renderName } = item || {};
            // 合约module
            const isFuture = FUTURE_MODULE_MAP[_id];
            // 合约开关关闭 且它是合约module
            if (_id === undefined || (!isFuturesAB && isFuture)) {
              return null;
            }
            return <Tab key={_id} label={renderName()} value={index} />;
          })}
        </Tabs>
      </Header>
      <Content>{getComponent({ id, ...other })}</Content>
    </Container>
  );
});

export default ModuleTabs;
