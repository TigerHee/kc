describe('price 详情页测试', () => {
  beforeEach(() => {
    cy.visit('/price/BTC');
  });

  it('正常展示', () => {
    // 左边内容
    cy.get("[data-inspector='inspector_kcs_kline']").should('exist');
    cy.get("[data-inspector='inspector_kcs_info']").should('exist');
    cy.get("[data-inspector='base-info-content']").should('exist');
    cy.get("[data-inspector='inspector_kcs_price_trend']").should('exist');
    cy.get("[data-inspector='inspector_pa_barometer']").should('exist');
    cy.get("[data-inspector='faq-info']").should('exist');

    // 右边内容
    cy.get("[data-inspector='inspector_kcs_buyform']").should('exist');
    cy.get("[data-inspector='price-coin-rank']").should('exist');
  });
});
