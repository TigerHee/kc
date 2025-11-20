/* eslint-disable no-undef */

const signupPage = '/ucenter/signup';

describe(`【${signupPage}ucenter-web 注册流程营销合规检查`, () => {
  beforeEach(() => {
    cy.complianceBoxSignupMkt();
  });

  it(`${signupPage} 对接展业中台隐藏注册流程营销内容`, () => {
    cy.waitForSSG(signupPage);
    cy.get('[data-inspector="inspector_signup_gift_button"]').should('not.exist');
    // inspector_signup_success_guide
    cy.get('[data-inspector="signup_left_mtk_content"]').should('not.exist');
  });
});

const accountPage = '/account';
describe(`【${accountPage} ucenter-web 注册成功营销合规检查`, () => {
  beforeEach(() => {
    cy.complianceBoxSignupMkt();
    cy.login();
  });

  it(`${accountPage} 对接展业中台隐藏注册成功营销内容`, () => {
    cy.waitForSSG(accountPage);
    cy.get('[data-inspector="inspector_signup_success_guide"]').should('not.exist');
  });
});
