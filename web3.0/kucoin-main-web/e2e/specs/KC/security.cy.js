describe('/security web页面测试', () => {
  it('security', () => {
    cy.visit('/security');

    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="security_index_content"]').should('exist');
    cy.get('div[data-inspector="security_content_partners"]').should('exist');
  });
});

describe('/security h5页面测试', () => {
  it('security', () => {
    cy.visit('/security');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="security_index_content"]').should('exist');
    cy.get('div[data-inspector="security_content_partners"]').should('exist');
  });
});
