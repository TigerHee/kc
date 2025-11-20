/**
 * Owner: iron@kupotech.com
 */
import { TriangleBottomIcon } from '@kux/iconpack';
import { Collapse } from '@kux/design';
import loadable from '@loadable/component';
import clsx from 'clsx';
import remoteEvent from 'tools/remoteEvent';
import storage from 'tools/storage/localStorage';
import throttle from 'lodash-es/throttle';
import React, { useCallback, useEffect, useState, FC } from 'react';
import { composeSpmAndSave, kcsensorsClick } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import { useTranslation } from 'tools/i18n';
import addLangToPath from 'tools/addLangToPath';
import AnimateDropdown from '../AnimateDropdown';
import { long_language } from '../config';
import { useTenantConfig } from '../../tenantConfig';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';

// 显隐账户数据状态在storage的key
const SHOW_ASSETS = 'SHOW_ASSETS';

const Overlay = loadable(() => import('./Overlay'));

interface AssetsBoxProps {
  currency: string;
  hostConfig: any;
  isSub: boolean;
  userInfo: any;
  currentLang: string;
  title: string;
  inDrawer: boolean;
  onClose: () => void;
  inTrade: boolean;
}

const AssetsBox: FC<AssetsBoxProps> = props => {
  const {
    currency,
    hostConfig,
    isSub = false,
    userInfo,
    currentLang,
    // className = '',
    title,
    inDrawer,
    onClose,
    inTrade,
  } = props;
  const tenantConfig = useTenantConfig();
  const [state, setState] = useState(false);
  const isLong_language = long_language.indexOf(currentLang) > -1;
  const [showAssets, setShowAssets] = useState(() => {
    const showAssetsFromStorage = storage.getItem(SHOW_ASSETS);
    return !!showAssetsFromStorage;
  });
  const { t } = useTranslation('header');
  const assetDetail = useHeaderStore(state => state.assetDetail);
  const getSubAssetsLoading = useHeaderStore(state => state.getSubAssetsLoading);

  const changeAssetShow = e => {
    e.stopPropagation();
    e.preventDefault();
    const visible = !showAssets;
    storage.setItem('SHOW_ASSETS', visible);
    remoteEvent.emit(remoteEvent.evts.SHOW_ASSETS, visible);
  };
  useEffect(() => {
    remoteEvent.on(remoteEvent.evts.SHOW_ASSETS, visible => {
      setShowAssets(visible);
    });
  }, []);

  const pullAssetDetail = useHeaderStore(state => state.pullAssetDetail);

  const handleMouseEnter = throttle(
    () => {
      const { balanceCurrency = 'USDT' } = userInfo || {};
      pullAssetDetail?.({
        balanceCurrency,
      });
    },
    2000,
    { leading: true }
  );

  const handleRouter = useCallback(() => {
    kcsensorsClick(['assets', '1']);
    const { KUCOIN_HOST } = hostConfig;
    const _url = addLangToPath(`${KUCOIN_HOST}/assets`);
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
    getSubAssetsLoading,
    currency,
    onClose,
    isSub,
    userInfo,
  };

  // TODO: 参考 MenuDrawer 的写法
  if (inDrawer) {
    return (
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <TriangleBottomIcon className={clsx(styles.collapseIcon, isActive && styles.collapseIconActive)} />
        )}
        items={[
          {
            key: 0,
            title: title,
            content: (
              <LoaderComponent show={inDrawer}>
                <Overlay {...overlayProps} />
              </LoaderComponent>
            ),
          },
        ]}
      />
    );
  }

  return tenantConfig.showAssetsDropDown ? (
    <AnimateDropdown
      visible={state}
      onVisibleChange={show => {
        setState(show);
      }}
      overlay={
        <LoaderComponent show={state}>
          <Overlay
            {...overlayProps}
            fallback={
              <div
                className={clsx(styles.overlayWrapper, {
                  [styles.overlayWrapperInDrawer]: inDrawer,
                  [styles.overlayWrapperIsLongLanguage]: !inDrawer && isLong_language,
                  [styles.overlayWrapperIsInTrade]: !inDrawer && inTrade,
                })}
              />
            }
          />
        </LoaderComponent>
      }
      trigger="hover"
      anchorProps={{ style: { display: 'block' } }}
      placement="bottom"
      inDrawer={inDrawer}
      keepMounted
    >
      <div onClick={handleRouter} onMouseEnter={handleMouseEnter} className={styles.textWrapper}>
        {t('8ogr5vky7rWLELopyjPdsX')}
        <TriangleBottomIcon size={12} className={styles.arrow} color="var(--kux-icon60)" />
      </div>
    </AnimateDropdown>
  ) : (
    <div onClick={handleRouter} className={styles.textWrapper}>
      {t('8ogr5vky7rWLELopyjPdsX')}
    </div>
  );
};

export default AssetsBox;
