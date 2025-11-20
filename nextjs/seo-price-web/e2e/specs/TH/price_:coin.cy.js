describe('price 详情页测试', () => {
  beforeEach(() => {
    cy.visit('/price/BTC');
  });

  it('正常展示', () => {
    // 左边内容
    cy.get("[data-inspector='inspector_kcs_kline']").should('exist');
    cy.get("[data-inspector='inspector_kcs_info']").should('exist');
    cy.get("[data-inspector='base-info-content']").should('exist');
    cy.get("[data-inspector='faq-info']").should('exist');

    // 右边内容
    // BTC在泰国站或者土耳其站未上架的话可能无买币模块
    cy.get("[data-inspector='price-coin-rank']").should('exist');
  });
});
