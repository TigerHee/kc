/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 日本用户访问
    cy.countryJP();
    cy.complianceFree();
  });

  it(`${url} footer主站模块全部展示`, () => {
    // 日本用户访问
    // cy.countryJP();
    cy.waitForSSG(url);

    // 检查Company列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Company"]').should('exist');
    // 检查Product列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Product"]').should('exist');
    // 检查Serve列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Serve"]').should('exist');
    // 检查Business列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Business"]').should('exist');
    // 检查TokenPrice列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_TokenPrice"]').should('exist');
    // 检查Learn列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Learn"]').should('exist');
    // 检查Developer列是否展示
    cy.get('[data-inspector="inspector_footer_categoryKey_Developer"]').should('exist');
    // 检查Partner列是否展示 英国合规
    // cy.get('[data-inspector="inspector_footer_categoryKey_Partner"]').should('exist');
    // 检查AppDownload列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_AppDownload"]').should('exist');
    // 检查Community列是否展示 英国合规
    cy.get('[data-inspector="inspector_footer_categoryKey_Community"]').should('exist');
    // 检查主站展示24小时成交量
    cy.get('[data-inspector="inspector_footer_markets_amount"]').should('exist');
  });

  it('主站合规path全部展示', () => {
    cy.waitForSSG(url);
    // 检查blog
    cy.get('[data-inspector="inspector_footer_a_path_/blog"]').should('exist');
    // 检查媒体工具
    cy.get('[data-inspector="inspector_footer_a_path_/news/en-kucoin-media-kit"]').should('exist');
    // 检查KuCoin Labs
    cy.get('[data-inspector="inspector_footer_a_path_/land/kucoinlabs"]').should('exist');
    // 检查KuCoin Ventures
    cy.get('[data-inspector="inspector_footer_a_path_/kucoin-ventures"]').should('exist');
    // 检查邀請好友
    cy.get('[data-inspector="inspector_footer_a_path_/referral"]').should('exist');
    // 检查合夥人計劃
    cy.get('[data-inspector="inspector_footer_a_path_/affiliate"]').should('exist');
    // 检查SDK
    cy.get('[data-inspector="inspector_footer_a_path_/docs-new/sdk"]').should('exist');
    // 检查API文档
    cy.get('[data-inspector="inspector_footer_a_path_/docs-new"]').should('exist');
  });

  it(`${url} footer hover`, () => {
    // 日本用户访问
    cy.waitForSSG(url);
    // 检查举报通道是否展示
    cy.get('[data-inspector="inspector_footer_Whistleblower"]').should('exist');
    // 检查举报通道hover后元素存在
    cy.get('[data-inspector="inspector_footer_Whistleblower_children"]').should(
      'have.css',
      'display',
      'none',
    );
  });
});
