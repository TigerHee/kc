/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback, useState } from 'react';
import { useResponsive } from '@kux/mui';
import AnchorNavigator from 'components/AnchorNavigator';
import { useSelector } from 'src/hooks/useSelector';
import Banner from 'components/Landing/Banner';
import { _t, _tHTML } from 'tools/i18n';
import { Wrapper, ContentWrapper, Aside, Content } from '../MiningPool/index.style';
import SignUpCard from 'components/Landing/SignUpCard';
import QRcode from 'components/Landing/QRcode';
import Share from 'components/Landing/Share';
import Article from './Article';
import { getAnchorList } from './config';

const anchorList = getAnchorList();

export default () => {
  const responsive = useResponsive();
  const { isLogin } = useSelector((state) => state.user);
  const [activeAnchor, setActiveAnchor] = useState(anchorList[0].key);

  const handleAnchorClick = useCallback((key) => {
    setActiveAnchor(key);
  }, []);

  return (
    <Wrapper data-inspector="seo_copy_trading">
      <Banner
        title={_t('4Cc71v5DCuvtWnMe5Vq2QV')}
        description={_t('hSei7Tvhmqoj4TeLMaGssc')}
        shareTitle={_t('ihdsQusXQ33DDUyQ8nT9Fx')}
      />
      <ContentWrapper login={isLogin}>
        <Content>
          <Article />
        </Content>
        {responsive.sm && (
          <Aside>
            <div className="seo_landing_aside">
              {isLogin && <Share mb={24} shareTitle={_t('ihdsQusXQ33DDUyQ8nT9Fx')} />}
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
