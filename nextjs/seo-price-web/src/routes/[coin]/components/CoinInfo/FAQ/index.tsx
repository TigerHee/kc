/**
 * Owner: kevyn.yu@kupotech.com
 */
import { numberFormat } from '@kux/mui-next/utils';
import { divide } from '@/tools/math';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getBuyCampaign } from '@/services/price';
import { reportApiError } from 'src/tools/sentry';
import { handleMarkCap } from '../PriceInfo/SupplyFormat';
import Collapse from './Collapse/Collapse';
import styles from './styles.module.scss';
import { useLang } from 'gbiz-next/hooks';
import useMarketCap from '@/hooks/useMarketCap';
import { useCurrencyStore } from '@/store/currency';
import { useCoinDetailStore } from '@/store/coinDetail';
import useTranslation from '@/hooks/useTranslation';
import clsx from 'clsx';
import { trackClick } from 'gbiz-next/sensors';
import useTransPrice from '@/hooks/useTransPrice';
import { getTextFromHtmlString } from '@/tools/seoTools';
import Title from '@/components/common/Title';
import { getSiteConfig } from 'kc-next/boot';
import { addLangToPath } from '@/tools/i18n';
import { getHtmlToReact } from '@/hooks/useHtmlToReact';
import { FAQJson } from 'gbiz-next/seo';
import CustomHead from '@/components/CustomHead';

const kucoins = ['Kucoin Unsale', 'Kucoin'];


const existNumber = (data) => {
  // 价格字段，值为undefined，null，空字符串，认为值不存在
  return !(
    typeof data === 'undefined' ||
    data === null ||
    (typeof data === 'string' && data === '')
  );
};

