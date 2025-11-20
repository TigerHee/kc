/* eslint-disable no-undef */

const url = '/';
const signUpUrl = '/ucenter/signup';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 香港用户访问
    cy.countryHK();
    cy.setComplianceApi({
      'compliance.homepage.signupGuide.1': false,
      'compliance.signup.leaveDialog.1': false,
    });
  });

  it(`${url} 香港用户访问 首页注册引导 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.get('[data-inspector="inspector_signup_guide_dialog"]').should('not.exist');
  });

  it(`${signUpUrl} 香港用户访问 注册页面挽留弹窗 合规巡检`, () => {
    cy.waitForSSG(signUpUrl);
    // inspector_header_logo
    cy.get('[data-inspector="inspector_header_logo"]').click({ force: true });

    cy.get('[data-inspector="inspector_signup_leave_dialog"]').should('not.exist');
  });
});
