/**
 * Owner: lori@kupotech.com
 */
import { ICHookOutlined } from '@kux/icons';
import { Divider, useTheme } from '@kux/mui';
import { map } from 'lodash-es';
import moment from 'moment';
import { useCallback, useState } from 'react';
import draftBgPhoto from 'static/account/auth/david.svg';
import draftPhoto from 'static/account/auth/draft.svg';
import handBgPhoto from 'static/account/auth/handle-photo-bg.svg';
import handPhoto from 'static/account/auth/handlephoto.svg';
import kycVideoBgPhoto from 'static/account/auth/kyc-video-bg.svg';
import { _t, _tHTML } from 'tools/i18n';
import useResponsiveSSR from '@/hooks/useResponsiveSSR';

import {
  BlackBold,
  ImgGuide,
  ImgWrapper,
  Item,
  ItemTitle,
  NeededAssetsItem,
  NeededAssetsTip,
  ShowVideo,
  TextWrapper,
  Tips1Wrapper,
  Video,
  Wrapper,
} from './styled';

const guideItems = [
  {
    id: 0,
    title: 'selfService.auth.guide2.label7',
    headerPic: handBgPhoto,
    detailPic: handPhoto,
    desc: 'selfService.auth.guide2.label6',
  },
  {
    id: 1,
    title: 'selfService.auth.guide2.label5',
    headerPic: draftBgPhoto,
    detailPic: draftPhoto,
    desc: 'selfService.auth.guide2.label6',
  },
  {
    id: 2,
    title: 'selfService.auth.guide2.label8',
    headerPic: kycVideoBgPhoto,
    detailPic: null,
    desc: 'selfService.auth.guide2.label9',
    video: 'https://assets.staticimg.com/static/KYC2.mp4',
  },
];

const GuideItem = ({ video, title, headerPic, detailPic, desc, id }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [showImg, setShowImg] = useState(false);

  const onClick = useCallback(() => {
    // video ? setShowVideo(true) : setShowImg(true);
    if (id === 2) {
      setShowVideo(true);
    }
  }, [setShowVideo, id]);

  return (
    <Item>
      <ItemTitle>{_t(title)}</ItemTitle>
      <ImgWrapper onClick={onClick} style={{ cursor: id === 2 ? 'pointer' : 'default' }}>
        <img src={headerPic} alt="header-img" />
      </ImgWrapper>
      {/* <span className={styles.desc} onClick={onClick}>
        {desc}
      </span> */}
      {/* 查看video引导视频 */}
      {video && showVideo && (
        <ShowVideo onClick={() => setShowVideo(false)}>
          <Video
            controls
            autoPlay
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <source src={video} type="video/mp4" />
            <track kind="captions" />
          </Video>
        </ShowVideo>
      )}
      {/* 查看引导图片 */}
      {/* <ImgPreview show={showImg} url={detailPic} onClose={() => setShowImg(false)} /> */}
    </Item>
  );
};

export default ({ kycCode }) => {
  const theme = useTheme();
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  return (
    <Wrapper>
      <Tips1Wrapper>
        <TextWrapper>
          <BlackBold>
            {_tHTML('authentication.handlePic.guide1', { style: 'boldBlackText' })}
          </BlackBold>
          <NeededAssetsTip>{_t('selfService.auth.guide2.des')}</NeededAssetsTip>
        </TextWrapper>
        <NeededAssetsItem style={{ margin: '4px 0' }}>
          <ICHookOutlined size="16px" color={theme.colors.primary} />
          {_tHTML('authentication.handlePic.guide3', { style: 'tipColor' })}
        </NeededAssetsItem>
        <NeededAssetsItem style={{ margin: '4px 0' }}>
          <ICHookOutlined size="16px" color={theme.colors.primary} />
          {_tHTML('authentication.handlePic.guide4', { style: 'tipColor', code: kycCode })}
        </NeededAssetsItem>
        <NeededAssetsItem>
          <ICHookOutlined size="16px" color={theme.colors.primary} />
          {_tHTML('authentication.handlePic.guide5', {
            style: 'tipColor',
            date: moment().format('YYYY-MM-DD'),
          })}
        </NeededAssetsItem>
      </Tips1Wrapper>

      <Divider style={{ margin: isH5 ? '20px 0' : '28px 0' }} />

      <ImgGuide>
        {map(guideItems, (guide) => (
          <GuideItem key={guide.id} {...guide} />
        ))}
      </ImgGuide>
      {/* <div className={styles.desc2}>
        {_tHTML('authentication.handlePic.tip', { style: styles.redText })}
      </div> */}
    </Wrapper>
  );
};
