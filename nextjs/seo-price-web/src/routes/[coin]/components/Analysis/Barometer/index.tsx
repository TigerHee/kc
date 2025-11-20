/**
 * Owner: will.wang@kupotech.com
 */
import { Spin } from "@kux/mui-next";
import InstrumentPanel from "./InstrumentPanel";
import useTranslation from "@/hooks/useTranslation";
import { useMemo } from "react";

import styles from "./styles.module.scss";

const M_LEVELS = ["STRONG_SELL", "SELL", "NEUTRAL", "BUY", "STRONG_BUY"];

export default (props) => {
  const { mValue, mType = 0, loading } = props;
  const level = M_LEVELS[mType];
  const { _t } = useTranslation();

  const TEXT_MAP = useMemo(() => {
    return {
      STRONG_SELL: {
        color: "#F35B5B",
        text: _t("gBtigUehCYV53rtrSAMMAx"),
      },
      SELL: {
        color: "#F98945",
        text: _t("vU1Q3Q7Sntt9e3SVBoBKE1"),
      },
      NEUTRAL: {
        color: "#737E8D",
        text: _t("hEdXFWDjuWBYrFqwjk97Av"),
      },
      BUY: {
        color: "#49CFAD",
        text: _t("f4xKVT87uC9bmggc5az4Sj"),
      },
      STRONG_BUY: {
        color: "#01BC8D",
        text: _t("4XHZSDfUREhWbAtDqzxex3"),
      },
    };
  }, [_t]);

  const { text, color } = TEXT_MAP[level];

  return (
    <Spin spinning={loading} type="normal">
      <div className={styles.wrapper} data-inspector="inspector_pa_barometer">
        <div className={styles.infoBox}>
          <dl>
            <dt
              className={styles.infoTitle}
              style={{
                color: color,
              }}
            >
              {text}
            </dt>
            <dd className={styles.infoDesc}>{_t("p9c9GH3SRDvQrrwkz4iKMW")}</dd>
          </dl>
          <small className={styles.infoTip}>
            <span className="strong">{_t("guAXke7vyoyq38hq4GsBiz")}：</span>
            {_t("wmrVa9FYL2h8gzErDtBifK")}
          </small>
        </div>
        <div className={styles.panelBox}>
          <InstrumentPanel color={color} mValue={mValue} mType={mType} />
        </div>
      </div>
    </Spin>
  );
};
