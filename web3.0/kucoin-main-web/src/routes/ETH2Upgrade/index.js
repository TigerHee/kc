/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { useResponsive } from '@kux/mui';
import AnchorNavigator from 'components/AnchorNavigator';
import { useSelector } from 'src/hooks/useSelector';
import Banner from 'components/Landing/Banner';
import { _t, _tHTML, addLangToPath } from 'tools/i18n';
import { Wrapper, ContentWrapper, Aside, Content } from '../MiningPool/index.style';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import Share from 'components/Landing/Share';
import siteCfg from 'utils/siteConfig';
import Article from './Article';
import { getAnchorList } from './config';
import BannerImg from 'static/mining-pool/eth.svg';
import BannerMdImage from 'static/mining-pool/ethmd.svg';
import Bannertop from 'static/mining-pool/ethsmtop.svg';
import Bannerbottom from 'static/mining-pool/ethsmbottom.svg';

const { KUCOIN_HOST } = siteCfg;

const anchorList = getAnchorList();

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);
  const [activeAnchor, setActiveAnchor] = useState(anchorList[0].key);

  const handleAnchorClick = useCallback((key) => {
    setActiveAnchor(key);
  }, []);

  return (
    <Wrapper data-inspector="seo_ethereum_2_upgrade">
      <Banner
        title={_t('6LwYYyvE8ZFwHLSXsjXCtE')}
        bannerImage={BannerImg}
        bannerMdImage={BannerMdImage}
        bannertop={Bannertop}
        bannerbottom={Bannerbottom}
        description={_t('jMKKj1UpxophDExUwrQTz2')}
        shareTitle={_t('rk9H6NWmVhtGicBjsGPgTQ')}
        showCenter
      />
      <ContentWrapper login={isLogin}>
        <Content>
          <Article />
        </Content>
        {responsive.sm && (
          <Aside>
            <div className="seo_landing_aside">
              {isLogin && <Share mb={24} shareTitle={_t('rk9H6NWmVhtGicBjsGPgTQ')} />}
              <AnchorNavigator
                activeAnchorKey={activeAnchor}
                anchorList={anchorList}
                onClickItem={handleAnchorClick}
                showListTitle
              />
              {!isLogin && <SignUpCard />}
              <QRcode />
            </div>
          </Aside>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};
