/*
 * @Owner: Melon@kupotech.com
 * @Author: Melon Melon@kupotech.com
 * @Date: 2024-10-16 20:55:34
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-05-26 16:57:08
 * @FilePath: /kucoin-main-web/e2e/specs/KC/careers.cy.js
 * @Description: 加入我们页面的巡检用例
 *
 *
 */
/** 测试加入我们 */
const checkCareers = () => {
  cy.waitForSSG('/careers');
  // 招聘页
  cy.get("[data-inspector='careers_page']").should('exist');
  // 加入我们按钮
  cy.get("[data-inspector='JoinUsBtn']").should('exist');
  /** 点击加入我们按钮后 显示三方跳转弹窗 */
  cy.get('body').then((body1) => {
    const JoinUsBtn = body1.find('[data-inspector="JoinUsBtn"]');
    if (JoinUsBtn.length > 0) {
      /** 加入我们按钮模拟点击 */
      JoinUsBtn[0].click();
      /** 显示三方跳转弹窗内容 */
      cy.get("[data-inspector='TipContent']").should('exist');
    }
  });
  // 优势介绍
  cy.get("[data-inspector='careers_advantage']").should('exist');
  // 福利介绍
  cy.get("[data-inspector='careers_welfare']").should('exist');
  // 加入流程
  cy.get("[data-inspector='careers_join']").should('exist');
  // 立即投递按钮
  cy.get("[data-inspector='ApplyNowBtn']").should('exist');
  
};

describe('/careers 页面测试 未登录', () => {
  it('/careers 页面正常工作', () => {
    checkCareers();
  });
});

describe('/careers 页面测试 已登录', () => {
  beforeEach(() => {
    cy.login();
  });

  it('/careers 页面正常工作', () => {
    checkCareers();
  });
});
