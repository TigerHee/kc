/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 英国用户访问
    cy.countryGB();
    cy.setComplianceApi({
      'compliance.homepage.stepGuide.UK': false,
      'kcWeb.B5trading.test': false,
      'compliance.homepage.productSuiteKuCoinEarn.UK': false,
      'compliance.signup.leftIndia.1': false,
      'compliance.header.kurewards.1': false,
      'compliance.signin.slogan.1': false,
      'compliance.account.vipRate.1': false,
      'compliance.signup.preferredProfessionals.1': false,
      'compliance.kyc.benifitUrl.1': false,
      'compliance.header.referralAndKuRewards.1': false,
      'compliance.account.newUserBenefit.1': false,
      'compliance.homepage.newCoin.1': false,
      'compliance.account.market.1': false,
      'compliance.homepage.banner.slogan': false,
      'compliance.header.turkeyEntry.1': false,
      'compliance.homepage.faq.1': false,
      'compliance.signup.leaveDialog.1': false,
      'compliance.account.marketHotTab.1': false,
      'compliance.homepage.signupGuide.1': false,
      'compliance.homepage.securityTitle.UK': false,
      'compliance.signup.hiddenMktContent.1': false,
      'compliance.footer.isUKForbidden.1': false,
      'compliance.signup.leadingCyptocurrencyExchange.1': false,
    });
  });

  it(`${url} 英国用户访问 footer主站模块`, () => {
    cy.waitForSSG(url);

    // 检查Company列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Company"]').should('exist');
    // 检查Product列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Product"]').should('not.exist');
    // 检查Serve列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Serve"]').should('exist');
    // 检查Business列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Business"]').should('exist');
    // 检查TokenPrice列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_TokenPrice"]').should('not.exist');
    // 检查Learn列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Learn"]').should('not.exist');
    // 检查Developer列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Developer"]').should('exist');
    // 检查Partner列是否展示 英国合规
    // cy.get('[data-inspector="inspector_footer_categoryKey_Partner"]').should('not.exist');
    // 检查AppDownload列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_AppDownload"]').should('not.exist');
    // 检查Community列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Community"]').should('not.exist');
  });

  it('英国用户访问 主站合规path展示', () => {
    cy.waitForSSG(url);
    // 检查blog
    cy.get('[data-inspector="inspector_footer_a_path_/blog"]').should('not.exist');
    // 检查媒体工具
    cy.get('[data-inspector="inspector_footer_a_path_/news/en-kucoin-media-kit"]').should(
      'not.exist',
    );
    // 检查KuCoin Labs
    cy.get('[data-inspector="inspector_footer_a_path_/land/kucoinlabs"]').should('not.exist');
    // 检查KuCoin Ventures
    cy.get('[data-inspector="inspector_footer_a_path_/kucoin-ventures"]').should('not.exist');
    // 检查邀請好友
    cy.get('[data-inspector="inspector_footer_a_path_/referral"]').should('not.exist');
    // 检查合夥人計劃
    cy.get('[data-inspector="inspector_footer_a_path_/affiliate"]').should('not.exist');
  });
});
