/* eslint-disable no-undef */

describe('语言重定向测试', () => {
  it('访问 zh-hant 页面应该重定向到主页面', () => {
    // 拦截 kucoin-config 接口，返回只包含英文的配置
    cy.intercept('/_api/kucoin-config/web/international/config-list*', {
      statusCode: 200,
      body: {
        'success': true,
        'code': '200',
        'msg': 'success',
        'retry': false,
        'data': [['en_US', 'English']],
      },
    }).as('configListApi');

    // 访问 kucoin.com/zh-hant
    cy.visit('/zh-hant');

    // 等待接口请求
    cy.wait('@configListApi', { timeout: 10000 });

    // 验证 URL 被重定向到 https://www.kucoin.com/?x=zh_HK
    cy.url().should('include', '/?x=zh_HK');

    // 最终 URL 被重定向到 https://www.kucoin.com
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });

  it('访问 ko 页面应该重定向到主页面', () => {
    // 访问 kucoin.com/ko
    cy.visit('/ko');
    // 验证 URL 被重定向到 https://www.kucoin.com/?x=ko_KR
    cy.url().should('include', '/?x=ko_KR');

    // 最终 URL 被重定向到 https://www.kucoin.com
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  });
});
