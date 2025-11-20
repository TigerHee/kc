/* eslint-disable no-undef */

// g-biz 展业中台合规巡检基础配置
const forbiddenPagesConfig = {
  forbidden_pages: ['/markets'],
};

const marketsPage = '/markets';

describe(`【${marketsPage}】forbidden page检查`, () => {
  beforeEach(() => {
    cy.setComplianceApi({
      ...forbiddenPagesConfig,
    });
  });

  it(`${marketsPage} 展业中台禁止页面检查`, () => {
    cy.waitForSSG(marketsPage);
    cy.url().should('include', '/restrict');
  });
});
