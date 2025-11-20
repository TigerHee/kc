/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled, Button } from '@kufox/mui';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useDispatch } from 'react-redux';

import logo from '../asset/logo.svg';
import close from '../asset/close.svg';
import download from '../asset/download.svg';
import { BLOCK_ID, downloadUrl } from '../config';
import { useLang } from '../hookTool';
import DownloadATag from './DownloadATag';
import { namespace } from '../model';

export const HEIGHT = 61;
const Wrapper = styled(DownloadATag)`
  width: 100%;
  height: ${HEIGHT}px;
  overflow: hidden;
  background: #737e8d;
  position: relative;
  z-index: 900;
  display: flex;
  padding: 12px 16px;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  flex-grow: 1;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;

const Logo = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 8px;
  flex-shrink: 0;
  margin-right: 12px;
`;

const TextCont = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  font-weight: 600;
  ${(props) => {
    if (!props.showDesc) {
      return `font-size: 18px;`;
    }
    return `font-size: 16px;`;
  }}
  line-height: 21px;
  color: #ffffff;
`;

const Desc = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  -webkit-box-orient: vertical;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  display: block;
`;

const Close = styled.img`
  width: 12px;
  height: 12px;
  position: absolute;
  right: 6px;
  top: 0;
`;

const Download = styled.img`
  width: 16px;
  height: 16px;
`;

export default ({ visible, onClose, onDownload, downloadAppUrl, currentLang } = {}) => {
  const { t } = useLang();
  const postType = 'newRatings';
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (visible) {
        kcsensorsManualTrack({
          spm: [BLOCK_ID, '1'],
          data: {
            postType,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [visible, postType]);

  const onClickDownload = () => {
    try {
      onDownload({
        postType,
        position: '',
        clickPosition: 'download',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onClickClose = (e) => {
    try {
      onClose(e, {
        postType,
        position: '',
        clickPosition: 'close',
      });
    } catch (e) {
      console.error(e);
    }
  };

  const showDesc = ['en_US', 'zh_HK'].includes(currentLang);

  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: { isShowDownloadBanner: visible },
    });
  }, [visible]);
  // 将顶飘高度存到redux，供业务获取后处理偏移
  useEffect(() => {
    dispatch({
      type: `${namespace}/update`,
      payload: { downloadBannerHeight: HEIGHT },
    });
  }, []);

  // 优先取外部传入的downloadAppUrl
  return visible ? (
    <Wrapper
      onClick={onClickDownload}
      href={downloadAppUrl || downloadUrl}
      id="gbiz-downloadBanner"
    >
      <Left>
        <Logo>
          <Img src={logo} alt="download_logo" />
        </Logo>
        <TextCont>
          <Title showDesc={showDesc}>KuCoin App</Title>
          {showDesc && <Desc>{t('wLAfc8MZvoHbeNragecB4Z')}</Desc>}
        </TextCont>
      </Left>
      <Right>
        <Button
          size="small"
          mt={2}
          style={{
            width: 60,
            borderRadius: '6px',
          }}
        >
          <Download src={download} alt="download_jump" />
        </Button>
      </Right>
      <Close src={close} onClick={onClickClose} alt="download_close" />
    </Wrapper>
  ) : null;
};
