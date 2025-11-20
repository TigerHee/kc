/**
 * Owner: iron@kupotech.com
 */
import { ICTriangleBottomOutlined } from '@kux/icons';
import { Accordion, useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import remoteEvent from '@tools/remoteEvent';
import storage from '@utils/storage';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLangToPath, composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { useLang } from '../../hookTool';
import AnimateDropdown from '../AnimateDropdown';
import { long_language } from '../config';
import { namespace } from '../model';
import { tenantConfig } from '../../tenantConfig';
import { CusAccordion, OverlayWrapper, TextWrapper } from './styled';

const { AccordionPanel: Panel } = Accordion;

// 显隐账户数据状态在storage的key
const SHOW_ASSETS = 'SHOW_ASSETS';

const Overlay = loadable(() => import('./Overlay'));

export default (props) => {
  const {
    currency,
    hostConfig,
    isSub = false,
    userInfo,
    currentLang,
    // className = '',
    themeColors,
    title,
    inDrawer,
    onClose,
    inTrade,
  } = props;
  const theme = useTheme();
  const [state, setState] = useState(false);
  const color = themeColors || theme.colors;
  const isLong_language = long_language.indexOf(currentLang) > -1;
  const [showAssets, setShowAssets] = useState(() => {
    const showAssetsFromStorage = storage.getItem(SHOW_ASSETS);
    return !!showAssetsFromStorage;
  });
  const { t } = useLang();
  const { assetDetail } = useSelector((state) => state[namespace]);
  const getSubAssetsLoading = useSelector(
    (state) => state.loading.effects[`${namespace}/getLargeSubsAssets`],
  );

  const dispatch = useDispatch();

  const changeAssetShow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const visible = !showAssets;
    storage.setItem('SHOW_ASSETS', visible);
    remoteEvent.emit(remoteEvent.evts.SHOW_ASSETS, visible);
  };
  useEffect(() => {
    remoteEvent.on(remoteEvent.evts.SHOW_ASSETS, (visible) => {
      setShowAssets(visible);
    });
  }, []);
  const handleMouseEnter = throttle(
    () => {
      const { balanceCurrency = 'USDT' } = userInfo || {};
      dispatch({
        type: `${namespace}/pullAssetDetail`,
        payload: {
          balanceCurrency,
        },
      });
    },
    2000,
    { leading: true },
  );

  const handleRouter = useCallback(() => {
    kcsensorsClick(['assets', '1']);
    const { KUCOIN_HOST } = hostConfig;
    const _url = addLangToPath(`${KUCOIN_HOST}/assets`, currentLang);
    composeSpmAndSave(_url, ['assets', '1'], currentLang);
    window.location.href = _url;
  }, [currentLang, hostConfig]);

  const overlayProps = {
    hostConfig,
    assetDetail,
    isLong_language,
    inDrawer,
    inTrade,
    currentLang,
    showAssets,
    changeAssetShow,
    color,
    getSubAssetsLoading,
    currency,
    onClose,
    theme,
    isSub,
    userInfo,
  };

  if (inDrawer) {
    return (
      <CusAccordion>
        <Panel header={title} key={0}>
          <LoaderComponent show={inDrawer}>
            <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
          </LoaderComponent>
        </Panel>
      </CusAccordion>
    );
  }

  return tenantConfig.showAssetsDropDown ? (
    <AnimateDropdown
      visible={state}
      onVisibleChange={(show) => {
        setState(show);
      }}
      overlay={
        <LoaderComponent show={state}>
          <Overlay {...overlayProps} fallback={<OverlayWrapper {...overlayProps} />} />
        </LoaderComponent>
      }
      trigger="hover"
      anchorProps={{ style: { 'display': 'block' } }}
      placement="bottom"
      inDrawer={inDrawer}
      keepMounted
    >
      <TextWrapper onClick={handleRouter} onMouseEnter={handleMouseEnter} inTrade={inTrade}>
        {t('8ogr5vky7rWLELopyjPdsX')}
        <ICTriangleBottomOutlined size="12" className="arrow" color={theme.colors.icon60} />
      </TextWrapper>
    </AnimateDropdown>
  ) : (
    <TextWrapper onClick={handleRouter} inTrade={inTrade}>
      {t('8ogr5vky7rWLELopyjPdsX')}
    </TextWrapper>
  );
};
