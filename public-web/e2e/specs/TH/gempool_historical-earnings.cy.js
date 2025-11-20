describe("/gempool/historical-earnings 页面测试", () => {
  beforeEach(() => {
    cy.login();
  });

  it("gempool historical earnings 页面正常工作 @level:p1", () => {
    cy.visit("/gempool/historical-earnings");

    cy.document().its("body").should("not.be.empty");

    cy.get("#gempoolHistoricalEarningsPage").should("exist");

    cy.get(
      'div[data-inspector="inspector_gempoolHistoryEarnings_tabs"]'
    ).should("exist");

    cy.get(
      'section[data-inspector="inspector_gempoolHistoryEarnings_list"]'
    ).should("exist");
  });
});
