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

  it(`${url} 英国用户访问 登录页面 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.get('[data-inspector="inspector_home_banner_slogan"]').should('not.exist');
    // inspector_product_suite_kc_earn
    cy.get('[data-inspector="inspector_product_suite_kc_earn"]').should(
      'have.css',
      'visibility',
      'hidden',
    );

    // 检查英国banner slogan是否存在
    cy.get('[data-inspector="inspector_home_banner_uk_slogan"]').should('exist');
    // 检查英国banner security title不存在
    cy.get('[data-inspector="inspector_security_title"]').should('not.exist');
    // 检查英国banner security button不存在
    cy.get('[data-inspector="inspector_security_btn"]').should('not.exist');
    // 检查英国Step guide不存在
    cy.get('[data-inspector="inspector_home_guide"]').should('not.exist');
  });
});
