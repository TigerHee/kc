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

  it('分页', () => {
    cy.scrollTo('bottom');
    cy.get("[data-inspector='next-btn']").click();
    cy.get("[data-inspector='inspector_allPanel']").should('exist');
    cy.get("[data-inspector='pre-btn']").click();
    cy.get("[data-inspector='inspector_allPanel']").should('exist');
  });

  it('tab 点击', () => {
    cy.get("[data-inspector='topGaining']").click();
    cy.location('pathname').should('contain', '/price/hot-list');
    cy.get("[data-inspector='topLosing']").click();
    cy.location('pathname').should('contain', '/price/top-gainers');
    cy.get("[data-inspector='newCryptocurrencies']").click();
    cy.location('pathname').should('contain', '/price/new-coins');
  });
});
