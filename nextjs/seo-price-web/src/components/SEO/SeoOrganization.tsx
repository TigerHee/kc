/**
 * Owner: ella@kupotech.com
 */
import CustomHead from "@/components/CustomHead";

const jsonLd = `{
  "@context": "http://schema.org",
  "@type": "Organization",
  "additionaltype": "https://en.wikipedia.org/wiki/Cryptocurrency_exchange",
  "name": "${window._BRAND_NAME_}",
  "url": "https://www.kucoin.com",
  "alternateName": [
  "庫幣",
  "クーコイン",
  "쿠코인"
  ],
  "description": "${window._BRAND_NAME_} is a secure cryptocurrency exchange that allows you to buy, sell, and trade Bitcoin, Ethereum, and 1300+ trading pairs",
  "foundingDate": "2017",
  "founder": [
    {
    "@type": "Person",
    "name": "Johnny Lyu",
    "sameAs": [
    "https://www.linkedin.com/in/johnny-lyu-2a0932252",
    "https://twitter.com/lyu_johnny",
    "https://www.crunchbase.com/person/johnny-lyu",
    "https://www.nasdaq.com/authors/johnny-lyu",
    "https://www.entrepreneur.com/en-au/author/johnny-lyu3"
    ]
    }
  ],
  "sameAs": [
     "https://play.google.com/store/apps/details?id=com.kubi.kucoin",
      "https://apps.apple.com/us/app/kucoin-buy-bitcoin-ether/id1378956601",
      "https://www.crunchbase.com/organization/kucoin",
      "https://golden.com/wiki/KuCoin_Exchange-NMGDK49",
      "https://pitchbook.com/profiles/company/234559-90",
      "https://twitter.com/KuCoinCom",
      "https://www.facebook.com/kucoinofficial",
      "https://www.linkedin.com/company/kucoin",
      "https://www.youtube.com/c/KuCoinExchange",
      "https://www.wikidata.org/wiki/Q97572932",
      "https://golden.com/wiki/KuCoin_Exchange-NMGDK49",
      "https://www.investopedia.com/kucoin-review-5214172",
      "https://www.forbes.com/advisor/investing/cryptocurrency/kucoin-review/",
      "https://coinmarketcap.com/exchanges/kucoin/",
      "https://app.dealroom.co/companies/kucoin"
  ],
  "logo": "https://assets.staticimg.com/cms/media/3gfl2DgVUqjJ8FnkC7QxhvPmXmPgpt42FrAqklVMr.png",
  "slogan": "The People's Exchange",
  "mainEntityOfPage": "https://www.kucoin.com",
  "award":"Best Crypto Exchanges for 2021 by Forbes"
}`;

// 只配置了英文首页
const SeoOrganization = ({ currentLang, pathname }) => {
  if (currentLang !== 'en_US' || pathname !== '/') {
    return '';
  }

  return (
    <CustomHead>
      <script type="application/ld+json" data-inspector="seo-organization">
        {jsonLd}
      </script>
    </CustomHead>
  );
};

export default SeoOrganization;
