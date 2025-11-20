/**
 * Owner: solar.xia@kupotech.com
 */
import sentry from '@kc/sentry';
import JsBridge from '@knb/native-bridge';
import {
  ICHistoryOutlined,
  ICMoreOutlined,
  ICQuestionOutlined,
  ICRewardsHubOutlined,
} from '@kux/icons';
import { useTheme } from '@kux/mui/hooks';
import LazyImg from 'components/common/LazyImg';
import { useCallback, useEffect, useState } from 'react';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { MoreActionDialog } from '../containers/components/MoreAction';
import { useResponsiveSize } from '../hooks';
import { skip2Rules, useSkip2Myorder } from '../util';
import { NavTags, StyledBanner, StyledBannerContainer, StyledH5Title } from './styledComponents';

const { KUCOIN_HOST } = siteCfg;

const findSource = (() => {
  const requireContext = require.context('static/aptp', false, /^\.\/.*\.png$/);
  return function (filename) {
    return requireContext(`./${filename}`);
  };
})();

export default function Banner({ faqRef }) {
  const isInApp = JsBridge.isApp();
  const theme = useTheme();

  const faqButtonClick = useCallback(() => {
    if (faqRef.current) {
      try {
        faqRef.current.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        sentry.captureEvent({
          message: 'premarket landing page faq scrollIntoView error',
          level: 'info',
        });
      }
    }
  }, [faqRef]);

  // const { isRTL } = useLocale();
  const size = useResponsiveSize();
  const isH5 = size === 'sm';
  const [bgImg, setBgImg] = useState('');

  const bgImgPromise = useCallback(() => {
    if (size === 'sm') {
      return setBgImg('');
    }
    return import('static/aptp/pre-market-bg.svg').then((m) => setBgImg(m.default));
  }, [size]);

  useEffect(() => {
    bgImgPromise();
  }, [bgImgPromise]);

  const nav = (
    <nav>
      <NavTags mode="dark" height={isH5 ? 20 : 24}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <li onClick={skip2Rules} role="button">
          <a href={KUCOIN_HOST + addLangToPath('/announcement/Pre-Market-Trading-User-Guidelines')}>
            <ICRewardsHubOutlined color={theme.colors.icon} size={isH5 ? 20 : 14} />
            {isH5 ? '' : _t('inywqQqK8EBMCo5ZZrQGCh')}
          </a>
        </li>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role */}
        <li onClick={faqButtonClick} role="button">
          <a href={KUCOIN_HOST + addLangToPath('/announcement/Pre-Market-Trading-FAQ')}>
            <ICQuestionOutlined color={theme.colors.icon} size={isH5 ? 20 : 14} />
            {isH5 ? '' : _t('hBhZfqGKdBW5XbvWQmxdBh')}
          </a>
        </li>
      </NavTags>
    </nav>
  );

  const [moreVisible, setMoreVisible] = useState(false);
  const handleSkip2Myorder = useSkip2Myorder();

  const h5Right = (
    <div className="right-actions">
      <ICHistoryOutlined size={20} onClick={handleSkip2Myorder} />
      <ICMoreOutlined size={20} onClick={() => setMoreVisible(true)} />
      {moreVisible && <MoreActionDialog {...{ moreVisible, setMoreVisible }} />}
    </div>
  );

  return (
    <StyledBanner data-inspector="inspector_premarket_banner">
      <StyledBannerContainer isInApp={isInApp} bgImg={bgImg}>
        <LazyImg
          src={findSource(size === 'sm' ? 'pre-market-banner-h5.png' : 'pre-market-banner.png')}
          className="banner-icon"
        />
        <article>
          {isH5 ? (
            <>
              <StyledH5Title data-inspector="inspector_premarket_banner">
                <h1 className="left">{_t('p2oTgByxdzWA9H6cob7umF')}</h1>
                {!isInApp && <div className="right">{h5Right}</div>}
              </StyledH5Title>
            </>
          ) : (
            <h1>{_t('p2oTgByxdzWA9H6cob7umF')}</h1>
          )}
          <p>{_tHTML('vd2bfe13zHBSKKWEhNpWw8')}</p>
          {!isH5 && nav}
        </article>
      </StyledBannerContainer>
    </StyledBanner>
  );
}
