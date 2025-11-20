/* eslint-disable no-undef */

import { KCMarketSiteConfig, getExist } from './utils';

export const url = '/account';

/** 检查用户清退 */
export const checkUserClearing = () => {
  // 拦截接口，模拟清退用户
  cy.intercept('/_api/user-dismiss/ip-dismiss/notice?bizType=EXAMINE_MESSAGE*', (req) => {
    req.reply((res) => {
      res.body.data.EXAMINE_MESSAGE = {
        dismiss: true,
        notice: {
          kycClearStatus: 1,
          kycClearAt: '2025-05-15 10:00:00'
        }
      }
    });
  });
  // 检查清退提示和「重新认证」按钮是否展示
  cy.get('[data-inspector="examine-tips"]').should('exist');
  cy.get('[data-inspector="examine-tips-btn"]').click();
  // 点击「重新认证」跳到 kyc 页
  cy.url().should('include', '/account/kyc');
}

export const interceptConfig = (tenant) => {
  if (tenant !== 'KC') {
    cy.intercept('GET', '/_api/ucenter/site-config*').as('siteConfig');
    cy.intercept('GET', '/_api/discover-front/v1/market/uc/module/config*').as('marketSiteConfig');
  }
  // 拦截展业规则
  cy.intercept('GET', '/_api/compliance-biz/web/compliance/rule*').as('complianceRule');
  // 拦截查询当前的 ip 地址
  cy.intercept('GET', '/_api/universal-core/ip/country*').as('ipCountry');
}

export const checkElements = (tenant = 'KC') => {
  let overviewConfig = null;
  let marketSiteConfig = null;
  let complianceRule = null;
  let isGBOrNoCountry = null;
  const check = () => {
    // 检查页面是否存在
    cy.get('[data-inspector="account_overview_page"]').should('exist');
    // 左边菜单栏存在
    cy.get('[data-inspector="account_menu"]').should('exist');
    
    // 用户基础信息存在
    cy.get('[data-inspector="account_overview_base_info"]').should(
      getExist(overviewConfig.supportMyInfo),
    );
    // 检查新人引导模块存在
    cy.get('[data-inspector="account_overview_get_started"]').should(
      getExist(overviewConfig.supportNewUserBenefits && !complianceRule['compliance.account.newUserBenefit.1']),
    );
    
    // 检查资产模块是否存在
    cy.get('[data-inspector="account_overview_balance"]').should('exist');
    // 资产模块-资产概览存在
    cy.get('[data-inspector="account_overview_balance"] a[href$="/assets"][target="_blank"]').should(
      getExist(overviewConfig.assetFuncs.includes('assetoverview')),
    );
    // 资产模块-委托查询存在
    cy.get(
      '[data-inspector="account_overview_balance"] a[href$="/order/trade"][target="_blank"]',
    ).should(getExist(overviewConfig.assetFuncs.includes('entrustedinquiry')));
    // 充币、买币、提币按钮存在
    cy.get('[data-inspector="account_overview_balance_deposit"]').should(
      getExist(overviewConfig.assetFuncs.includes('depositcoins')),
    );
    cy.get('[data-inspector="account_overview_balance_buy"]').should(
      getExist(overviewConfig.assetFuncs.includes('buycoins')),
    );
    cy.get('[data-inspector="account_overview_balance_withdraw"]').should(
      getExist(overviewConfig.assetFuncs.includes('withdrawalcoins')),
    );
    
    const showHot = !complianceRule['compliance.account.marketHotTab.1'] && marketSiteConfig.hot.open
    const showFavorites = !!marketSiteConfig.favorites.open;
    // 行情模块存在
    const showMarket = (showFavorites || showHot) && !(isGBOrNoCountry && tenant === 'TH')
    cy.get('[data-inspector="account_overview_market"]').should(getExist(showMarket));
    // 行情自选 tab 存在
    cy.get('[data-inspector="account_overview_market_favorites"]').should(
      getExist(showFavorites),
    );
    if (showFavorites) {
      cy.get('[data-inspector="account_overview_market_favorites"]').click();
    }
    // 行情 - 自选 - subTab
    const showSubTab = showMarket && marketSiteConfig.favorites.subModules.length > 0;
    cy.get('[data-inspector="account_overview_market_favorites_sub"]')
      .should(getExist(showSubTab))
    // 行情 - 自选 - 现货 tab
    const showSubTabSpot = showSubTab && marketSiteConfig.favorites.subModules.find((subTab) => subTab.name === 'SPOT')?.open;
    cy.get('[data-inspector="account_overview_market_favorites_spot"]')
      .should(getExist(showSubTabSpot));
    // 行情 - 自选 - 合约 tab
    const showSubTabFuture = showSubTab && marketSiteConfig.favorites.subModules.find((subTab) => subTab.name === 'FUTURE')?.open;
    cy.get('[data-inspector="account_overview_market_favorites_future"]')
      .should(getExist(showSubTabFuture));
    // 行情热门 tab 存在
    cy.get('[data-inspector="account_overview_market_hot"]').should(
      getExist(showMarket && showHot),
    );
    
    // vip 模块存在
    cy.get('[data-inspector="account_overview_vip_info"]').should(
      getExist(overviewConfig.supportVipRate && !complianceRule['compliance.account.vipRate.1']),
    );
    
    // 广告 banner 存在
    cy.get('[data-inspector="account_overview_banner"]').should(
      getExist(overviewConfig.supportActivityEntry && !complianceRule['compliance.account.rightBanner.1']),
    );
    
    // 公告中心存在
    cy.get('[data-inspector="account_overview_announcements"]').should(
      getExist(overviewConfig.supportNotice && !complianceRule['compliance.account.rightAnnouncements.1']),
    );
    
    // 下载模块存在
    cy.get('[data-inspector="account_overview_download"]').should(
      getExist(overviewConfig.supportDownloadGuide),
    );
  }

  cy.wait(['@siteConfig', '@complianceRule', '@ipCountry']).then(([{response: res1}, {response:res2}, {response:res3}]) => {
    overviewConfig = res1.body.data.myConfig.overviewConfig;
    complianceRule = res2.body.data?.config ?? {};
    const { countryCode } = res3.body.data ?? {};
    isGBOrNoCountry = countryCode === 'GB' || !countryCode;

    if (overviewConfig.supportList) {
      // 行情模块未完成多租户改造，主站还是用的写死配置
      if (tenant === 'KC') {
        marketSiteConfig = KCMarketSiteConfig;
        check();
      } else {
        cy.wait('@marketSiteConfig').then(({ response }) => {
          marketSiteConfig = response.body.data;
          check();
        });
      }
    } else {
      marketSiteConfig = {};
      check();
    }
  });
}
