export const page404 = (path) => {
  it('404 页面', () => {
    cy.visit(path);
    cy.location('pathname').should('contain', '/404');
  });
};
