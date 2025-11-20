describe('price 所有币种', () => {
  beforeEach(() => {
    cy.intercept(/quicksilver/).as('priceAPI');
    cy.waitForSSG('/price');
    cy.wait('@priceAPI');
  });

  it('正常展示', () => {
    cy.get("[data-inspector='inspector_header']").should('exist');
    cy.get("[data-inspector='inspector_FAQ']").should('exist');
    cy.get("[data-inspector='inspector_allPanel']").should('exist');
  });

  it('搜索', () => {
    cy.get('[data-inspector="price-list-search"] input').focus().type('BTC');
    cy.get('[data-inspector="price-list-search"] input').trigger('keydown', {
      keyCode: 13,
      which: 13,
      key: 'Enter',
    });
    cy.get("[data-inspector='inspector_allPanel']").should('contain', 'BTC');
  });

  it('点击详情', () => {
    cy.get("[data-inspector='detail-link']").first().click();
    cy.get("[data-inspector='price-detail-page']").should('exist');
    cy.go('back');
  });

});
