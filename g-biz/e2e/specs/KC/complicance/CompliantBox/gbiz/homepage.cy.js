/* eslint-disable no-undef */

// g-biz 展业中台合规巡检基础配置
const gBizSpmConfig = {
  'compliance.header.right.download': true,
  'compliance.header.marketingHeader.1': true,
};

const homePage = '/';

describe(`【${homePage}】未登录合规检查`, () => {
  beforeEach(() => {
    // setAllCompliance();
    cy.markAsNovice();
    cy.setComplianceApi({
      ...gBizSpmConfig,
    });
  });

  it(`${homePage} 主站合规元素检查`, () => {
    cy.waitForSSG(homePage);
    // compliance.header.right.download
    cy.get('[data-inspector="inspector_header_download_box"]').should('not.be.visible');
    // compliance.header.marketingHeader.1
    cy.get('[data-inspector="inspector_new_bie_nav"]').should('not.be.visible');
  });
});
