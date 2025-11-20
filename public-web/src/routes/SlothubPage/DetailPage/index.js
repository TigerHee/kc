/*
 * @Date: 2024-05-27 15:58:02
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import tdkManager from '@kc/tdk';
import JsBridge from '@knb/native-bridge';
import { useLocale } from '@kucoin-base/i18n';
import { useEffect, useMemo } from 'react';
import { getTdkConfig } from 'services/tdk';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { IS_SSG_ENV } from 'utils/ssgTools';
import { getTDKFromHtml } from 'utils/tdk';

import ActionBar from './components/ActionBar';
import { useIsShowActionBar } from './components/ActionBar/useIsShowActionBar';
import ActivityStatusBar from './components/ActivityStatusBar';
import CoinSignGainTaskList from './components/CoinSignGainTaskList';
import DetailBanner from './components/DetailBanner';
import { useInitAndPullProjectDetailFnc } from './hooks/useInitAndPullProjectDetailFnc';
import useOldRouteHandle from './hooks/useOldRouteHandle';
import { SlotDetailProviderContainer, useStore } from './store';
import {
  Content,
  DetailPageProjectInfo,
  DetailRoot,
  H5BottomFixedArea,
  StyledAppHeader,
  StyledH5Header,
} from './styled';

const BannerActionBar = ({ isH5 }) => {
  if (isH5) return null;
  return <ActionBar />;
};

const getNewTdk = (title = '', description = '', keyword = '', name) => {
  const fullNameReg = new RegExp(/\{0\}/, 'g');
  let newTitle = title.replace(fullNameReg, name);
  let newDes = description.replace(fullNameReg, name);
  let newKey = keyword.replace(fullNameReg, name);
  return {
    title: newTitle,
    description: newDes,
    keywords: newKey,
  };
};

const Detail = () => {
  useOldRouteHandle();
  useInitAndPullProjectDetailFnc();
  const { isH5 } = useDeviceHelper();
  const isShowActionBar = useIsShowActionBar();
  const { state } = useStore();
  const { currency, code } = state?.projectDetail || {};
  const isInApp = JsBridge.isApp();
  const showH5Header = isH5 && !isInApp;
  const isFinishPullProjectDetail = Object.keys(state?.projectDetail || {}).length > 0;
  const isShowH5BottomArea = useMemo(
    () => isFinishPullProjectDetail && isH5 && isShowActionBar,
    [isFinishPullProjectDetail, isH5, isShowActionBar],
  );
  const { currentLang } = useLocale();

  useEffect(() => {
    if (code && (IS_SSG_ENV || !window._useSSG)) {
      getTdkConfig(currentLang).then((res) => {
        if (res && res.success && res.data) {
          const { title, description, keyword } = res.data;
          const tdk = getNewTdk(title, description, keyword, code);
          const htmlTdk = getTDKFromHtml();
          if (
            tdk.title !== htmlTdk.title ||
            tdk.description !== htmlTdk.description ||
            tdk.keywords !== htmlTdk.keywords
          ) {
            tdkManager.handleUpdateTdk(currentLang, tdk, true);
          }
        }
      });
    }
  }, [currentLang, code]);

  return useMemo(
    () => (
      <DetailRoot data-inspector="inspector_gemslothub_detail" isInApp={isInApp}>
        {showH5Header && <StyledH5Header />}
        {isInApp && <StyledAppHeader />}
        <DetailBanner
          contentNode={
            isFinishPullProjectDetail ? (
              isShowActionBar ? (
                <BannerActionBar isH5={isH5} />
              ) : (
                <ActivityStatusBar />
              )
            ) : null
          }
        />
        <Content>
          <CoinSignGainTaskList />
          <DetailPageProjectInfo coin={currency} />
        </Content>
        {isShowH5BottomArea && (
          <H5BottomFixedArea>
            <ActionBar />
          </H5BottomFixedArea>
        )}
      </DetailRoot>
    ),
    [
      currency,
      isFinishPullProjectDetail,
      isH5,
      isInApp,
      isShowActionBar,
      isShowH5BottomArea,
      showH5Header,
    ],
  );
};

const EnhanceDetail = () => {
  return (
    <SlotDetailProviderContainer>
      <Detail />
    </SlotDetailProviderContainer>
  );
};

export default EnhanceDetail;
