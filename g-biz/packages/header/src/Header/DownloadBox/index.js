/**
 * Owner: iron@kupotech.com
 */
import { ICAppDownloadOutlined } from '@kux/icons';
import { useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import React, { useCallback, useState } from 'react';
import { kcsensorsManualTrack } from '../../common/tools';
import LoaderComponent from '../../components/LoaderComponent';
import AnimateDropdown from '../AnimateDropdown';
import { AppDownloadWrapper, OverlayWrapper } from './styled';

const Overlay = loadable(() => import('./Overlay'));

let exposeFlag = null;
const DownloadBox = (props) => {
  const { currentLang, hostConfig, inTrade } = props;

  const { KUCOIN_HOST, KUCOIN_HOST_CHINA } = hostConfig;
  const theme = useTheme();
  const [state, setState] = useState(false);
  const { colors } = theme;
  const overlayProps = {
    currentLang,
    KUCOIN_HOST,
    KUCOIN_HOST_CHINA,
    inTrade,
  };

  // 满足显示时间超过300ms，才算曝光
  const changeVisible = useCallback((show) => {
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
          <Overlay {...overlayProps} fallback={<OverlayWrapper inTrade={inTrade} />} />
        </LoaderComponent>
      }
      onVisibleChange={changeVisible}
      trigger="hover"
      anchorProps={{ style: { display: 'block' } }}
      placement="bottom-end"
    >
      <AppDownloadWrapper inTrade={inTrade} data-inspector="inspector_header_download_box">
        <ICAppDownloadOutlined size={inTrade ? 16 : 20} className="navIcon" color={colors.text} />
      </AppDownloadWrapper>
    </AnimateDropdown>
  );
};

export default DownloadBox;
