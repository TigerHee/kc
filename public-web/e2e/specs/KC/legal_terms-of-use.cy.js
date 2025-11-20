const url = '/legal/terms-of-use';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="legal_independent_page"]').should('exist');
    // [data-inspector="article-detail"] innerText 的长度大于 100
    cy.get('[data-inspector="article-detail"]')
      .invoke('text')
      .should('have.length.greaterThan', 100);
  });
});
