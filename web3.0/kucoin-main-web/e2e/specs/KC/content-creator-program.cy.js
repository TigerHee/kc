describe('/content-creator-program web页面测试', () => {
  it('content-creator-program', () => {
    cy.visit('/content-creator-program');

    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="content_creator_page"]').should('exist');
  });
});

describe('/content-creator-program h5页面测试', () => {
  it('content-creator-program', () => {
    cy.visit('/content-creator-program');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');

    cy.get('div[data-inspector="content_creator_page"]').should('exist');
  });
});