export default (props) => {
  const siteConfig = getSiteConfig();
  const { currentLang } = useLang();
  const { t: _t, _tHTML } = useTranslation();
  const { coinInfo, bestSymbol, latestPrice, coinInfoReady } = useCoinDetailStore(
    (state) => state,
  );
  const { faqs, coinName = '', code = '', isUnsale, isTemporary, dataSource } = coinInfo;
  const isUnsaleATemporary = isUnsale || isTemporary;
  const currency = useCurrencyStore((state) => state.currency);
  const [how2buy, setHow2buy] = useState<any>(null);
  const tradeData = useCoinDetailStore((state) => bestSymbol ? state.tradeData[bestSymbol] : null);

  const genDefaultFaqs = useCallback((coinName, coinCode, currency, isUnsaleATemporary) => {
    const question2 = _t('a8k7A1NvaCXjazse8iJL1V', { coinName, coinCode });
    const answer2 = _t('bW9w6p5cvPUVc8WzTcEBuB', {
      coinName,
      coinCode,
      currency,
      url: addLangToPath(`${siteConfig.KUCOIN_HOST}/converter/${coinCode}-${currency}`),
    });
  
    const result: any = [];
  
    if (!isUnsaleATemporary) {
      result.push({
        question: question2,
        answer: [{ type: 'RICHTEXT', subText: answer2 }],
        clickEvent: (e) => {
          if (e.target.tagName === 'A') {
            trackClick(['Counter', '1'], { symbol: coinCode });
          }
        },
      });
    }
  
    return result;
  }, [_t, siteConfig.KUCOIN_HOST]);

  const defaultFaqs = useMemo(
    () => genDefaultFaqs(coinName, code, currency, isUnsaleATemporary),
    [genDefaultFaqs, coinName, code, currency, isUnsaleATemporary],
  );

  const latestPriceData = latestPrice || tradeData?.price;

  // 历史最高价
  const hightPrice = useTransPrice({
    price: tradeData?.high || coinInfo.ath,
    symbol: bestSymbol,
    isUnsaleATemporary: isUnsaleATemporary,
    needTransfer: false,
    needHandlePrice: true,
  });
  // 历史最低
  const lowPrice = useTransPrice({
    price: tradeData?.low,
    symbol: bestSymbol,
    isUnsaleATemporary: isUnsaleATemporary,
    needTransfer: false,
    needHandlePrice: true,
  });

  //市值
  const markCap = useMarketCap({ needTransfer: false, value: coinInfo.marketCap });

  useEffect(() => {
    if (coinName && code && coinInfoReady) {
      getBuyCampaign(code)
        .then((res) => {
          if (res.success && res.data) {
            const { paymentMethodCodeList, spotTradeSymbol } = res.data;
            if (paymentMethodCodeList && paymentMethodCodeList.length) {
              // 支持信用卡/银行转账
              let answer;
              if (kucoins.includes(dataSource)) {
                // 支持快捷买币
                if (
                  paymentMethodCodeList.includes('checkout_pci') ||
                  paymentMethodCodeList.includes('balance')
                ) {
                  answer = _tHTML('5UtxinpAfztDS2PJz4YTYP', {
                    fullname: coinName,
                    name: code,
                    url: addLangToPath(siteConfig.FASTCOIN_HOST),
                  }, {
                    // 要自定义a标签url
                    a: <a href={addLangToPath(siteConfig.FASTCOIN_HOST)} />,
                  });

                } else {
                  answer = getHtmlToReact(_t('fRCGkrjzjJoSuJNqQbBZTb', {
                    name: code,
                    spoturl: addLangToPath(`${siteConfig.KUCOIN_HOST}/trade/${code}-USDT`),
                    p2purl: addLangToPath(`${siteConfig.KUCOIN_HOST}/otc/buy/${code}-USDT`),
                    url: addLangToPath(`${siteConfig.KUCOIN_HOST}/markets/spot/${code}`),
                  }), false);
                }
              } else {
                answer = _tHTML('uh5e41UHX5ThD7pUenEdfG', { fullname: coinName, name: code });
              }

              setHow2buy({
                question: _tHTML('sWdSu7kvotVvP9npf5MZms', { fullname: coinName, name: code }),
                answer: [
                  {
                    type: 'REACTTEXT',
                    text: answer,
                  },
                ],
              });
            }
          }
        })
        .catch((err) => {
          reportApiError('币种支付方式获取失败', err);
        });
    }
  }, [code, dataSource, coinName, coinInfoReady, _tHTML, siteConfig.FASTCOIN_HOST, siteConfig.KUCOIN_HOST, _t]);

  const faqData: any[] = useMemo(() => {
    const hightPriceBase = tradeData?.high || coinInfo.ath;
    if (coinName && code) {
      const data: any[] = [];
      if (existNumber(hightPriceBase)) {
        const percentageData = existNumber(latestPriceData)
          ? Math.abs(+divide(Number(hightPriceBase) - Number(latestPriceData), hightPriceBase, 8))
          : NaN;
        const percentage = Number.isNaN(percentageData)
          ? '--'
          : numberFormat({
              number: percentageData,
              options: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 },
              lang: currentLang,
            });
        data.push({
          question: _tHTML('d3MMHuSiiguxjStLQzec66', { fullname: coinName, name: code }),
          answer: [
            {
              type: 'REACTTEXT',
              text: _tHTML('6UwhHWc6KfGK552VKQYbk2', {
                fullname: coinName,
                name: code,
                price: hightPrice,
                percentage: percentage,
              }),
            },
          ],
        });
      }
      if (existNumber(tradeData?.low)) {
        const percentageData = existNumber(latestPriceData)
          ? Math.abs(+divide(Number(latestPriceData) - Number(tradeData?.low), Number(tradeData?.low), 8))
          : NaN;
        const percentage = Number.isNaN(percentageData)
          ? '--'
          : numberFormat({
              number: percentageData,
              options: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 },
              lang: currentLang,
            });
        data.push({
          question: _tHTML('1qgcwXhgie6mFtf5fsWa7S', { fullname: coinName, name: code }),
          answer: [
            {
              type: 'REACTTEXT',
              text: _tHTML('mvnDj4NrUvUhsEQNDfeewL', {
                fullname: coinName,
                name: code,
                price: lowPrice,
                percentage: percentage,
              }),
            },
          ],
        });
      }
      // 流通供应量
      const circulatingSupply = coinInfo.circulatingSupply
        ? handleMarkCap(coinInfo.circulatingSupply)
        : null;
      // 最大供应量
      const maxSupply = coinInfo.maxSupply ? handleMarkCap(coinInfo.maxSupply) : '--';
      if (circulatingSupply) {
        const now = moment();
        data.push({
          question: _tHTML('dzE2ihYF6P6A3bWnr16mph', { fullname: coinName, name: code }),
          answer: [
            {
              type: 'REACTTEXT',
              text: _tHTML('gE5gP2onmuwEYHomJGNHYn', {
                fullname: coinName,
                name: code,
                year: now.year(),
                month: now.month() + 1,
                day: now.date(),
                num: circulatingSupply,
                supply: maxSupply,
              }),
            },
          ],
        });
      }

      if (markCap) {
        data.push({
          question: _tHTML('idpD7Z68KFpdoERitUvRFJ', { fullname: coinName, name: code }),
          answer: [
            {
              type: 'REACTTEXT',
              text: _tHTML('5q473kfFFAWGqAspJFFGRh', {
                name: code,
                price: markCap || '--',
                marketValue: markCap || '--',
              }),
            },
          ],
        });
      }
      const dataSource = coinInfo.dataSource;
      let queanswer;
      if (kucoins.includes(dataSource)) {
        queanswer = _tHTML('u2SWzV6pq2nBDxJ6j9PrQ8', { fullname: coinName, name: code });
      } else {
        queanswer = _tHTML('soNsAuhD2v5CPCBy7BFVJG', { fullname: coinName, name: code });
      }
      data.push({
        question: _tHTML('ji32j1x9P8AH8ZPWBcKoXg', { fullname: coinName, name: code }),
        answer: [
          {
            type: 'REACTTEXT',
            text: queanswer,
          },
        ],
      });
      const faqDatas = [...defaultFaqs, ...(faqs || []), ...data];
      if (how2buy) {
        faqDatas.push(how2buy);
      }
      return faqDatas;
    }

    return [];
  }, [tradeData?.high, tradeData?.low, coinInfo.ath, coinInfo.circulatingSupply, coinInfo.maxSupply, coinInfo.dataSource, coinName, code, markCap, _tHTML, defaultFaqs, faqs, how2buy, latestPriceData, currentLang, hightPrice, lowPrice]);

  const faqJsonLD =  useMemo(() => {
    if (faqData?.length) {
      const _faqJsonLD = faqData?.map((item) => {
        let answerText = '';
        if (item.answer && item.answer.length) {
          item.answer.forEach((element) => {
            const type = element?.type?.toUpperCase();
            if (type === 'RICHTEXT') {
              answerText += getTextFromHtmlString(element?.subText);
            } else if (type === 'TEXT') {
              answerText += element?.text;
            } else if (type === 'REACTTEXT') {
              answerText += element?.text?.props?.dangerouslySetInnerHTML
                ? getTextFromHtmlString(element?.text?.props?.dangerouslySetInnerHTML?.__html)
                : element?.text;
            }
          });
        }
        return {
          question: item.question?.props?.dangerouslySetInnerHTML
            ? getTextFromHtmlString(item.question?.props?.dangerouslySetInnerHTML?.__html)
            : item.question,
          answer: answerText,
        };
      })
      .filter(item => {
        // TODO 这里之前的历史逻辑有问题，question和answer可能是react element，此处先过滤一下 
        return typeof item.answer === 'string' && typeof item.question === 'string';
      });
      return _faqJsonLD;
    }
    return [];
  }, [faqData]);

  return (
    <section className={clsx(styles.wrapper, {
      [styles.hide]: !faqData?.length
    })} data-ssg="faq-info"  id={props.id} data-inspector="faq-info">
      <CustomHead>
        <FAQJson faq={faqJsonLD} />
      </CustomHead>
      <header>
        <Title title={_t('coin.detail.coin.info.faq.title')} />
      </header>
      <Collapse data={faqData} data-ssg="faq" />
    </section>
  );
};