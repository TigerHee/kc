// /* eslint-disable no-undef */

// describe('共享站切换', () => {
//   beforeEach(() => {
//     cy.clearLocalStorage();
//     cy.clearAllSessionStorage();
//   });

//   it('访问澳洲站时应显示重定向弹窗并正确跳转', () => {
//     // 拦截 /_api/site-type 接口，修改返回内容
//     cy.intercept('GET', '/_api/site-type*', {
//       statusCode: 200,
//       body: {
//         'success': true,
//         'code': '200',
//         'msg': 'success',
//         'retry': false,
//         'data': {
//           'forceRedirect': false,
//           'siteType': 'global',
//         },
//       },
//     }).as('siteTypeApi');

//     // 访问澳大利亚站点
//     cy.visit('/en-au');

//     // 等待接口请求完成
//     cy.wait('@siteTypeApi');

//     // 检查是否出现弹窗
//     cy.get('.KuxDialog-root', { timeout: 10000 }).should('be.visible');

//     // 点击弹窗底部的第二个按钮
//     cy.get('.KuxModalFooter-buttonWrapper button')
//       .eq(1)
//       .click();

//     // 验证跳转到主站根目录
//     cy.url({ timeout: 10000 }).should('not.include', '/en-au');
//     cy.url().should('match', /\/$/);
//   });

//   it('共享站强制重定向', () => {
//     // 拦截 /_api/site-type 接口，修改返回内容
//     cy.intercept('GET', '/_api/site-type*', {
//       statusCode: 200,
//       body: {
//         'success': true,
//         'code': '200',
//         'msg': 'success',
//         'retry': false,
//         'data': {
//           'forceRedirect': true,
//           'siteType': 'global',
//         },
//       },
//     }).as('siteTypeApi');

//     // 访问澳大利亚站点
//     cy.visit('/en-au');

//     // 等待接口请求完成
//     cy.wait('@siteTypeApi');

//     // 验证跳转到主站根目录
//     cy.url({ timeout: 10000 }).should('not.include', '/en-au');
//     cy.url().should('match', /\/$/);
//   });

//   it('共享站强制重定向-接口 308100', () => {
//     // 拦截 /_api/site-type 接口，修改返回内容
//     cy.intercept('GET', '/_api/ucenter/user-info*', {
//       statusCode: 200,
//       body: {
//         'success': false,
//         'code': '308100',
//         'msg': 'success',
//         'retry': false,
//         'data': {
//           'siteType': 'global',
//         },
//       },
//     }).as('siteTypeApi');

//     // 访问澳大利亚站点
//     cy.visit('/en-au');

//     // 等待接口请求完成
//     cy.wait('@siteTypeApi');

//     // 验证跳转到主站根目录
//     cy.url({ timeout: 10000 }).should('not.include', '/en-au');
//     cy.url().should('match', /\/$/);
//   });
// });
