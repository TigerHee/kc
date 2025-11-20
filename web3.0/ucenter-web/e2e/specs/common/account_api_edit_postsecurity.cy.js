const url = '/account/api/edit/postsecurity';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    // cy.get('[data-inspector="api_edit_postsecurity_page"]').should('exist');
    // 重定向到 /api 页面
    cy.url().should('not.include', '/account/api/edit/postsecurity');
    // 重定向到 /account/api 页面
    cy.url().should('include', '/account/api');
  });
});
