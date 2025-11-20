const subId = 'xxxxx'; // 随便搞个id
const prefix = '/account-sub/api-manager/create/security';
const replacePrefix = '/account-sub/api-manager';
const url = `${prefix}/${subId}`;

describe(`【${url}】`, () => {
  it(`不可直接访问，重定向到【${replacePrefix}/${subId}】`, () => {
    cy.login();
    cy.visit(url);
    cy.url().should('include', `${replacePrefix}/${subId}`);
  });
});
