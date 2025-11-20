/* eslint-disable no-undef */

const url = '/ucenter/signup';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 奥地利用户访问
    cy.countryAT();
    cy.setComplianceApi({
      'compliance.homepage.signupGuide.1': false,
      'compliance.signup.leftIndia.1': false,
    });
  });

  it(`${url} 奥地利用户访问 注册页面 合规巡检`, () => {
    cy.waitForSiteConfig(url);
    // 注册区域存在
    cy.get('[data-inspector="signup-content-box"]').should('exist');

    // 输入手机号
    cy.get('[data-inspector="signin_account_input"] input')
      .clear()
      .type('138888');

    cy.get('[data-inspector="phone-selector-text"]').should('not.contain.text', '+44');
  });
});
