/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Empty, Spin, styled } from '@kux/mui';
import GlobalTransferScope from 'components/Root/GlobalTransferScope';
import isNil from 'lodash/isNil';
import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import AgreeModal from './AgreeModal';
import Banner from './Banner';
import BlackListModal from './BlackListModal';
import Condition from './Condition';
import Faq from './Faq';
import Main from './Main';
import ProjectInfo from './ProjectInfo';
import TokenAllocation from './TokenAllocation';
import TokenReleaseSchedule from './TokenReleaseSchedule';
import { exposePageStateForSSG } from 'src/utils/ssgTools';
import TokenSale from './TokenSale';
import { getEventStatusInfo, standardizeRange } from './Participate/useViewModel';
import { IS_SSG_ENV } from 'src/components/NoSSG';

const Wrapper = styled.main`
  width: 100%;
  background: ${(props) => props.theme.colors.overlay};
  margin-bottom: -1px;
  padding-bottom: 100px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: ${(props) => (props.isInApp ? '32px' : '20px')};
  }
`;

const EmptyContent = styled.main`
  height: 100vh;
  background: ${(props) => props.theme.colors.overlay};
  text-align: center;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: ${(props) => props.theme.colors.text40};

  .KuxSpin-root {
    margin: 0 auto 0;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 2;

  ${(props) => props.theme.breakpoints.down('lg')} {
    // padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const SpotlightR8 = () => {
  const isInApp = JsBridge.isApp();

  return (
    <>
      <Wrapper id="spotlight8-cotent" isInApp={isInApp}>
        <Banner />
        <Content>
          <Main />
          <TokenSale />
          <ProjectInfo />
          <TokenReleaseSchedule />
          <TokenAllocation />
          <Condition />
          <Faq />
          <AppleDisclaim />
        </Content>
      </Wrapper>

      <BlackListModal />
      <AgreeModal />
      <GlobalTransferScope />
    </>
  );
};

const Index = (props) => {
  const loading = useSelector((state) => state.loading.effects['spotlight8/getDetailInfo']);
  const pageLoading = useSelector((state) => state.loading.effects['spotlight8/pullPage']);
  const campaignId = useSelector((state) => state.spotlight8.detailInfo?.campaignId);
  const spotlight8PeriodicResponse = useSelector((state) => state.spotlight8.detailInfo?.spotlight8PeriodicResponse);
  const dispatch = useDispatch();

  useEffect(() => {
    // 仅在 ssg 环境下更新 eventStatus, 保证 ssg 下 banner 中的状态正确
    // 正常情况下 eventStatus 在 src/components/Spotlight/SpotlightR8/Participate/useViewModel.js 中维护
    if (!spotlight8PeriodicResponse || !IS_SSG_ENV) return;
    dispatch({
      type: 'spotlight8/update',
      payload: {
        eventStatus: getEventStatusInfo(standardizeRange(spotlight8PeriodicResponse))?.eventStatus
      },
    })
  }, [spotlight8PeriodicResponse, dispatch]);

  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const { spotlight8 = {} } = dvaState;
      const { detailInfo = {}, pageData } = spotlight8;
      // 保证 eventStatus 在 ssg 生成的那一刻是准确的
      const eventStatusInfo = {};
      if (detailInfo.spotlight8PeriodicResponse) {
        eventStatusInfo.eventStatus = getEventStatusInfo(standardizeRange(detailInfo.spotlight8PeriodicResponse))?.eventStatus;
      }
      return {
        spotlight8: {
          ...eventStatusInfo,
          detailInfo,
          pageData,
        },
      };
    });
  }, []);

  const Content = useMemo(() => {
    // ssg 时, campaignId 是存在的, 会跳过loading
    if ((pageLoading || isNil(pageLoading) || loading) && !campaignId) {
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
      return <SpotlightR8 />;
    }
  }, [pageLoading, loading, campaignId]);

  return (
    <div id="spotlight8-wrapper" data-inspector="inspector_spotlight8">
      {Content}
    </div>
  );
};

export default Index;
