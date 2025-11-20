const url = '/account/api/create/security';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    // url 不包含 /account/api/create/security
    cy.url().should('not.include', '/account/api/create/security');
    // 重定向到 /account/api 页面
    cy.url().should('include', '/account/api');
    // 具体逻辑在 /account/api/create 页面测试
  });
});
