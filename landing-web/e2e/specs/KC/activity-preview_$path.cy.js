
describe('lego2.0 preview', () => {
  it('should not visit preview page', () => {
    cy.visit('/land/activity-preview/123')
    cy.wait(5000);
    cy.url().should('not.contain', 'activity-preview');
  })
})