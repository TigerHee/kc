/**
 * Owner: will.wang@kupotech.com
 */
import { Accordion } from "@kux/mui-next";
import { useCallback, useMemo, useState } from "react";
import { trackClick } from "gbiz-next/sensors";
import styles from "./styles.module.scss";
import { usePriceStore } from "@/store/price";
import useTranslation from "@/hooks/useTranslation";
import { useMount } from "ahooks";
import { getPagedCurrencyList } from "@/services/market";
import { getCoinsCategory } from "@/services/price";

const { AccordionPanel } = Accordion;

const FAQ = () => {
  const { t, _tHTML } = useTranslation();
  const hotCoins = usePriceStore((s) => s.hotCoins);
  const [isActive, setIsActive] = useState("0");
  const [onLineCoins, setOnLineCoins] = useState(null);
  const [allCoins, setAllCoins] = useState(null);
  const [
    [hot1 = "--", hot2 = "--", hot3 = "--", hot4 = "--", hot5 = "--"],
    setHotList,
  ] = useState<string[]>([]);

  const onOpenHandle = useCallback((key) => {
    trackClick(["BScoinPrice", ["FAQ", `${key}`]]);
    setIsActive(key);
  }, []);

  useMount(() => {
    getPagedCurrencyList({
      dataSource: "Kucoin",
      pageIndex: 1,
      pageSize: 30,
    }).then((res) => {
      setOnLineCoins(res?.data?.totalNum);
    });

    getCoinsCategory({
      currencyCode: "",
      sortField: "",
      sortType: "",
      source: "",
      pageIndex: 1,
      pageSize: 100,
    }).then((res) => {
      setAllCoins(res.data?.totalNum ?? "--");
    });
  });

  // 按24小时交易额降序
  useMount(() => {
    setHotList(
      [...(hotCoins || [])]
        .sort((a, b) => +b.volValue - +a.volValue)
        .map((coin) => coin.name)
    );
  });

  return (
    <section className={styles.priceAllFAQ} data-inspector="inspector_FAQ">
      <Accordion
        bordered
        accordion
        activeKey={isActive}
        onChange={onOpenHandle}
      >
        <AccordionPanel
          header={
            <h3 className={styles.question} data-isactive={isActive === "1"}>
              {t("7SjMgFZ319biSdyYNNmBbF")}
            </h3>
          }
          key={"1"}
          className={`${styles.itemFAQ} ${styles.itemFAQMargin}`}
        >
          <p className={styles.answer}>
            {_tHTML("whWFjTNsdp5AsRDxpBEA74", {
              allCoins: allCoins ?? "--",
              onLines: onLineCoins ?? "--",
            })}
          </p>
        </AccordionPanel>
        <AccordionPanel
          header={
            <h3 className={styles.question} data-isactive={isActive === "2"}>
              {t("p8hZSq8MZY1GD5mF26zWG7")}
            </h3>
          }
          key={"2"}
          className={styles.itemFAQ}
        >
          <p className={styles.answer}>
            {t("bRwvbcaYivgeV9pyc5EYaZ", { hot1, hot2, hot3, hot4, hot5 })}
          </p>
        </AccordionPanel>
        <AccordionPanel
          header={
            <h3 className={styles.question} data-isactive={isActive === "3"}>
              {t("qpxZ4tKZJ4BpugcfVweCXT")}
            </h3>
          }
          key={"3"}
          className={`${styles.itemFAQ} ${styles.itemFAQMargin}`}
        >
          <p className={styles.answer}>{t("tjTKuBTDiPeNHGB8vgNVEG")}</p>
        </AccordionPanel>
        <AccordionPanel
          header={
            <h3 className={styles.question} data-isactive={isActive === "4"}>
              {t("4qiaXUeexdqg85znkNYJwQ")}
            </h3>
          }
          key={"4"}
          className={`${styles.itemFAQ}`}
        >
          <p className={styles.answerTitle}>{t("qyabM89eACpiQL6fafQxBa")}</p>
          <p className={styles.answer}>{t("bhab2gQzWyEXRwBFjH744f")}</p>
          <p className={styles.answerTitle}>{t("voyBeZ7BnqKT2NkVnjoEQo")}</p>
          <p className={styles.answer}>{t("hHQJtGmdtxnaiWWHZpZSev")}</p>
          <p className={styles.answerTitle}>{t("eUWyw8fZgbn8LzjtqK6tdv")}</p>
          <p className={styles.answer}>{t("uZo3b7z9agQQZsH9xRuPR4")}</p>
          <p className={styles.answerTitle}>{t("fiaXYB4W3rYV4Yt6J6k38q")}</p>
          <p className={styles.answer}>{t("1KisHkr1c8SRq4TRAAirmu")}</p>
          <p className={styles.answerTitle}>{t("3Y2eDGjHE7Yznh1NFNYWVc")}</p>
          <p className={styles.answer}>{t("bQowBd19npeZRqaN36Yuzc")}</p>
          <p className={styles.answerTitle}>{t("dLf4V9wELyMrVvwwV12wWp")}</p>
          <p className={styles.answer}>{t("fYFHYBcRBsoRBiymeVvn9h")}</p>
        </AccordionPanel>
      </Accordion>
    </section>
  );
};

export default FAQ;
