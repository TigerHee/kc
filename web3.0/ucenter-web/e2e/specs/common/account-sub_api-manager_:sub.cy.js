import { checkRender, createCheckElementEnable } from './utils';
const subId = 'xxxxx'; // 随便搞个id，捞不到数据，页面依然能展示
const url = `/account-sub/api-manager/${subId}`;
const inspectorId = 'account_sub_api_manager_page';
const checkButtonEnable = createCheckElementEnable();

describe('未设置验证码和交易密码', () => {
  beforeEach(() => cy.login());
  it('显示设置验证码和交易密码的入口', () => {
    cy.securityMethodsNone();
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);

    cy.get(`[data-inspector="${inspectorId}"] a`).then(([$a1, $a2]) => {
      cy.wrap($a1).should('have.attr', 'href').and('include', '/account/security/g2fa');
      cy.wrap($a2).should('have.attr', 'href').and('include', '/account/security/protect');
    });
  });
});

describe('已设置验证码和交易密码', () => {
  beforeEach(() => cy.login());
  it('显示创建API按钮，点击跳到创建API页面', () => {
    cy.securityMethodsAll();
    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);

    checkButtonEnable(inspectorId);

    cy.get(`[data-inspector="${inspectorId}"] button`).click();

    cy.url().should('include', `/account-sub/api-manager/create/${subId}`);
  });
});
