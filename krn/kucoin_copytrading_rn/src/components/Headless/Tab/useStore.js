import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const TabContext = createContext({});

export const useTabContext = ({onChange, value = ''}) => {
  const [activeKey, setActiveKey] = useState(value);
  const mergeActiveKey = useMemo(() => value || activeKey, [activeKey, value]);

  const changeTab = useCallback(
    tabKey => {
      if (onChange) {
        return onChange(tabKey);
      }
      setActiveKey(tabKey);
    },
    [onChange],
  );

  const createProvider = useCallback(
    items => {
      return createElement(
        TabContext.Provider,
        {
          value: {
            activeKey: mergeActiveKey,
            changeTab,
          },
        },
        items,
      );
    },
    [mergeActiveKey, changeTab],
  );

  return {
    createProvider,
  };
};

export const useStore = () => useContext(TabContext);
