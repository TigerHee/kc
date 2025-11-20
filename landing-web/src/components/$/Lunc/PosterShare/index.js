/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 业务组件，动态海报分享
 */
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import { LANDING_HOST } from 'utils/siteConfig';
import { useIsMobile } from 'components/Responsive';
import { addLangToPath, _t } from 'utils/lang';
import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import { create } from 'utils/createImg';
import saveAs from 'utils/saveAs';
import preloadImg from 'utils/preloadImg';
import ShareModel from './ShareModel';
import { SHAREBG, MAXLENGTH_LANGS } from './config';

// 海报配置：根据语言和type得到目标海报
const posterConfig = {
  activity: ({ currentLang }) => {
    return SHAREBG[currentLang] || SHAREBG['en_US'];
  },
};

let _timer = null;
const posterBgId = 'posterBgPrediction';
let imgMemoMap = {}; // 图片缓存
let nowId = ''; // 当前处理的奖品id

const PosterShare = (props, ref) => {
  const { message } = useSnackbar();
  const {
    btnClickCheck = undefined, // 点击按钮前置检查
    setShareLoading = () => {}, // 点击分享的loading管理
    type = 'activity', // 默认是活动分享海报
  } = props || {};
  const { isInApp, currentLang } = useSelector(state => state.app);
  const { inviteCode } = useSelector(state => state.kcCommon); // 邀请码

  const [shareShow, setShareShow] = useState(false); // 分享弹窗
  const imgBack = useRef(''); // 海报背景图
  // 分享给好友的链接
  const shareLink = useMemo(
    () => {
      return inviteCode
        ? addLangToPath(`${LANDING_HOST}/lunc?rcode=${inviteCode}`)
        : addLangToPath(`${LANDING_HOST}/lunc`);
    },
    [inviteCode],
  );
  const isMobile = useIsMobile();
  const shareTitle = useMemo(() => {
    const str = _t('79yckvGUuh5pR7Ri9Eyn3E');
    return encodeURIComponent(str);
  }, []);

  // 必须是相对路径url或者base64，否则无法下载
  const goUseImage = useCallback(
    (path, isUseImg = true) => {
      if (!path) {
        return;
      }
      if (!isInApp && !isUseImg) {
        setShareShow(true);
        return;
      }
      if (isInApp) {
        // 直接调起app分享
        JsBridge.open({
          type: 'func',
          params: {
            name: 'share',
            category: 'img',
            pic: path,
          },
        });
      } else {
        // 下载
        saveAs(path, `poster_${Date.now()}`);
      }
    },
    [isInApp],
  );

  // isUseImg 是否直接使用图片，一般是下载或者app分享
  const createImg = useCallback(
    (isUseImg = true) => {
      if (imgMemoMap[nowId]) {
        goUseImage(imgMemoMap[nowId], isUseImg);
      } else {
        let positionY_top = 583 + 14;
        let positionY_bottom = 605 + 12;
        if (MAXLENGTH_LANGS.indexOf(currentLang) > -1) {
          positionY_top = 575 + 14;
          positionY_bottom = 597 + 12;
        }
        setShareLoading(true);
        // 保证state更新，动画出现
        setTimeout(async () => {
          let texts = [
            {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
              text: _t('7Werx8gL9wvSer9muVBLDt'),
              x: 60,
              y: positionY_top,
              lineHeight: 18,
              lineSpace: 0,
              needCompute: true,
              newLine: true,
              wordSpace: 2,
            },
            {
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 12,
              fontWeight: '400',
              text: _t('79yckvGUuh5pR7Ri9Eyn3E'),
              x: 60,
              y: positionY_bottom,
              lineHeight: 16,
              lineSpace: 0,
              needCompute: true,
              newLine: true,
              firstWidth: 232,
              maxWidth: 232,
              wordSpace: 2,
            },
          ];
          // 创建
          create({
            height: 642,
            isZh: false,
            hidePre: !!isInApp,
            quality: 0.95,
            format: 'jpeg',
            bg: imgBack.current || null,
            texts,
            shapes: [
              {
                color: '#fff',
                x: 313,
                y: 577,
                width: 50,
                height: 50,
              },
            ],
            imgsCommon: [
              {
                img: document.getElementById('lunc-QRCode-url'),
                x: 316,
                y: 580,
                width: 44,
                height: 44,
              },
            ],
            maxWidth: 300,
          })
            .then(res => {
              setShareLoading(false);
              imgMemoMap[nowId] = res;
              goUseImage(res, isUseImg);
            })
            .catch(err => {
              console.error(err);
              setShareLoading(false);
            });
        }, 100);
      }
    },
    [goUseImage, setShareLoading, isInApp, currentLang],
  );

  const shareHandle = useCallback(
    async () => {
      const checked = typeof btnClickCheck === 'function' ? await btnClickCheck() : true;
      if (!checked) {
        return;
      }
      // 创建动态海报进行分享，创建前确保背景图片已经加载完成
      if (imgBack.current) {
        createImg(isInApp);
      } else {
        setShareLoading(true);
        // 监听imgBack.current是否有值，最多等待20秒
        let time = 0;
        _timer = setInterval(() => {
          time += 500;
          if (imgBack.current || time > 20000) {
            setShareLoading(false);
            clearInterval(_timer);
            _timer = null;
            if (time > 20000) {
              message.warning({ content: 'build failed, please try again ', theme: 'dark' });
            } else {
              createImg(isInApp);
            }
          }
        }, 500);
      }
    },
    [btnClickCheck, createImg, isInApp, message, setShareLoading],
  );

  useEffect(() => {
    return () => {
      clearInterval(_timer);
      _timer = null;
    };
  }, []);

  useEffect(
    () => {
      let func = res => {
        imgBack.current = res;
      };
      const bg = posterConfig[type]({ currentLang });

      // 预加载海报图
      if (bg) {
        imgBack.current = '';
        imgMemoMap = {};
        preloadImg(bg, posterBgId)
          .then(res => {
            func(res);
          })
          .catch(err => {
            message.warning({ content: err, theme: 'dark' });
          });
      }

      return () => {
        func = () => {};
      };
    },
    [isInApp, isMobile, type, currentLang, message],
  );

  useImperativeHandle(ref, () => ({
    goShare: () => {
      shareHandle();
    },
    visible: shareShow,
  }));

  if (isInApp) {
    return null;
  }

  return (
    <React.Fragment>
      <ShareModel
        open={shareShow}
        onCancel={() => setShareShow(false)}
        isZh={false}
        shareUrl={shareLink}
        shareTitle={shareTitle}
        createImg={createImg}
        poster={imgMemoMap[nowId]}
      />
    </React.Fragment>
  );
};

export default forwardRef(PosterShare);
