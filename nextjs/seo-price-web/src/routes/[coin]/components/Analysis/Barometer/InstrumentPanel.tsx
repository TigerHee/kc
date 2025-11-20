/**
 * Owner: will.wang@kupotech.com
 */
import styles from "./instrumentPanel.module.scss";
import { useLang } from "gbiz-next/hooks";
import clsx from "clsx";
import useTranslation from "@/hooks/useTranslation";
import Image from "next/image";

import Bg from "@/assets/price/bg_dashboard.half.png";

// 这里是一个半圆，按道理是十等分，每两份占一个区域，但是设计的底图一头一尾部分占比只有一半，所以实际是 1 + 6 + 1 等于 8 份
// 一份的度数为 180 / 8 = 22.5
const values = [0, 0.2, 0.4, 0.6, 0.8];
const degs = [22.5, 45, 45, 45, 22.5];

export default (props) => {
  const { mValue, mType, color } = props;
  const { _t } = useTranslation();
  // m 值在 [0, 1] 范围内五等分为五个区间，按 0.2 计算 m 值所在区间内的占比
  const degPct = (mValue - values[mType]) / 0.2;
  // 根据所属区间的夹角度数计算 m 值的夹角度数，再加上之前区间的度数
  let deg = degs[mType] * degPct;
  for (let i = 0; i < mType; i++) {
    deg += degs[i];
  }
  const { isRTL } = useLang();

  return (
    <div className={styles.panelWrapper}>
      <div
        className={clsx(styles.circleWrapper, {
          [styles.isRTL]: isRTL,
        })}
      >
        <span className={clsx(styles.pannelText, styles.strongSell)}>
          {_t("gBtigUehCYV53rtrSAMMAx")}
        </span>
        <span className={clsx(styles.pannelText, styles.sell)}>
          {_t("vU1Q3Q7Sntt9e3SVBoBKE1")}
        </span>
        <span className={clsx(styles.pannelText, styles.neutral)}>
          {_t("hEdXFWDjuWBYrFqwjk97Av")}
        </span>
        <span className={clsx(styles.pannelText, styles.buy)}>
          {_t("f4xKVT87uC9bmggc5az4Sj")}
        </span>
        <span className={clsx(styles.pannelText, styles.strongBuy)}>
          {_t("4XHZSDfUREhWbAtDqzxex3")}
        </span>

        <div
          className={styles.circleBox}
          
        >
          <Image id="img" src={Bg} alt="board" width="136" height="136" />
          <div className={styles.innerCircle} style={{ background: color }} />
          <div className={styles.outerCircle} style={{ background: color }} />
          <svg
            className={styles.pointer}
            width="51"
            height="2"
            viewBox="0 0 51 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
            transform: `rotate(${deg}deg)`,
          }}
          >
            <rect width="51" height="2" rx="1" fill={color} />
          </svg>
        </div>
      </div>
    </div>
  );
};
