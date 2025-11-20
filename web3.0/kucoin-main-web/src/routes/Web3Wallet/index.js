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
    <Wrapper data-inspector="seo_web3_wallet">
      <Banner
        title={_t('b9t4qUGaYrc7E26o1kLHC4')}
        subTitle={_t('9r6dNa5PHiS643bYDiZV4m')}
        shareTitle={_t('vxSyNmLiTLQqQUayEjR7yz')}
        description={_tHTML('qDK6R8DboJJArLy84r5JgL', {
          url: addLangToPath(`${KUCOIN_HOST}/learn/glossary/blockchain`),
          centerurl: addLangToPath(`${KUCOIN_HOST}/learn/web3/what-is-decentralized-finance-defi`),
        })}
      />
      <ContentWrapper login={isLogin}>
        <Content>
          <Article />
        </Content>
        {responsive.sm && (
          <Aside>
            <div className="seo_landing_aside">
              {isLogin && <Share mb={24} shareTitle={_t('vxSyNmLiTLQqQUayEjR7yz')} />}
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
