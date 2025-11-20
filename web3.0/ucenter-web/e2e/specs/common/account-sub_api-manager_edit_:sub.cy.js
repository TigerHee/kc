import { checkRender } from './utils';

const subId = 'xxxxx'; // 随便搞个id，这里需要mock数据
const apiKey = 'yyyyy';
const managePrefix = '/account-sub/api-manager';
const editPrefix = `${managePrefix}/edit`;
const url = `${editPrefix}/${subId}`;
const inspectorId = 'api_manager_edit_page';
const managerInspectorId = 'account_sub_api_manager_page';
const presecurityInspectorId = 'api_manager_edit_presecurity_page';
const postsecurityInspectorId = 'api_manager_edit_postsecurity_page';

// 此页面对数据依赖较重，mock数据用于测试
const MOCK_DATA = {
  apiKey: apiKey,
  apiName: 'test',
  brokerId: null,
  authGroupMap: {
    API_COMMON: true,
    API_FUTURES: false,
    API_SPOT: false,
    API_EARN: false,
    API_TRANSFER: false,
    API_WITHDRAW: false,
    API_MARGIN: false,
  },
  permissionMap: {
    API_COMMON: false,
    API_FUTURES: false,
    API_SPOT: false,
    API_EARN: false,
    API_TRANSFER: true,
    API_WITHDRAW: false,
    API_MARGIN: false,
  },
  ipWhitelistStatus: 0,
  ipWhitelist: '',
  ipWhitelistScope: null,
  currentIp: '10.40.31.54',
  apiVersion: 3,
  isActivated: true,
  createdAt: 1729491510000,
};

const enterFormAndSubmit = (inspectorId) => {
  cy.get(`[data-inspector="${inspectorId}"] input`).then(($inputs) => {
    [...$inputs].forEach(($input) => {
      cy.wrap($input).type('888888');
    });
  });
  cy.get(`[data-inspector="${inspectorId}"] button.KuxButton-contained`).click();
};

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.mockValidationCode();
    cy.securityMethodsAll();
    // mock列表页数据
    cy.intercept('/_api/cyber-truck-vault/v2/sub/api-keys*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data: [MOCK_DATA],
      },
    });
    // mock编辑页数据
    cy.intercept('/_api/cyber-truck-vault/v2/sub/api-key/detail*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data: MOCK_DATA,
      },
    });
    // 拦截保存接口
    cy.intercept('/_api/cyber-truck-vault/v2/sub/api-key/update*', {
      statusCode: 200,
      body: {
        success: true,
        code: '200',
        data: {},
      },
    }).as('apiUpdate');
  });

  it('编辑API功能可用', () => {
    cy.visit(`${managePrefix}/${subId}`);
    checkRender(`[data-inspector="${managerInspectorId}"]`);
    // edit 页面无法直接访问，需要通过列表页点击编辑按钮跳转
    cy.get(`[data-inspector="${managerInspectorId}"]`)
      .find('.link_for_a:has(.ICEdit2_svg__icon)')
      .click();
    // 检查是否进入安全认证页面
    checkRender(`[data-inspector="${presecurityInspectorId}"]`);
    enterFormAndSubmit(presecurityInspectorId);
    // 安全认证通过到才跳到编辑页
    cy.url().should('include', url);
    checkRender(`[data-inspector="${inspectorId}"]`);
    cy.get(`[data-inspector="${inspectorId}"] button.KuxButton-contained`).click();
    // 编辑保存还得在做一次安全认证
    cy.url().should('include', `${editPrefix}/postsecurity/${subId}`);
    checkRender(`[data-inspector="${postsecurityInspectorId}"]`);
    enterFormAndSubmit(postsecurityInspectorId);
    // 检查保存接口是否被调用
    cy.wait('@apiUpdate').its('response.statusCode').should('eq', 200);
    // 回到列表页
    cy.url().should('include', `${managePrefix}/${subId}`);
  });
});
