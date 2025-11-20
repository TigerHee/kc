import { MAX_RENDER_TIME, MODULES } from './constant';

/**
 * @description 访问页面
 * @param {String} url 页面地址
 * @param {Array} viewport 视窗大小
 */
export const visitPage = (params) => {
  const { url = '/trade/BTC-USDT', viewport = [1920, 1080] } = params || {};
  // 设置视窗大小
  cy.viewport(...viewport);
  cy.waitForApi(url, {
    reg: '/_api/ucenter/check-required-validations*',
    name: 'validateApi',
    timeout: 100000,
    callback: (interception) => {
      if (
        Array.isArray(interception.response.body.data) &&
        interception.response.body.data.length > 0
      ) {
        // 监听交易密码校验接口
        cy.intercept('POST', '/_api/ucenter/verify-validation-code*').as('verifyApi');
        // 输入交易密码
        cy.get('#pwdInput', {
          timeout: 30000,
        }).type(Cypress.env('TRADE_PASSWORD'));
        // 校验交易密码校验接口正常返回
        cy.wait('@verifyApi', { requestTimeout: 30000, timeout: 30000 }).then((_interception) => {
          expect(_interception.response.body).to.have.property('success').and.to.be.true;
          expect(_interception.response.body).to.have.property('data').and.to.be.empty;
        });
      }
    },
  });

  // // 打开页面
  // cy.visit(url);
};

/**
 * @description 验证交易密码
 */
export const verifyTradePwd = () => {
  // 监听前置校验检测接口
  cy.intercept('GET', '/_api/ucenter/check-required-validations*').as('validateApi');
  // 前置校验检测接口正常返回
  cy.wait('@validateApi', { requestTimeout: 30000, timeout: 60000 }).then((interception) => {
    if (
      Array.isArray(interception.response.body.data) &&
      interception.response.body.data.length > 0
    ) {

      // 监听交易密码校验接口
      cy.intercept('POST', '/_api/ucenter/verify-validation-code*').as('verifyApi');
      // 输入交易密码
      cy.get('#pwdInput', {
        timeout: 30000,
      }).type(Cypress.env('TRADE_PASSWORD'));
      // 校验交易密码校验接口正常返回
      cy.wait('@verifyApi', { requestTimeout: 30000, timeout: 30000 }).then((_interception) => {
        expect(_interception.response.body).to.have.property('success').and.to.be.true;
        expect(_interception.response.body).to.have.property('data').and.to.be.empty;
      });
    }
  });
};

/**
 * @description 隐藏元素
 * @param {String} selector 选择器
 */
export const hideElement = (selector) => {
  cy.get(selector).then(($element) => {
    if ($element.length) {
      $element.css('display', 'none');
    }
  });
};

/**
 * @description 检查元素的渲染情况
 * @param {String} selector 选择器
 * @param {Number} timeout 检测的超时时间
 */
export const checkRender = (selector, timeout = MAX_RENDER_TIME) => {
  cy.get(selector, { timeout }).should('be.visible');
};

/**
 * @description 使用页面的登录抽屉执行登录操作
 */
export const loginUseDrawer = () => {
  // 引导的tooltip容易遮挡按钮，所以把它隐藏掉
  hideElement('.KuxTooltip-popper');
  // 查找header上的登录按钮，并点击
  cy.get('#unLoginBox').find('a[data-modid="login"]').click();
  // 登录抽屉正常render出来
  checkRender('[data-inspector="tradeV4_loginDrawer"]');
  // 如果输入框不存在，则点击二维码图标
  cy.get('[data-inspector="tradeV4_loginDrawer"]').then((drawer) => {
    // 如果 'input[type="text"]' 元素不存在, 说明此时是二维码登录界面
    if (drawer.find('input[type="text"]').length === 0) {
      // 引导的tooltip容易遮挡按钮，所以把它隐藏掉
      hideElement('.KuxTooltip-popper');
      // 点击 'img[alt="qrcode-icon"]'，切换到账号密码登录界面
      cy.get('img[alt="qrcode-icon"]').click();
    }
  });
  // 输入账号和密码
  cy.get('#account').find('input[type=text]').type(Cypress.env('LOGIN_USERNAME'));
  cy.get('#password').find('input[type=password]').type(Cypress.env('LOGIN_PASSWORD'));
  // 避免二次校验
  cy.intercept('*', (req) => {
    if (req.headers['x-app-version']) {
      req.headers['x-app-version'] = '3.91.0';
    }
  });
  // 监听登录接口
  cy.intercept('POST', '/_api/ucenter/aggregate-login*').as('loginApi');
  // 点击提交按钮
  cy.get('button[type="submit"]').click();
  // 校验登录接口正常返回
  cy.wait('@loginApi').then((interception) => {
    expect(interception.response.body).to.have.property('success').and.to.be.true;
  });
};

/**
 * @description 检查模块渲染情况
 * @param {Array} modules 模块配置
 */
export const checkModulesRender = (modules = MODULES) => {
  modules.forEach(({ code, name, children }) => {
    checkRender(`[data-inspector="tradeV4_${code}"]`);
    cy.log(`-----${name}模块渲染正常-----`);
    if (children) {
      children.forEach(({ selector, name: childName }) => {
        checkRender(selector);
        cy.log(`-----${name} ${childName}元素渲染正常-----`);
      });
    }
  });
};

/**
 * @description 死链检查(排除Header上的链接)
 * @param {String} pageSelector 页面容器选择器
 */
export const check404 = (pageSelector) => {
  cy.get(pageSelector)
    .find('a')
    .not('.gbiz-Header a')
    .each(($a) => {
      const url = $a.prop('href');
      if (!url || url.indexOf('/trade/') >= 0) return;
      cy.visit(url, {
        failOnStatusCode: false,
      });
      cy.url().should('not.contain', '404');
    });
};
