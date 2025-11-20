/**
 * Owner: eli.xiang@kupotech.com
 */
import { Trans } from '@tools/i18n';
import addLangToPath from '@tools/addLangToPath';

const currentYear = new Date().getFullYear();

const defaultConfig = {
  utcOffset: 8, // footer底部展示的时区
  showServeTime: true, // 是否展示时间，包含了成交额的展示
  showMarketsAmount: true,
  copyrightText: `Copyright © 2017 - ${currentYear} KuCoin.com. All Rights Reserved.`, // 版权文案
  showKucoinPay: true,
  showMediaKit: true, // 是否启用media kit入口
  showCompanyTerms: true, // 是否启用公司条款入口
  showCompanyPolicy: true, // 是否启用公司策略入口
  showRiskStatement: true, // 是否启用风险描述入口
  showAMLAndCFT: true, // 是否启用AML和CFT入口
  showLawRequests: true, // 是否启用法律请求入口
  showWhistleblower: true, // 是否启用举报入口
  showGemSpace: true, // 是否启用 GemSpace 入口
  showSpotlight: true, // 是否启用 Spotlight 入口
  showP2pMerchant: true, // 是否启用 P2P商家 入口
  showCompanyLegal: false, // 是否启用法律文件入口，目前默认关闭只给au站开
  showLearnHowToBuy: true, // 是否展示footer Learn How to Buy链接
  showConverter: true, // 是否展示footer Converter链接
  showLicenses: false, // 是否展示Licenses链接
  showRaiseCompliant: false, // 是否展示Raise a Complaint 链接
  disclaimerDesc: () => {},
  highRiskDesc: () => {},
  apiDocsPath: '/docs-new', // API 文檔路径
  sdkDocsPath: '/docs-new/sdk', // SDK 文檔路径
  licensePath: '', // footer license 路径
  payMerchantPath: '', // kucoinPay Merchant 路径
  raiseComplaintPath: '', // 提交客诉链接
  delistingsPath: '/information/currencyOffline',
  siteMapPath: '/sitemap/crypto/1',
  showBlog: true,
  showKucoinlabs: true,
  showVentures: true,
  showPoR: true,
  showAmbassador: false,
  showAnnouncement: true,
  hideFooterBaseVolAmount: false,
};

const KC = {
  ...defaultConfig,
  payMerchantPath: '/pay/merchant',
  showAmbassador: true,
  email: 'Audit@kucoin.com',
};

const TR = {
  ...defaultConfig,
  showServeTime: false,
  showMarketsAmount: false,
  copyrightText: `Copyright © 2017 - ${currentYear} KuCoin.tr. All Rights Reserved.`,
  showKucoinPay: false,
  showWhistleblower: false,
};

const TH = {
  ...defaultConfig,
  utcOffset: 7,
  showMarketsAmount: false,
  copyrightText: `Copyright © ${currentYear} KuCoin.th. All Rights Reserved.`,
  showKucoinPay: false,
  highRiskDesc: (_t) => _t('dbd084bea3b64800a20d'),
  showWhistleblower: false,
};

const CL = {
  ...defaultConfig,
};

const AU = {
  ...defaultConfig,
  disclaimerDesc: (_t, currentLang) => {
    const siteConfig = window._WEB_RELATION_ || {};
    const { KUCOIN_HOST } = siteConfig;
    return (
      <div>
        <p>{_t('7491f90ce9044000a73e')}</p>
        <p>{_t('1474c934f0914000a670')}</p>
        <p>{_t('0dae29edf03b4000acb4')}</p>
        <p>
          <Trans
            i18nKey="a6232d7829b24800a9d0"
            ns="footer"
            values={{
              url: addLangToPath(`${KUCOIN_HOST}/support/categories/47134508281145`, currentLang),
            }}
            components={{
              a: (
                // eslint-disable-next-line jsx-a11y/control-has-associated-label
                <a
                  href={addLangToPath(
                    `${KUCOIN_HOST}/support/categories/47134508281145`,
                    currentLang,
                  )}
                  target="_blank"
                />
              ),
            }}
          />
        </p>
      </div>
    );
  },
  showLearnHowToBuy: false,
  showConverter: false,
  showMediaKit: false,
  showCompanyTerms: false,
  showCompanyPolicy: false,
  showRiskStatement: false,
  showAMLAndCFT: false,
  showLawRequests: false,
  showWhistleblower: false,
  showGemSpace: false,
  showSpotlight: false,
  showP2pMerchant: false,
  showCompanyLegal: true, // 暂时只给au站加一项
  showLicenses: false, // au站隐藏License入口
  showRaiseCompliant: true,
  apiDocsPath: '/en-au/docs-new',
  sdkDocsPath: '/en-au/docs-new/sdk',
  licensePath: '/support/47497300093962',
  raiseComplaintPath: '/support/requests?ticket_form_id=93',
  delistingsPath: '',
  siteMapPath: '',
};

const EU = {
  ...defaultConfig,
  copyrightText: `Copyright © ${currentYear} KuCoin.eu. All Rights Reserved.`,
  showLearnHowToBuy: false,
  showConverter: false,
  showGemSpace: false,
  showRaiseCompliant: true,
  apiDocsPath: '/en-eu/docs-new',
  sdkDocsPath: '/en-eu/docs-new/sdk',
  raiseComplaintPath: '/support/requests?ticket_form_id=103',
  delistingsPath: '',
  siteMapPath: '',
  showBlog: false,
  showKucoinlabs: false,
  showVentures: false,
  showPoR: false,
  showAnnouncement: false,
  hideFooterBaseVolAmount: true,
  email: 'complaints@kucoin.eu',
  showWhistleblower: false,
};

const tenant = window._BRAND_SITE_;
const tenantConfig =
  {
    KC,
    TR,
    TH,
    CL,
    AU,
    EU,
  }[tenant] || KC;

export { tenantConfig, tenant };
