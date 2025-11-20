/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 日本用户访问
    cy.countryJP();
    cy.complianceFree();
  });

  it(`${url} 土耳其站footer模块检查`, () => {
    // 日本用户访问
    // cy.countryJP();
    cy.waitForSSG(url);

    // 检查Support列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Support"]').should('exist');
    // 检查Legal列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Legal"]').should('exist');
    // 检查Company列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Company"]').should('exist');
    // 检查Community列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Community"]').should('exist');
    // 检查TokenPrice列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_TokenPrice"]').should('exist');
    // 检查TokenPrice列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Trade"]').should('exist');
    // 检查Product列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_TRProduct"]').should('exist');

    // 检查Serve列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Serve"]').should('not.exist');
    // 检查Business列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Business"]').should('not.exist');
    // 检查Learn列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Learn"]').should('not.exist');
    // 检查Developer列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Developer"]').should('not.exist');
    // 检查Partner列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Partner"]').should('not.exist');
    // 检查AppDownload列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_AppDownload"]').should('not.exist');
  });

  it('土耳其站 footer静态文本检查', () => {
    cy.waitForSSG(url);
    // 检查 Corporate 静态文案
    cy.get('[data-inspector="inspector_footer_isStaticText"]').should('exist');
  });
});
