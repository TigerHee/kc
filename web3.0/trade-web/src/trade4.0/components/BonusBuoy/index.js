/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useMemo, useCallback, useRef } from 'react';
import {
  Wrapper,
  Content,
  ButtonPro,
  CloseFilledPro,
  CollapseWrapper,
  Area,
} from './style';
import Draggable from 'react-draggable';
import { _t, _tHTML, getHrefProps } from 'utils/lang';
import { commonSensors } from 'components/Margin/sensors';
import { composeSpmAndSave } from 'utils/ga';
import { useSelector, shallowEqual } from 'dva';
import useIsMobile from '@/hooks/common/useIsMobile';

// 文案只有中文和英文
const ACTIVITY = {
  // 杠杆赠金‰
  MARGIN_BONUS: {
    i18n: {
      zh_CN: '體驗金',
      other: 'Bonus',
    },
    goUrl: '/assets/bonus/margin-bonus',
    spm: ['marginBonus', '1'],
    goGa: () => {
      const sensorsFunc = commonSensors?.marginBonus?.go;
      if (sensorsFunc) sensorsFunc();
    },
    closeGa: () => {
      const sensorsFunc = commonSensors?.marginBonus?.close;
      if (sensorsFunc) sensorsFunc();
    },
  },
  // 免息券
  TARGET_LEND: {
    i18n: {
      zh_CN: '免息券',
      other: 'Interest Free',
    },
    goUrl: '/assets/bonus/loans',
    spm: ['InterestFreeCoupon', '1'],
    goGa: () => {
      const sensorsFunc = commonSensors?.InterestFreeCoupon?.go;
      if (sensorsFunc) sensorsFunc();
    },
    closeGa: () => {
      const sensorsFunc = commonSensors?.InterestFreeCoupon?.close;
      if (sensorsFunc) sensorsFunc();
    },
  },
};
/**
 * BnusBuoy
 * 移动端点击不生效 @see https://stackoverflow.com/questions/63516368/is-the-react-draggable-not-support-on-mobile-platform
 */
const BnusBuoy = (props) => {
  const { ...restProps } = props;
  const [collapse, setCollapse] = useState(false);
  const { marginBonusStatus, lastCouponInfo } = useSelector(({ bonus }) => ({
    marginBonusStatus: bonus.marginBonusStatus,
    lastCouponInfo: bonus.lastCouponInfo,
  }), shallowEqual);
  const currentLang = useSelector((state) => state.app.currentLang);
  const draggingRef = useRef(false);
  const isMobile = useIsMobile();

  const isZh = currentLang === 'zh_CN';
  const { isUnReceive } = marginBonusStatus;

  const activityCode = useMemo(() => {
    if (isUnReceive) return 'MARGIN_BONUS';
    if (lastCouponInfo?.couponId) return 'TARGET_LEND';
    return '';
  }, [isUnReceive, lastCouponInfo]);

  const i18n = ACTIVITY[activityCode]?.i18n?.[isZh ? 'zh_CN' : 'other'];

  const handleCollapse = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (ACTIVITY[activityCode]?.closeGa) {
        ACTIVITY[activityCode].closeGa();
      }
      setCollapse(true);
    },
    [activityCode],
  );

  const handleClick = useCallback(
    (e) => {
      if (draggingRef.current) {
        return;
      }

      if (collapse) {
        setCollapse(false);
        return;
      }

      const spm = ACTIVITY[activityCode].spm;
      if (spm) {
        const url = ACTIVITY[activityCode].goUrl;
        composeSpmAndSave(url, spm);
      }
      if (ACTIVITY[activityCode]?.goGa) {
        ACTIVITY[activityCode].goGa();
      }

      window.open(getHrefProps(ACTIVITY[activityCode].goUrl));
    },
    [activityCode, collapse],
  );

  const handleDrag = useCallback(() => {
    draggingRef.current = true;
  }, []);

  const handleStop = useCallback(() => {
    setTimeout(() => {
      draggingRef.current = false;
    });
  }, []);

  if (!ACTIVITY[activityCode]) return null;

  return (
    <Draggable
      bounds="body"
      axis="y"
      onDrag={handleDrag}
      onStop={handleStop}
      cancel={isMobile ? '.cancel' : null}
    >
      <Wrapper {...restProps}>
        <CollapseWrapper collapse={collapse}>
          <Area onClick={handleClick} collapse={collapse}>
            <Content />
            <ButtonPro size="small" className="cancel">
              {i18n}
            </ButtonPro>
          </Area>
          <CloseFilledPro
            onClick={handleCollapse}
            collapse={collapse}
            className="cancel"
          />
        </CollapseWrapper>
      </Wrapper>
    </Draggable>
  );
};

export default memo(BnusBuoy);
