describe('/spotlight7 页面测试', () => {
  it('spotlight7 页面正常工作 @level:p1', () => {
    cy.intercept('GET', '**_api/promotion/campaign/cms**',).as('getCampaignInfo');
    cy.waitForSSG('/spotlight-center');
    cy.wait('@getCampaignInfo', { timeout: 60000 }).then((res)=> {
      const { data } = res.response.body;
      const item = data.items.find((item) => item.type === 15);
      if(item) {
        cy.get("[data-inspector='type-15']").first().click();
        cy.document().its('body').should('not.be.empty');
        cy.get('div[data-inspector="inspector_spotlight7"]').should('exist');
        cy.get('div[data-inspector="inspector_spotlight7_banner"]').should('exist');
        cy.get('div[data-inspector="inspector_spotlight7_content"]').should('exist');
      }
    });
  });
});
