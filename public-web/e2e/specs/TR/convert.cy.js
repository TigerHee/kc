describe('/convert 页面测试', () => {
  it('convert 页面正常工作', () => {
    cy.waitForSSG('/convert');

    cy.document().its('body').should('not.be.empty');

    cy.get('#convertPage').should('exist');

    cy.get('div[data-inspector="convert_slogan"]').should('exist');

    cy.get('div[data-inspector="convert_tab_market"]').should('exist');

    cy.get('form[data-inspector="convert_market_form"]').should('exist');

    cy.get('div[data-inspector="convert_faq"]').should('exist');

    // 点击闪兑限价单Tab切换到限价单模式
    cy.get('div[data-inspector="convert_tab_limit"]')
      .should('exist')
      .then(($limitTab) => {
        cy.wrap($limitTab).click();
        cy.get('form[data-inspector="convert_limit_form"]').should('exist');
      });
  });
});
