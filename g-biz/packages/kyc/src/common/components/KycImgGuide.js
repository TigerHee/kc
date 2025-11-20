/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useCallback } from 'react';
import { ImgPreview, useTheme } from '@kufox/mui';
import { css } from '@emotion/react';
import { useTranslation } from '@tools/i18n';
import { map } from 'lodash';

import draftPhoto from '../../../static/images/kyc2/guide/draft.svg';
import draftBgPhoto from '../../../static/images/kyc2/guide/draft_bg.svg';
import handPhoto from '../../../static/images/kyc2/guide/handlephoto.svg';
import handBgPhoto from '../../../static/images/kyc2/guide/handlephoto_bg.svg';
import kycVideoBgPhoto from '../../../static/images/kyc2/guide/kyc_video_bg.svg';

const guideItems = [
  {
    title: 'account.kyc.kyc2.imgGuide.item1.title',
    headerPic: draftBgPhoto,
    detailPic: draftPhoto,
    desc: 'account.kyc.kyc2.imgGuide.clickImg.desc',
  },
  {
    title: 'account.kyc.kyc2.imgGuide.item2.title',
    headerPic: handBgPhoto,
    detailPic: handPhoto,
    desc: 'account.kyc.kyc2.imgGuide.clickImg.desc',
  },
  {
    title: 'account.kyc.kyc2.imgGuide.item3.title',
    headerPic: kycVideoBgPhoto,
    detailPic: null,
    desc: 'account.kyc.kyc2.imgGuide.clickVideo.desc',
    video: 'https://assets.staticimg.com/static/KYC2.mp4',
  },
];

const useStyle = ({ color }) => {
  return {
    imgGuide: css`
      font-size: 14px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      @media screen and (max-width: 470px) {
        flex-direction: column;
        align-items: center;
      }
    `,
    guideWarn: css`
      font-size: 14px;
      color: #eb6666;
      margin-top: 12px;
    `,
    item: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      @media screen and (max-width: 470px) {
        margin-bottom: 20px;
      }
      & > img {
        width: 172px;
        height: 116px;
        cursor: pointer;
        transition: all 0.3s ease;
        @media screen and (max-width: 768px) {
          width: 109px;
          height: 74px;
        }
      }
    `,
    title: css`
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 22px;
      color: ${color.text};
      font-weight: 500;
      transition: all 0.3s ease;
      @media screen and (max-width: 768px) {
        font-size: 12px;
        line-height: 20px;
      }
    `,
    desc: css`
      margin-top: 8px;
      text-align: center;
      cursor: pointer;
      font-size: 12px;
      line-height: 20px;
      color: ${color.text60};
    `,
    showVideo: css`
      position: fixed;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    `,
    video: css`
      outline: none !important;
      width: 100%;
      max-width: 800px;
    `,
  };
};

const GuideItem = ({ classes, video, title, headerPic, detailPic, desc }) => {
  const { t: _t } = useTranslation('kyc');
  const [showVideo, setShowVideo] = useState(false);
  const [showImg, setShowImg] = useState(false);
  const onClick = useCallback(() => {
    video ? setShowVideo(true) : setShowImg(true);
  }, [setShowVideo, setShowImg]);

  return (
    <div css={classes.item}>
      <span css={classes.title}>{_t(title)}</span>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img src={headerPic} onClick={onClick} alt="" />
      <span css={classes.desc} onClick={onClick}>
        {_t(desc)}
      </span>
      {/* 查看video引导视频 */}
      {video && showVideo && (
        <div
          css={classes.showVideo}
          onClick={() => {
            setShowVideo(false);
          }}
        >
          <video
            css={classes.video}
            controls
            autoPlay
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <source src={video} type="video/mp4" />
            <track kind="captions" />
          </video>
        </div>
      )}
      {/* 查看引导图片 */}
      <ImgPreview show={showImg} url={detailPic} onClose={() => setShowImg(false)} />
    </div>
  );
};

export default () => {
  const { t: _t } = useTranslation('kyc');
  const theme = useTheme();
  const classes = useStyle({ color: theme.colors });
  return (
    <>
      <div css={classes.imgGuide}>
        {map(guideItems, (guide) => (
          <GuideItem classes={classes} {...guide} />
        ))}
      </div>
      <div css={classes.guideWarn}>{_t('account.kyc.kyc2.imgGuide.do.warn')}</div>
    </>
  );
};
