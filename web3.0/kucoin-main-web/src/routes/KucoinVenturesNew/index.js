/**
 * Owner: will.wang@kupotech.com
 */

import { styled } from '@kux/mui';
import Footer from './components/Footer';
import FundSection from './components/FundSection';
import Header from './components/Header';
import PortfolioSection from './components/PortfolioSection';
import StorySection from './components/StorySection';

const Page = styled.div`
  position: relative;
  height: 100%;
  [dir='rtl'] & {
    direction: rtl;
  }
`;

export default () => {
  return (
    <Page data-inspector="ventures_page">
      <Header />
      <StorySection />
      <PortfolioSection />
      <FundSection />
      <Footer />
    </Page>
  );
};
