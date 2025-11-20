describe("/gempool/history 页面测试", () => {
  it("gempool history 页面正常工作 @level:p1", () => {
    cy.visit("/gempool/history");

    cy.document().its("body").should("not.be.empty");

    cy.get("#gempoolHistoryPage").should("exist");

    cy.get('div[data-inspector="inspector_gempoolHistory_list"]').should(
      "exist"
    );
  });
});
