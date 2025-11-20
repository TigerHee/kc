/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { useResponsive } from '@kux/mui';
import AnchorNavigator from 'components/AnchorNavigator';
import { useSelector } from 'src/hooks/useSelector';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import Banner from 'components/Landing/Banner';
import { Wrapper, ContentWrapper, Aside, Content } from './index.style';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import Share from 'components/Landing/Share';
import siteCfg from 'utils/siteConfig';
import Article from './components/Article';
import { getAnchorList } from './config';

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
    <Wrapper data-inspector="seo_mining_pool">
      <Banner
        title={_t('udJj913B6M8q9zhB6cE9kU')}
        description={_tHTML('k9sVf35nsQKeTDk9ARPmoV', {
          url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/block`),
        })}
        shareBlockid="miningpoolshare"
        signupBlockid="miningpoolsignup1"
      />
      <ContentWrapper login={isLogin}>
        <Content>
          <Article />
        </Content>
        {responsive.sm && (
          <Aside>
            <div className="seo_landing_aside">
              {isLogin && (
                <Share
                  mb={24}
                  blockid="miningpoolshare"
                  shareTitle={_t('udJj913B6M8q9zhB6cE9kU')}
                />
              )}
              <AnchorNavigator
                activeAnchorKey={activeAnchor}
                anchorList={anchorList}
                onClickItem={handleAnchorClick}
                showListTitle
              />
              {!isLogin && <SignUpCard signupBlockid="miningpoolsignup1" />}
              <QRcode />
            </div>
          </Aside>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};
