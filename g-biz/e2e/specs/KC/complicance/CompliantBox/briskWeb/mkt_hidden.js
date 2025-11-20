/* eslint-disable no-undef */

const homepage = '/';

describe(`【${homepage}】brisk-web  未登录合规检查`, () => {
  beforeEach(() => {
    cy.complianceBoxSignupMkt();
  });

  it(`${homepage} 对接展业中台隐藏注册流程营销内容`, () => {
    cy.waitForSSG(homepage);
    cy.get('[data-inspector="inspector_signup_guide_dialog"]').should('not.exist');
  });
});
