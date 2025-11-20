/* eslint-disable no-undef */

// public-web 展业中台合规巡检基础配置
const publicWebSpmConfig = {
  'kcWeb.BSfastTrade.Express.1': true,
  'kcWeb.BSfastTrade.ConvertPlus.1': true,
};

const convertPage = '/convert';

describe(`【${convertPage}】public-web  未登录合规检查`, () => {
  beforeEach(() => {
    cy.setComplianceApi({
      ...publicWebSpmConfig,
    });
  });

  it(`${convertPage} public-web展业元素检查`, () => {
    cy.waitForSSG(convertPage);
    // kcWeb.BSfastTrade.Express.1
    cy.get('[data-inspector="convert_page_more_isShowConvertPlus"]').should('not.exist');
    // kcWeb.BSfastTrade.ConvertPlus.1
    cy.get('[data-inspector="convert_page_more_isShowExpress"]').should('not.exist');
  });
});
