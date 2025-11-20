import { checkRender } from './utils';

const subId = 'xxxxx'; // 随便搞个id
const prefix = '/account-sub/api-manager/create';
const url = `${prefix}/${subId}`;
const inspectorId = 'api_manager_create_page';
const securityInspectorId = 'api_manager_create_security_page';

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    // 拦截创建api接口
    cy.intercept('/_api/cyber-truck-vault/v2/sub/api-key*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data: [],
      },
    });
  });

  it('创建API功能可用（无安全认证）', () => {
    cy.requiredValidationsNone();

    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    // 填写api名称和密码
    cy.get('#apiName input').type('test');
    cy.get('#passphrase input[type="password"]').type('88888888');
    cy.get(`[data-inspector="${inspectorId}"] [data-inspector="api_create_submit"]`).click();
    // 无需安全认证，直接创建
    checkRender('[data-inspector="api_manager_create_success"]');
  });

  it('创建API功能可用（全部安全认证）', () => {
    cy.requiredValidationsAll();
    cy.mockValidationCode();

    cy.visit(url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    // 填写api名称和密码
    cy.get('#apiName input').type('test');
    cy.get('#passphrase input[type="password"]').type('88888888');
    cy.get(`[data-inspector="${inspectorId}"] [data-inspector="api_create_submit"]`).click();
    // 跳到安全认证
    cy.url().should('include', `${prefix}/security/${subId}`);
    checkRender(`[data-inspector="${securityInspectorId}"]`);
    cy.get(`[data-inspector="${securityInspectorId}"] input`).then(($inputs) => {
      [...$inputs].forEach(($input) => {
        cy.wrap($input).type('888888');
      });
    });
    cy.get(`[data-inspector="${securityInspectorId}"] button.KuxButton-contained`).click();
    // 安全认证通过后成功创建api，展示api信息弹窗
    checkRender('[data-inspector="api_manager_create_success"]');
  });
});
