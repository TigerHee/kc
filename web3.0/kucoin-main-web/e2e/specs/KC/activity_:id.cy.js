/**
 * Owner: melon@kupotech.com
 */
describe('activity/:id 页面测试', () => {
  it('/activity/:id 页面正常工作', () => {
    cy.visit('/activity/test01');
    cy.get("[data-path='/activity/test01']").should('exist');
  });
});
