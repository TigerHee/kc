/**
 * Owner: will.wang@kupotech.com
 */
import { useMemo, useState } from "react";
import Icon from "@/assets/coinDetail/triangle.svg";
import Preview from "../Preview/Preview";
import styles from "./style.module.scss";
import useTranslation from "@/hooks/useTranslation";
import { trackClick } from "gbiz-next/sensors";
import clsx from "clsx";

export default ({ data, index, isAbout }) => {
  const { t } = useTranslation();
  const [opened, setOpen] = useState(isAbout ? true : !index);
  // 机器翻译标签
  const isMachineTranslate = useMemo(() => {
    return data?.answer?.some((item) => !!item?.machineTranslate);
  }, [data]);
  return (
    <details open={true}>
      <summary
        className={clsx(styles.head, {
          [styles.opened]: opened,
        })}
        onClick={() => {
          setOpen(!opened);
          try {
            trackClick(["currencyMoreInformation", "4"], {});
          } catch (e) {
            console.log("e", e);
          }
        }}
      >
        {data.question}
      </summary>
      <div
        className={clsx(styles.cont, {
          [styles.opened]: opened,
        })}
        onClick={data.clickEvent || null}
      >
        <Preview content={data.answer || []} />
        {!!isMachineTranslate && (
          <div className={styles.statement}>{t("bwySeBEUCYa1nCAUD3LFti")}</div>
        )}
      </div>
    </details>
  );
};
