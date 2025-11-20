/* eslint-disable no-undef */

describe('英国顶飘出现场景测试', () => {
  const signUpPath = '/ucenter/signup';

  beforeEach(() => {
    // 英国ip顶飘展示
    cy.ukTopRestrictNotice();
    cy.complianceFree();
  });

  it(`英国ip顶飘展示正常展示顶飘, path:${signUpPath}`, () => {
    cy.waitForSSG(signUpPath);
    cy.get('[data-inspector="inspector_top_restrict_notice"]').should('exist');
  });
});
