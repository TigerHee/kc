const url = '/account/security/score';
const LOADING_INSPECTOR_ID = '[data-inspector="account_security_score_loading"]';
const COUNT_UP_INSPECTOR_ID = '[data-inspector="account_security_score_countUp"]';
const ANIMATION_INSPECTOR_ID = '[data-inspector="inspector_signup_gift_button"]';
const SUGGEST_INSPECTOR_ID = '[data-inspector="account_security_score_suggest"]';
const SUGGEST_ITEM_INSPECTOR_ID = '[data-inspector="account_security_score_suggest_item"]';

const interceptQuery = (data) => cy.intercept('/_api/risk-validation-center/v1/security/center/score*', {
  success: true,
  code: '200',
  data,
  message: 'success'
}).as('query');

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });
  it('高分 - 无推荐项', () => {
    const LEVEL = 'High';
    const SCORE = 200
    interceptQuery({
      userSecurityLevel: LEVEL,
      userSecurityScore: SCORE,
      userNeedSecurityMethods: {}
    });
    cy.visit(url);
    // 检查 loading 动画是否开启
    cy.get(LOADING_INSPECTOR_ID).should('exist');
    cy.wait('@query').then(() => {
      // 检查请求结束后，loading 是否关闭
      cy.get(LOADING_INSPECTOR_ID).should('not.exist');
      // 检查分数是否正确
      cy.get(`${COUNT_UP_INSPECTOR_ID}[data-target="${SCORE}"]`).should('exist');
      // 检查动画是否按等级渲染
      cy.get(`${ANIMATION_INSPECTOR_ID}[data-name="security_score_${LEVEL.toLowerCase()}"]`).should('exist');
      // 检查推荐项是否为空
      cy.get(`${SUGGEST_INSPECTOR_ID}`).should('not.exist');
    })
  });
  it('中分 - 有推荐项', () => {
    const LEVEL = 'Medium';
    const SCORE = 150;
    const METHODS = {
      PK: 3,
      GAV: 2,
      MAIL_WORD: 1,
      UNKNOW: 3 // 未定义的
    };
    interceptQuery({
      userSecurityLevel: LEVEL,
      userSecurityScore: SCORE,
      userNeedSecurityMethods: METHODS
    });
    cy.visit(url);
    // 检查 loading 动画是否开启
    cy.get(LOADING_INSPECTOR_ID).should('exist');
    cy.wait('@query').then(() => {
      // 检查请求结束后，loading 是否关闭
      cy.get(LOADING_INSPECTOR_ID).should('not.exist');
      // 检查分数是否正确
      cy.get(`${COUNT_UP_INSPECTOR_ID}[data-target="${SCORE}"]`).should('exist');
      // 检查动画是否按等级渲染
      cy.get(`${ANIMATION_INSPECTOR_ID}[data-name="security_score_${LEVEL.toLowerCase()}"]`).should('exist');
      // 检查推荐项个数，应过滤掉不支持（未定义）的项
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).its('length').should('eq', 3);
      // 检查推荐项目顺序（以 value 降序）以及按钮是否存在
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(0).should('have.attr', 'data-key', 'PK');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="PK"] button`).should('exist');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(1).should('have.attr', 'data-key', 'GAV');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="GAV"] button`).should('exist');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(2).should('have.attr', 'data-key', 'MAIL_WORD');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="MAIL_WORD"] button`).should('exist');
    })
  });
  it('低分 - 有推荐项，passkey 不支持', () => {
    const LEVEL = 'Low';
    const SCORE = 99;
    const METHODS = {
      PK: 3,
      EMV: 2,
      SMS: 1
    };
    interceptQuery({
      userSecurityLevel: LEVEL,
      userSecurityScore: SCORE,
      userNeedSecurityMethods: METHODS
    });
    cy.visit(url, {
      onBeforeLoad(win) {
        // 模拟低版本浏览器不兼容 passkey
        win.PublicKeyCredential = null
      }
    });
    // 检查 loading 动画是否开启
    cy.get(LOADING_INSPECTOR_ID).should('exist');
    cy.wait('@query').then(() => {
      // 检查请求结束后，loading 是否关闭
      cy.get(LOADING_INSPECTOR_ID).should('not.exist');
      // 检查分数是否正确
      cy.get(`${COUNT_UP_INSPECTOR_ID}[data-target="${SCORE}"]`).should('exist');
      // 检查动画是否按等级渲染
      cy.get(`${ANIMATION_INSPECTOR_ID}[data-name="security_score_${LEVEL.toLowerCase()}"]`).should('exist');
      // 检查推荐项个数
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).its('length').should('eq', 3);
      // 检查推荐项目顺序（以 value 降序）以及按钮是否存在
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(0).should('have.attr', 'data-key', 'EMV');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="EMV"] button`).should('exist');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(1).should('have.attr', 'data-key', 'SMS');
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="SMS"] button`).should('exist');
      // passkey 不支持，放到最下面
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}`).eq(2).should('have.attr', 'data-key', 'PK');
      // passkey 不支持，按钮不应存在
      cy.get(`${SUGGEST_ITEM_INSPECTOR_ID}[data-key="PK"] button`).should('not.exist');
    })
  });
});