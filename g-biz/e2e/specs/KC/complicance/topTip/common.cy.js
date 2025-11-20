/* eslint-disable no-undef */
describe('顶飘出现场景测试', () => {
  const signUpPath = '/ucenter/signup';

  beforeEach(() => {
    // 其他国家ip顶飘展示
    cy.commonTopRestrictNotice();
    cy.complianceFree();
  });

  it(`任意ip顶飘展示正常展示顶飘, path:${signUpPath}`, () => {
    cy.waitForSSG(signUpPath);
    cy.get('[data-inspector="inspector_top_restrict_notice"]').should('exist');
  });
});
