/**
 * Owner: mage.tai@kupotech.com
 */
import Link from "@/components/common/Router/link";
import NameBox from "@/routes/price/components/NameBox";
import styles from "./useColumns.module.scss";
import useTranslation from "@/hooks/useTranslation";
import { trackClick } from "gbiz-next/sensors";
import useScreen from "@/hooks/useScreen";
import { getUtmLink } from "@/tools/getUtm";

import ChangeRate from "./ChangeRate";
import CoinCurrency from "./CoinCurrency";
import { useCallback, useMemo } from "react";
import { addLangToPath } from "@/tools/i18n";
import { IS_CLIENT } from "@/config/env";
import { getSiteConfig } from "kc-next/boot";
import { PointType } from "@/config/base";

const PriceStyle = {
  display: "flex",
  "flex-direction": "column",
};

const useColumns = (isRTL: boolean, keyName: string) => {
  const { TRADE_HOST } = getSiteConfig();
  const { _t } = useTranslation();
  const { isLg, isSm } = useScreen();

  const align = isRTL ? "right" : "left";

  const handeTrack = useCallback((record: any, index: number)=>{
    trackClick(['B5CoinsPriceHomePage', ['coinsDetail', '1']], {
      symbol: record.name,
      currency: record.name,
      after_page_id: 'B5CoinPriceDetails',
      type: PointType[keyName],
      norm_version: 1,
      sortPosition: index+1,
    });
  }, [keyName]);

  const cols = useMemo(() => {
    return [
      {
        title: _t("ftKHvVSnsYu1ErFEdLyqF9"),
        dataIndex: "name",
        key: "name",
        // align: 'left',
        align,
        className: "first-col",
        render: (text, record, index) => (
          <a
            href={addLangToPath(`/price/${record.name.toUpperCase()}`)}
            onClick={(evt) => evt.preventDefault()}
          >
            <NameBox
              iconUrl={record.iconUrl}
              fullName={record.fullName}
              code={record.name}
              isInTable
            />
          </a>
        ),
      },
      {
        title: _t("npDAsizBeMEcNh2JwYjTEe"),
        dataIndex: "price",
        key: "price",
        // align: 'left',
        align,
        render: (val, row) => {
          const { symbolCode } = row;
          const [baseCurrency, quoteCurrency] = symbolCode?.split("-") || [];
          return (
            <div style={!isLg ? PriceStyle : {}}>
              <CoinCurrency
                className={styles.coinCurrencyWrapper}
                baseCurrency={baseCurrency}
                coin={quoteCurrency}
                value={val}
                needShowEquelFlag={false}
                hideLegalCurrency
                useLegalChars
                spaceAfterChar={false}
              />
              {!isLg && (
                <ChangeRate
                  value={row.changeRate}
                  style={{ fontSize: isSm ? "12px" : "16px" }}
                />
              )}
            </div>
          );
        },
      },
      {
        title: _t("jrfs81t3P5Rt46UwnXEEVx"),
        dataIndex: "changeRate",
        key: "changeRate",
        // align: 'left',
        align,
        responsive: ["lg"],
        render: (changeRate) => {
          return <ChangeRate value={changeRate} style={{ fontSize: "16px" }} />;
        },
      },
      {
        title: _t("58tGsqcpRgrXRod7gj7saJ"),
        dataIndex: "marketCap",
        responsive: ["lg"],
        key: "marketCap",
        // align: 'left',
        align,
        render: (val, row) => {
          const { symbolCode } = row;
          const [baseCurrency, quoteCurrency] = symbolCode?.split("-") || [];
          if (!val) {
            return "--";
          }
          return (
            <div>
              <CoinCurrency
                className={styles.coinCurrencyWrapper}
                baseCurrency={baseCurrency}
                coin={quoteCurrency}
                value={val}
                needShowEquelFlag={false}
                hideLegalCurrency
                useLegalChars
                spaceAfterChar={false}
              />
            </div>
          );
        },
      },
      {
        title: _t("ntYeNCxQmsYCdijdUGuHCP"),
        dataIndex: "action",
        key: "action",
        align: isRTL ? "left" : "right",
        className: "last-col",
        render: (text, record, index) => {
          const bestSymbol = record?.symbolCode;
          const bestUrl = addLangToPath(`${TRADE_HOST}/${bestSymbol}`);
          const url = getUtmLink(bestUrl);
          const hrefProp: any = {};

          if (TRADE_HOST && bestSymbol) {
            hrefProp.href = url;
          }

          return (
            <>
              <Link
                className={styles.detailLink}
                href={addLangToPath(`/how-to-buy/${record.name}`)}
                target="_blank"
                onClick={(event) => {
                  event.stopPropagation();
                  handeTrack(record, index);
                }}
              >
                {_t("s1wwRgBMhUBYxWZCUejd8Y")}
              </Link>
              {record.symbolCode && (
                <Link
                  className={styles.linkWrapper}
                  target="_blank"
                  dontGoWithHref={true}
                  {...hrefProp}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handeTrack(record, index);
                    const bestUrl = addLangToPath(
                      `${TRADE_HOST}/${bestSymbol}`
                    );
                    const url = getUtmLink(bestUrl);

                    IS_CLIENT && window.open(url, "_blank");
                  }}
                  rel="noreferrer"
                >
                  {_t("market.all.crypto.btn")}
                </Link>
              )}
              <Link
                className={styles.detailLink}
                data-inspector="detail-link"
                href={`/price/${record.name.toUpperCase()}`}
                dontGoWithHref={true}
              >
                {_t("details")}
              </Link>
            </>
          );
        },
      },
    ];
  }, [TRADE_HOST, _t, align, handeTrack, isLg, isRTL, isSm]);

  return cols;
};

export default useColumns;
