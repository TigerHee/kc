describe('/security detail web页面测试', () => {
  it('security detail 页面', () => {
    cy.visit('/security/account-security#1-1');
    cy.document().its('body').should('not.be.empty');
    cy.get('div[data-inspector="security_side_menu"]').should('exist');
    cy.get('section[data-inspector="security_content"]').should('exist');
    cy.get('aside[data-inspector="security_content_anchor"]').should('exist');
  });
});

describe('/security detail H5页面测试', () => {
  it('security detail 页面', () => {
    cy.visit('/security/account-security#1-1');
    cy.viewport('iphone-6');
    cy.document().its('body').should('not.be.empty');
    cy.get('section[data-inspector="security_content"]').should('exist');
    cy.get('div[data-inspector="security_mobile_menu"]').should('exist');
  });
});
