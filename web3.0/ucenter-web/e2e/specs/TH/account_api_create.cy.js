import { checkLeadTradeApiUrl, url } from '../common/account_api_create.cy';

describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);

    // 点击 broker tab
    cy.get('[data-inspector="api_create_other_tab"]').should('not.exist');

    // broker 选择不存在
    cy.get('[data-inspector="api_create_broker_select"]').should('not.exist');
    // api 备注名输入 test
    cy.get('[data-inspector="api_create_api_name"] input').should('exist').type('test');
    // 密码输入 12345678
    cy.get('[data-inspector="api_create_api_password"] input').should('exist').type('12345678');

    // ip 输入框不存在
    cy.get('[data-inspector="api_create_ip_add"]').should('not.exist');
    // 点击 ip 限制选项
    cy.get('[data-inspector="api_create_api_ip_limit"]').should('exist').click();
    // ip 输入框存在
    cy.get('[data-inspector="api_create_ip_add"]').should('exist').type('1.1.1.1');
    // 点击 IP 添加
    cy.get('[data-inspector="api_create_ip_add"] button').should('exist').click();

    // 下面存在人机验证
    // 点击下一步
    // cy.get('[data-inspector="api_create_submit"]').should('exist').click();
    // url 包含 /account/api/auth
    // cy.url().should('include', '/account/api/create/security');
  });
});

checkLeadTradeApiUrl(false);
