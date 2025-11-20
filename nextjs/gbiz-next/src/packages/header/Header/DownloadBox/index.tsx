/**
 * Owner: iron@kupotech.com
 */
import React, { useCallback, useState, FC } from 'react';
import { AppdownloadIcon } from '@kux/iconpack';
import clsx from 'clsx';
import loadable from '@loadable/component';
import { kcsensorsManualTrack } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import AnimateDropdown from '../AnimateDropdown';
import styles from './styles.module.scss';

const Overlay = loadable(() => import('./Overlay'));

let exposeFlag: ReturnType<typeof setTimeout> | null = null;

interface DownloadBoxProps {
  currentLang: string;
  hostConfig: any;
  inTrade: boolean;
}

const DownloadBox: FC<DownloadBoxProps> = props => {
  const { currentLang, hostConfig, inTrade } = props;

  const { KUCOIN_HOST, KUCOIN_HOST_CHINA } = hostConfig;
  const [state, setState] = useState(false);
  const overlayProps = {
    currentLang,
    KUCOIN_HOST,
    KUCOIN_HOST_CHINA,
    inTrade,
  };

  // 满足显示时间超过300ms，才算曝光
  const changeVisible = useCallback(show => {
    setState(show);
    if (exposeFlag) {
      clearTimeout(exposeFlag);
    }
    if (show) {
      exposeFlag = setTimeout(() => {
        kcsensorsManualTrack(['navigationDownloadPopup', '1'], {
          pagecate: 'navigationDownloadPopup',
        });
      }, 300);
    }
  }, []);
  return (
    <AnimateDropdown
      visible={state}
      overlay={
        <LoaderComponent show={state}>
          <Overlay
            {...overlayProps}
            fallback={<div className={clsx(styles.overlayWrapper, inTrade && styles.overlayWrapperInTrade)} />}
          />
        </LoaderComponent>
      }
      onVisibleChange={changeVisible}
      trigger="hover"
      anchorProps={{ style: { display: 'block' } }}
      placement="bottom-end"
      popperClassName={styles.downloadContainer}
    >
      <div
        className={clsx(styles.appDownloadWrapper, inTrade && styles.appDownloadWrapperInTrade)}
        data-inspector="inspector_header_download_box"
      >
        <AppdownloadIcon size={16} className={clsx(['navIcon', styles.downloadIcon])} color="var(--kux-text)" />
      </div>
    </AnimateDropdown>
  );
};

export default DownloadBox;
