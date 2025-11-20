/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import styled from 'emotion/index';

export const LayoutContext = React.createContext({
  siderHook: {
    addSider: () => null,
    removeSider: () => null,
  },
});

export const Header = styled.header`
  height: 64px;
  padding: 0 50px;
  line-height: 64px;
  flex: 0 0 auto;
`;

export const Footer = styled.footer`
  padding: 24px 50px;
  flex: 0 0 auto;
`;

export const Content = styled.main`
  flex: auto;
  min-height: 0;
`;

const BasicLayout = styled.section`
  display: flex;
  flex: auto;
  flex-direction: ${(props) => (props.hasSider ? 'row' : 'column')};
  min-height: 0;
`;

export const Layout = ({ children, hasSider, ...others }) => {
  const [siders, setSiders] = React.useState([]);
  const contextValue = React.useMemo(
    () => ({
      siderHook: {
        addSider: (id) => {
          setSiders((prev) => [...prev, id]);
        },
        removeSider: (id) => {
          setSiders((prev) => prev.filter((currentId) => currentId !== id));
        },
      },
    }),
    [],
  );

  const _hasSider = typeof hasSider === 'boolean' ? hasSider : siders.length > 0;
  return (
    <LayoutContext.Provider value={contextValue}>
      <BasicLayout {...others} hasSider={_hasSider}>
        {children}
      </BasicLayout>
    </LayoutContext.Provider>
  );
};
