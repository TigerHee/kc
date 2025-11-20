import { url } from '../common/account_security_unbind-phone.cy';

const inspectorId = 'account_security_unbind_phone';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it('泰国站不支持解绑手机号', () => {
    cy.visit(url);
    cy.url().should('include', '/account/security');
    cy.get(`[data-inspector="${inspectorId}"]`).should('not.exist');
  });
});
