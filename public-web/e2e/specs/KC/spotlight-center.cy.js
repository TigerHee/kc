describe("/spotlight-center 页面测试", () => {
  it("spotlight-center 页面正常工作 @level:p1", () => {
    cy.visit("/spotlight-center");

    cy.document().its("body").should("not.be.empty");

    cy.get('div[data-inspector="activity_page"]').should("exist");

    cy.get('div[data-inspector="activity_page_carousel"]').should("exist");

    cy.get('div[data-inspector="activity_page_list"]').should("exist");
  });
});
