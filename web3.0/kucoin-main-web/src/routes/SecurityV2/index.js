/**
 * Owner: brick.fan@kupotech.com
 */

import { styled } from '@kux/mui';
import React from 'react';
import Content from './Content';
import Header from './Header';
import Partners from './Partners';
import News from './News';
import Helper from './Helper';
import { tenantConfig } from 'config/tenant';

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundMajor};
`;
const HeaderWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;
const FillArea = styled.div`
  width: 100%;
  height: 60px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    height: 12px;
  }
`;
const Security = () => {
  return (
    <>
      <HeaderWrapper>
        <Header />
      </HeaderWrapper>
      <Container data-inspector="security_index_content">
        <Content />
        <Partners />
        {tenantConfig.security.showNews ? <FillArea /> : null}
        {tenantConfig.security.showNews ? <News /> : null}
        {tenantConfig.security.showHelper ? <Helper /> : null}
      </Container>
    </>
  );
};

export default Security;
