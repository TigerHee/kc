/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Empty, Spin, styled } from '@kux/mui';
import GlobalTransferScope from 'components/Root/GlobalTransferScope';
import isNil from 'lodash/isNil';
import { useMemo, useEffect } from 'react';
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
import TokenSale from './TokenSale';
import ExplainModal from './ExplainModal';
import { exposePageStateForSSG } from 'src/utils/ssgTools';

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
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

const  SpotlightR7 = () => {
  const isInApp = JsBridge.isApp();

  return (
    <>
      <Wrapper id="spotlight7-cotent" isInApp={isInApp}>
        <Banner />
        <Content data-inspector="inspector_spotlight7_content">
          <Main />
          <Condition />
          <TokenSale />
          <ProjectInfo />
          <TokenReleaseSchedule />
          <TokenAllocation />
          <Faq />
          <AppleDisclaim />
        </Content>
      </Wrapper>
      {/* 权益弹窗 */}
      <ExplainModal />
      <BlackListModal />
      <AgreeModal />
      <GlobalTransferScope />
    </>
  );
};

const Index = (props) => {
  const loading = useSelector((state) => state.loading.effects['spotlight7/getDetailInfo']);
  const pageLoading = useSelector((state) => state.loading.effects['spotlight7/pullPage']);
  const campaignId = useSelector((state) => state.spotlight7.detailInfo?.campaignId);
  useEffect(() => {
    exposePageStateForSSG((dvaState) => {
      const { spotlight7 = {} } = dvaState;
      const { detailInfo = {}, pageData } = spotlight7;
      return {
        spotlight7: {
          detailInfo,
          pageData,
        },
      };
    });
  }, []);
  const Content = useMemo(() => {
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
      return <SpotlightR7 />;
    }
  }, [pageLoading, loading, campaignId]);

  return (
    <div id="spotlight7-wrapper" data-inspector="inspector_spotlight7">
      {Content}
    </div>
  );
};

export default Index;
