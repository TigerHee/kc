/**
 * Owner: lucas.l.lu@kupotech.com
 */
import { useDispatch, useSelector } from 'dva';
import { ThemeProvider } from '@kux/mui';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import { ChannelContent } from 'components/$/CommunityCollect/ChannelContent/ChannelContent';
import { PageContent } from 'components/$/CommunityCollect/PageContent';
import { Banner } from 'components/$/CommunityCollect/Banner';
import { _t, _tHTML } from 'utils/lang';
import { PageHeader } from 'components/$/CommunityCollect/PageHeader';
import { StyledPage } from 'components/$/CommunityCollect/Page';
import './style.less';
import { useCallback, useEffect, useState } from 'react';
import JsBridge from 'utils/jsBridge';
import { updateHeader } from 'components/$/CommunityCollect/jsapi/updateHeader';
import { isSupportAppNewJump } from 'components/$/CommunityCollect/tools/isSupportAppNewJump';
import { appConfig } from 'components/$/CommunityCollect/config';
import { StyledBaseNativeDrawer } from 'components/NativeDrawer/StyledBaseNativeDrawer';
import { StyledDrawerContent } from 'components/$/CommunityCollect/DrawerContent/DrawerContent';
import { getMenuNativeNames } from 'components/$/CommunityCollect/tools/getMenuNativeNames';
import { debounce, find } from 'lodash';
import { PageFooter } from 'components/$/CommunityCollect/PageFooter';

export default brandCheckHoc(() => {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const { currentLang, appVersion } = useSelector(state => state.app);
  const { communityGroupConfig, menuVisible, loading } = useSelector(state => state.community);
  const [lang, setLang] = useState('');
  const [drawerValue, setDrawerValue] = useState(null);
  const [langListData, setLangListData] = useState([]);

  const enableRestrictNotice = useSelector((s) => s['$header_header']?.isShowRestrictNotice);
  const restrictNoticeHeight = useSelector((s) => s['$header_header']?.restrictNoticeHeight);

  const openDrawer = useCallback(debounce(() => {
    closeDrawer.cancel();

    dispatch({
      type: 'community/update',
      payload: {
        menuVisible: true,
      },
    });
  }, 300), [dispatch]);

  const closeDrawer = useCallback(debounce(() => {
    openDrawer.cancel();

    dispatch({
      type: 'community/update',
      payload: {
        menuVisible: false,
      },
    });
  }, 300), [dispatch]);

  function handleRightClick() {
    if (!menuVisible) {
      openDrawer();
    }
    return true;
  }

  useEffect(() => {
    setLang(currentLang);

    if (communityGroupConfig && communityGroupConfig.length > 0) {
      const newList = getMenuNativeNames(communityGroupConfig);
      const currentDrawerValue = find(newList, item => item.language === currentLang);

      setLangListData(newList);
      setDrawerValue(currentDrawerValue);
    }
  }, [currentLang, communityGroupConfig]);

  // header 操作，只能在 client 场景
  useEffect(() => {
    if (!isInApp) {
      return;
    }

    const supportNewJump = isSupportAppNewJump(appVersion);

    updateHeader({
      supportNew: supportNewJump,
      darkMode: false,
      // options
      title: window._BRAND_NAME_,
      rightVisible: true,
      rightIcon: appConfig.rightIcon,
    });

    function handleLeftClick() {
      jumpAppHome();
      return true;
    }

    function jumpAppHome() {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/home?page=0',
        },
      });
    }

    JsBridge.listenNativeEvent.on('onRightClick', handleRightClick);
    JsBridge.listenNativeEvent.on('onLeftClick', handleLeftClick);

    return () => {
      JsBridge.listenNativeEvent.off('onRightClick', handleRightClick);
      JsBridge.listenNativeEvent.off('onLeftClick', handleLeftClick);
    };
  }, [appVersion, isInApp]);

  function handleChangeLang(value) {
    if (!value) {
      return;
    }

    const { language } = value;

    setDrawerValue(value);
    setLang(language);

    closeDrawer();
  }

  return (
    <ThemeProvider>
      <StyledPage>
        <PageHeader
          onRightClick={handleRightClick}
          enableRestrictNotice={enableRestrictNotice}
          restrictNoticeHeight={restrictNoticeHeight}
        />
        <Banner
          title={_tHTML('community.page.title')}
          subtitle={_t('community.page.desc')}
        />
        <PageContent loading={loading}>
          <ChannelContent
            dataSource={communityGroupConfig}
            isInApp={isInApp}
            lang={lang}
            enableRestrictNotice={enableRestrictNotice}
            restrictNoticeHeight={restrictNoticeHeight}
          />
        </PageContent>
        <PageFooter />
        <StyledBaseNativeDrawer
          title={window._BRAND_NAME_}
          keepMounted={true}
          show={menuVisible}
          onClose={closeDrawer}
          anchor="bottom"
          className="community-collect-drawer"
        >
          <StyledDrawerContent
            value={drawerValue}
            dataSource={langListData}
            onChange={handleChangeLang}
            onCancel={closeDrawer}
          />
        </StyledBaseNativeDrawer>
      </StyledPage>
    </ThemeProvider>
  );
}, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
