/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getTenantConfig } from "packages/footer/tenantConfig";
import { useFooterStore } from "packages/footer/model";
import styles from "./styles.module.scss";
import { bootConfig } from "kc-next/boot";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export default function ServerTime() {
  const tenantConfig = getTenantConfig(bootConfig._BRAND_SITE_);
  const serverTime = useFooterStore((store) => store.serverTime);
  const pullServerTime = useFooterStore((store) => store.pullServerTime);
  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      pullServerTime();
    }, 1000 * 60 * 5);
    pullServerTime();
    return () => {
      interval && clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setCountDown(serverTime);
    const interval = setInterval(() => {
      setCountDown((countDown) => countDown + 1000);
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [serverTime]);

  if (typeof window === "undefined") return null;

  if (countDown < 1 || serverTime < 1) {
    return null;
  }

  return (
    <div className={styles.date}>
      {dayjs(countDown)
        .utc()
        .utcOffset(tenantConfig?.utcOffset)
        .format("YYYY-MM-DD HH:mm:ss")}
      &nbsp;&nbsp;(UTC+{tenantConfig?.utcOffset})
    </div>
  );
}
