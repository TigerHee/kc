describe("/pre-market/myOrder 页面测试", () => {
  it("pre-market/myOrder 页面正常工作 @level:p1", () => {
    cy.waitForSSG('/pre-market/myOrder');

    cy.document().its("body").should("not.be.empty");

    cy.get('div[data-inspector="inspector_premarket_myorder_tabs"]').should("exist");

    cy.get('div[data-inspector="inspector_premarket_myorder_condition"]').should("exist");
    
    cy.get('div[data-inspector="inspector_premarket_myorder_table"]').should("exist");
    
  });
});