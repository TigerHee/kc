/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { css, EmotionCacheProvider, Global, styled } from '@kux/mui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BASE_CURRENCY } from 'config/base';
import { tenantConfig } from 'src/config/tenant';
import FAQ from 'src/routes/NewConvertPage/FAQ';
import Slogan from 'src/routes/NewConvertPage/Slogan';
import TradingArea from 'src/routes/NewConvertPage/TradingArea';
import { useExpose } from 'src/utils/ga';
import { exposePageStateForSSG } from 'utils/ssgTools';
import More from './More';

const PageBox = styled.div`
  position: relative;
  overflow: hidden;
`;

// 各个模块 居中 容器
export const CenterWrapBox = styled.div`
  /* z-index: 2; */
  position: relative;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  /* padding: 0 24px; */

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const ConvertPage = () => {
  const wrapperRef = useRef();
  const { isRTL } = useLocale();
  const [symbol, setSymbol] = useState();
  const [isLimitOrder, setIsLimitOrder] = useState(false);

  useExpose(wrapperRef, () => ({
    spm: ['convertExpose', '2'],
  }));

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const categoriesState = dvaState.categories || {};
      const categories = {};
      ['BTC', BASE_CURRENCY].forEach((item) => {
        if (categoriesState[item]) {
          categories[item] = categoriesState[item];
        }
      });
      return {
        categories,
      };
    });
  }, []);

  const commonPropsForChild = useMemo(() => ({symbol, setSymbol, isLimitOrder, setIsLimitOrder}), [isLimitOrder, symbol])

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <PageBox id="convertPage" ref={wrapperRef}>
        <Slogan {...commonPropsForChild} />
        <CenterWrapBox>
          <TradingArea {...commonPropsForChild} />
          {tenantConfig.convertPageConfig.showConvertMore && <More data-inspector="convert_more" />}
          <FAQ />
        </CenterWrapBox>
      </PageBox>
      <Global
        styles={css`
          ${isRTL
            ? `
            .horizontal-flip-in-arabic {
              transform: scaleX(-1);
            }
          `
            : ''}
        `}
      />
    </EmotionCacheProvider>
  );
};

export default ConvertPage;
