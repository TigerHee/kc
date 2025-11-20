/*
 * owner: borden@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import React from 'react';
import { Content } from '../style';
import Banner from './Banner';
import CurrencyTasks from './CurrencyTasks';
import UniversalTasks from './UniversalTasks';

const AppHeader = loadable(() => import('../components/AppHeader'));
const H5Header = loadable(() => import('routes/SlothubPage/components/AppHeader/H5Header'));

const Page = styled.main`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: -88px;
  }
`;
const StyledContent = styled(Content)`
  margin-top: -30px;
  ${({ theme }) => theme.breakpoints.up('sm')} {
    margin-top: -60px;
  }
`;

const Index = (props) => {
  const { sm } = useResponsive();
  const isInApp = JsBridge.isApp();
  const isH5 = !sm && !isInApp;

  return (
    <>
      {isH5 && <H5Header />}
      {isInApp && <AppHeader />}
      <Page data-inspector="inspector_gemslothub_page">
        <Banner />
        <StyledContent>
          <UniversalTasks />
          <CurrencyTasks />
        </StyledContent>
      </Page>
    </>
  );
};

export default React.memo(Index);
