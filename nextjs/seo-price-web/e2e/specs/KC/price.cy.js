describe('price 所有币种', () => {
  beforeEach(() => {
    cy.visit('/price');
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

  it('分页', () => {
    cy.scrollTo('bottom');
    cy.get("[data-inspector='next-btn']").click();
    cy.url().should('include', '/page/2');
    cy.get("[data-inspector='inspector_allPanel']").should('exist');
  });
});
