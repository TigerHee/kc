/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { EmotionCacheProvider, Empty, Spin, styled, ThemeProvider, useResponsive } from '@kux/mui';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { useEffect, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import useAppInit from 'TradeActivity/hooks/useAppInit';
import AgreeModal from './AgreeModal';
import Banner from './Banner';
import BannerMini from './BannerMini';
import BlackListModal from './BlackListModal';
import Condition from './Condition';
import Faq from './Faq';
import { useActivityProcessingStatus } from './hooks';
import LotteryTickets from './LotteryTickets';
import Participate from './Participate';
import Process from './Process';
import ProjectInfo from './ProjectInfo';
import TokenSale from './TokenSale';

const Wrapper = styled.div`
  width: 100%;
  background: #181e29;
  margin-bottom: -1px;
  font-family: 'Roboto';
`;

const EmptyContent = styled.div`
  height: 70vh;
  text-align: center;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: rgba(29, 29, 29, 0.4);

  .KuxSpin-root {
    margin: 0 auto 0;
  }
`;

const Content = styled.div`
  max-width: 1392px;
  width: 100%;
  margin: 0 auto;
  padding: 45px 96px 110px;
  position: relative;
  background: #181e29;
  border-radius: 40px;
  z-index: 2;

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    padding: 35px 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 30px 16px;
    border-radius: 27px;
  }
`;

const Left = styled.div`
  width: 100%;
  padding-right: 410px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-right: 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-right: 0;
  }
`;

const Right = styled.div`
  width: 312px;
  position: absolute;
  right: 96px;
  top: 45px;
`;

const SpotlightR6 = ({ id, activityId }) => {
  const { lg } = useResponsive();
  const isInApp = JsBridge.isApp();
  useActivityProcessingStatus();

  return (
    <>
      <Wrapper id="spotlight6-cotent" isInApp={isInApp}>
        <Banner />
        <Content>
          <Left>
            {!lg ? <Participate id={id} /> : null}
            <Process />
            <Condition id={id} />
            <LotteryTickets />
            <BannerMini activityId={activityId} />
            <TokenSale />
            <ProjectInfo />
            <Faq />
            <AppleDisclaim />
          </Left>
          {lg ? (
            <Right>
              <Participate id={id} />
            </Right>
          ) : null}
        </Content>
      </Wrapper>

      <BlackListModal />
      <AgreeModal />
    </>
  );
};

const Index = (props) => {
  useAppInit();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isRTL } = useLocale();

  const loading = useSelector((state) => state.loading.effects['spotlight/getDetailInfo']);
  const pageLoading = useSelector((state) => state.loading.effects['spotlight/pullPage']);
  const campaignId = useSelector((state) => state.spotlight.detailInfo?.campaignId);
  const pageData = useSelector((state) => state.spotlight.pageData, shallowEqual);

  const activityCode = get(pageData, 'activity[0].code');

  // 目前id均为数字，可据此验证传参是否合法，后续如果改动这里判断需调整
  const activityId = useMemo(() => {
    if (id) {
      const _id = `${id}`.split('_')[0];
      return +_id > 0 ? _id : null;
    }
    return null;
  }, [id]);

  useEffect(() => {
    if (activityId) {
      dispatch({ type: 'spotlight/filter', payload: { id: activityId } });
    }
  }, [dispatch, activityId]);

  useEffect(() => {
    if (activityCode) {
      dispatch({ type: 'spotlight/getDetailInfo', payload: { id: activityCode } });
    }
  }, [dispatch, activityCode]);

  const Content = useMemo(() => {
    if (pageLoading || isNil(pageLoading) || loading) {
      return (
        <EmptyContent>
          <Spin size="small" />
        </EmptyContent>
      );
    } else if (!campaignId) {
      return (
        <EmptyContent>
          <Empty size="small" description={_t('678WABnThqkABxZsmacgsA')} />
        </EmptyContent>
      );
    } else {
      return <SpotlightR6 id={campaignId} activityId={activityId} />;
    }
  }, [pageLoading, loading, campaignId, activityId]);

  return (
    <EmotionCacheProvider isRTL={isRTL}>
      <ThemeProvider theme="dark">
        <div id="spotlight6-wrapper" data-inspector="inspector_spotlight6">
          {Content}
        </div>
      </ThemeProvider>
    </EmotionCacheProvider>
  );
};

export default Index;
