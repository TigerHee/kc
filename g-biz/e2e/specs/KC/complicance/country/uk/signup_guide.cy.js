/* eslint-disable no-undef */

const url = '/';
const signUpUrl = '/ucenter/signup';

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

  it(`${url} 英国用户访问 首页注册引导 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.get('[data-inspector="inspector_signup_guide_dialog"]').should('not.exist');
  });

  it(`${signUpUrl} 英国用户访问 注册页面挽留弹窗 合规巡检`, () => {
    cy.waitForSSG(signUpUrl);
    // inspector_header_logo
    cy.get('[data-inspector="inspector_header_logo"]').click({ force: true });

    cy.get('[data-inspector="inspector_signup_leave_dialog"]').should('not.exist');
  });
});
