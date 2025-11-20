/**
 * Owner: chris@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, styled, ThemeProvider } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import About from './About';
import Banner from './Banner';
import Right from './components/Right';
import Staking from './components/Staking';
import Eligibility from './Eligibility';

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100vw;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 32px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;
const KCS = () => {
  const { isRTL } = useLocale();
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme="dark">
        <main>
          <Banner />
          <Content>
            <section>
              <Staking />
              <Eligibility />
              <Right />
            </section>
            <About />
          </Content>
        </main>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};
export default KCS;
