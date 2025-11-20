/**
 * Owner: melon@kupotech.com
 */
describe('/activity/anniversary页面测试', () => {
  it('/activity/anniversary 页面正常工作', () => {
    cy.visit('/activity/anniversary');
    cy.get("[data-inspector='activity_anniversary_page']").should('exist');
  });
});
