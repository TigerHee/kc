/**
 * Owner: borden@kupotech.com
 */
import React, { useState, useEffect, useContext } from 'react';
import { evtEmitter } from 'helper';
import { APMSWCONSTANTS } from 'utils/apm/apmConstants';
import { useDispatch, useSelector } from 'dva';

const UPDATE_SET = 'update.set';
const SELECT_QUERY = 'select.query';

export default (storeName, initStateProps) => {
  if (typeof storeName !== 'string') {
    throw new Error('invalid storeName');
  }
  const initState = initStateProps || {};
  const emitter = evtEmitter.getEvt(`store.${storeName}.ee`);
  const Context = React.createContext(initState);
  let queryId = 0;
  const queryIdInc = () => {
    queryId += 1;
    if (queryId > 1e8) {
      queryId = 0;
    }
    return queryId;
  };

  return {
    /** Context for use */
    Context,
    /** handler functions*/
    handler: {
      select: (fn) => {
        if (typeof fn !== 'function') {
          return {};
        }
        return new Promise((resolve) => {
          // increase queryId
          const id = queryIdInc();

          // register once
          emitter.once(`${SELECT_QUERY}.${id}`, (state) => {
            resolve(fn(state));
          });
          emitter.emit(SELECT_QUERY, id);
        });
      },
      update: (payload) => {
        return new Promise((resolve) => {
          // increase queryId
          const id = queryIdInc();

          // register once
          emitter.once(`${UPDATE_SET}.${id}`, () => {
            resolve();
          });
          emitter.emit(UPDATE_SET, [id, payload]);
        });
      },
    },
    /** wrap Provider */
    ProviderWrap: ({ children }) => {
      const [state, setState] = useState({
        [storeName]: initState,
      });
      const dispatch = useDispatch();
      const { swFrequency } = useSelector(data => data.collectionSensorsStore);
      useEffect(() => {
        // select query
        const handlerQuery = (id) => {
          emitter.emit(`${SELECT_QUERY}.${id}`, state);
        };
        emitter.on(SELECT_QUERY, handlerQuery);

        // update set
        const handlerSet = ([id, payload]) => {
          setState({
            [storeName]: {
              ...state[storeName],
              ...payload,
            },
          });
          emitter.emit(`${UPDATE_SET}.${id}`);
        };
        emitter.on(UPDATE_SET, handlerSet);
        return () => {
          emitter.off(SELECT_QUERY, handlerQuery);
          emitter.off(UPDATE_SET, handlerSet);
        };
      }, [state]);
      // owen add sensor collection for history order(成交历史 ｜ 历史订单的收集)
      useEffect(() => {
        try {
          if (!swFrequency[APMSWCONSTANTS.DEAL]) {
            swFrequency[APMSWCONSTANTS.DEAL] = {
              mount_trade: 0,
              event_name: APMSWCONSTANTS.TRADE_FLUSH_ANALYSE,
              component: APMSWCONSTANTS.DEAL,
            };
          }
          swFrequency[APMSWCONSTANTS.DEAL].mount_trade += 1;
          dispatch({
            type: 'collectionSensorsStore/collectSwFrequency',
            payload: swFrequency,
          });
        } catch (error) {
          console.error('collectSwSensor-error', error);
        }
      }, [state.dealOrders]);
      // owen add sensor collection for buy-sell order(买卖盘)
      useEffect(() => {
        try {
          if (!swFrequency[APMSWCONSTANTS.L2_Limit50]) {
            swFrequency[APMSWCONSTANTS.L2_Limit50] = {
              mount_trade: 0,
              event_name: APMSWCONSTANTS.TRADE_FLUSH_ANALYSE,
              component: APMSWCONSTANTS.L2_Limit50,
            };
          }
          swFrequency[APMSWCONSTANTS.L2_Limit50].mount_trade += 1;
          dispatch({
            type: 'collectionSensorsStore/collectSwFrequency',
            payload: swFrequency,
          });
        } catch (error) {
          console.error('collectSwSensor-error', error);
        }
      }, [state.openOrders]);
      return (
        <Context.Provider value={state[storeName]}>{children}</Context.Provider>
      );
    },
    /** data Prop Hoc */
    columnStoreHoc: (selector) => {
      if (typeof selector !== 'function') {
        throw new Error('invalid selector');
      }

      return (Component) => (props) => {
        const state = useContext(Context);
        const selectProps = selector({ [storeName]: state }, props);

        return React.createElement(Component, {
          ...props,
          ...selectProps,
        });
      };
    },

    useSelector: (selector) => {
      const state = useContext(Context);
      return selector({ [storeName]: state });
    },
  };
};
