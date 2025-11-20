import { url } from '../common/account_security_unbind-email.cy';

const inspectorId = 'account_security_unbind_email';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('泰国站不支持解绑邮箱', () => {
    cy.visit(url);
    cy.url().should('include', '/account/security');
    cy.get(`[data-inspector="${inspectorId}"]`).should('not.exist');
  });
});
