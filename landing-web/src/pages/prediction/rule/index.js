/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { ThemeProvider as KuFoxThemeProvider } from '@kufox/mui';
import Rule from 'components/$/Prediction/Rule';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  @media (min-width: 1040px) {
    background: black;
  }
`;
const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow-x: hidden;
  @media (min-width: 1040px) {
    margin: 0 auto;
    max-width: 375px;
  }
`;

export default brandCheckHoc(() => {

  return (
    <KuFoxThemeProvider>
      <Wrapper>
        <Page data-inspector="predictionRulePage">
          <Rule />
        </Page>
      </Wrapper>
    </KuFoxThemeProvider>
  );
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
