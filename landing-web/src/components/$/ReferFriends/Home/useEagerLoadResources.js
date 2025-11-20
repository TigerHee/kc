/**
 * Owner: gavin.liu1@kupotech.com
 */
import { useState, useCallback, useEffect, useRef } from 'react';

// home resources
import dotBgUrl from 'src/assets/referFriend/network-top-bg-dot.svg';
import linesBgUrl from 'src/assets/referFriend/network-top-bg-lines.svg';
import ruleIconUrl from 'src/assets/referFriend/rule-icon.svg';
import usdtIconUrl from 'src/assets/referFriend/usdt.svg';
import usdtCoinUrl from 'src/assets/referFriend/usdt-coin-4x.png';
import subTitleBgUrl from 'src/assets/referFriend/sub-title-bg.png';
import subTitleBgPrefixUrl from 'src/assets/referFriend/sub-title-bg-prefix.png';
import noDataIconUrl from 'src/assets/referFriend/no-data.svg';
import flashUrl from 'src/assets/referFriend/btn-flash.svg';
import awardBgCornerUrl from 'src/assets/referFriend/award-bg-corner.png';
import awardBgBorderUrl from 'src/assets/referFriend/award-bg-border.png';
import signupHelpIconUrl from 'src/assets/referFriend/signup-help.svg';
import signupIconUrl from 'src/assets/referFriend/signup-icon.svg';
import award1 from 'src/assets/referFriend/award1.svg';
import award2 from 'src/assets/referFriend/award2.svg';
import loadMoreIconUrl from 'src/assets/referFriend/load-more.svg';

// banner resources
import langCheckedSvg from 'assets/prediction/lang-checked.svg';
import backIconUrl from 'src/assets/referFriend/back.svg';
import shareIconUrl from 'src/assets/referFriend/share.svg';
import langArrowUrl from 'src/assets/referFriend/lang-arrow.svg';

// modal resources
import modalBottomBgImg from 'src/assets/referFriend/modal-bottom.png';
import spot from 'src/assets/referFriend/spot.svg';
import closeImg from 'src/assets/referFriend/close-icon.svg';
import circleImg from 'src/assets/referFriend/circle.png';
import bg from 'src/assets/referFriend/modal-bg.png';
import face from 'src/assets/referFriend/prize-face.svg';

export const IMAGES_MAP = {
  // home
  dotBgUrl,
  linesBgUrl,
  ruleIconUrl,
  usdtIconUrl,
  usdtCoinUrl,
  subTitleBgUrl,
  subTitleBgPrefixUrl,
  noDataIconUrl,
  flashUrl,
  awardBgCornerUrl,
  awardBgBorderUrl,
  signupHelpIconUrl,
  signupIconUrl,
  loadMoreIconUrl,
  // banner
  langCheckedSvg,
  backIconUrl,
  shareIconUrl,
  langArrowUrl,
  award1,
  award2,
  // modal
  modalBottomBgImg,
  spot,
  closeImg,
  circleImg,
  bg,
  face
};

export const useEagerLoadResources = () => {
  const isLoaded = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const loadAllImages = useCallback(async () => {
    const imagesList = Object.values(IMAGES_MAP);
    try {
      await Promise.all(imagesList.map((p) => loadImage(p)));
    } catch {
    } finally {
      setIsReady(true);
      isLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (isLoaded.current) {
      return;
    }
    loadAllImages();
  }, []);

  return isReady;
};

function loadImage(p) {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = p;
    image.onload = () => {
      resolve(true);
      image = null;
    };
    image.onerror = () => {
      resolve(false);
      image = null;
    };
  });
}
