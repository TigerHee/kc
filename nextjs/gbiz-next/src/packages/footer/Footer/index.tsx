/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { ThemeProvider } from '@kux/mui-next';
import { FooterStoreProvider, createFooterStore } from '../model';
import Footer from './Footer';
import PageProvider from 'provider/PageProvider';
import useExternalSync from '../useExternalSync';

const InnerFooter = React.memo((props: any) => {
  useExternalSync('$footer_footer',  props.dva)
  return (
    <ThemeProvider theme={props.theme || 'light'}>
      <Footer {...props} />
    </ThemeProvider>
  );
});

const FooterComponent = React.memo((props: any) => {
  return (
    <FooterStoreProvider>
      <PageProvider value={props}>
        <InnerFooter {...props} />
      </PageProvider>
    </FooterStoreProvider>
  );
});

export default FooterComponent;

export const getServerSideProps = async () => {
  try {
    const footerStore = createFooterStore();
    // 后期多个请求可以写这里
    const [summaryResult, footerInfoResult] = await Promise.allSettled([
      footerStore.getState().pullSummary(),
      footerStore.getState().pullFooterInfo(),
    ]);
    const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
    const footerInfo = footerInfoResult.status === 'fulfilled' ? footerInfoResult.value : null;
    return {
      summary,
      showStatic: footerInfo ? footerInfo.showStatic : false,
      multiLevelPositions: footerInfo ? footerInfo.multiLevelPositions : null,
    };
  } catch (e) {
    console.log('gbiz-next footer getServerSideProps failed:', e);
    return null;
  }
}