import { url, checkElements, interceptConfig } from '../common/account_security.cy';
import { checkHrefNot404, checkRender } from '../common/utils';
import { closeSecurityPrompt } from '../common/utils';

describe(`【${url}】`, () => {
  it('检查可访问', () => {
    cy.login();
    cy.visit(url);
    checkRender('[data-inspector="account_security_page"]');
    // 死链检查
    checkHrefNot404('[data-inspector="account_security_page"]');
  });
});

describe('检查功能可用(未绑定认证方式)', () => {
  beforeEach(() => {
    cy.securityMethodsNone();
    cy.requiredValidationsNone();
    interceptConfig();
    cy.login();
    cy.visit(url);
    closeSecurityPrompt();
  });

  checkElements();
});

describe('检查功能可用(全绑定认证方式)', () => {
  beforeEach(() => {
    cy.securityMethodsAll();
    cy.requiredValidationsNone();
    interceptConfig();
    cy.login();
    cy.visit(url);
    closeSecurityPrompt();
  });

  checkElements();
});
