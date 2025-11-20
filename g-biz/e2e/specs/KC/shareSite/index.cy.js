// /* eslint-disable no-undef */

// describe('澳大利亚站点重定向测试', () => {
//   beforeEach(() => {
//     cy.clearLocalStorage();
//     cy.clearAllSessionStorage();
//   });

//   it('未设置 LAST_VISIT_SITE 时，访问 markets 页面应保持原路径', () => {
//     // 不设置 LAST_VISIT_SITE，直接访问
//     cy.visit('/markets');

//     // 验证 URL 不包含 en-au 路径
//     cy.url().should('not.include', '/en-au/');
//     cy.url().should('include', '/markets');
//   });

//   it('设置 LAST_VISIT_SITE 为 australia，访问 markets 页面应跳转到 en-au 路径', () => {
//     // 设置 localStorage LAST_VISIT_SITE 等于 australia
//     cy.window().then((win) => {
//       win.localStorage.setItem('LAST_VISIT_SITE', 'australia');
//     });

//     // 访问 kucoin.com/markets
//     cy.visit('/markets');

//     // 验证 URL 跳转到 en-au/markets
//     cy.url().should('include', '/en-au/markets');

//     // 验证页面内容加载正常
//     cy.get('body').should('exist');

//     // 验证 localStorage 中的 LAST_VISIT_SITE 值仍为 australia
//     cy.window().then((win) => {
//       expect(win.localStorage.getItem('LAST_VISIT_SITE')).to.equal('australia');
//     });
//   });
// });
