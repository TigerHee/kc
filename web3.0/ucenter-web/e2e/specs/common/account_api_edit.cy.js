const url = '/account/api/edit';
describe(`【${url}】`, () => {
  beforeEach(() => cy.login());
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="api_page"]').should('exist');
    // 重定向到 /api 页面
    cy.url().should('not.include', '/account/api/edit');
    // 重定向到 /account/api 页面
    cy.url().should('include', '/account/api');
  });

  it(`${url} edit page test`, () => {
    cy.intercept('/_api/cyber-truck-vault/v2/api-key/detail*', {
      success: true,
      code: '200',
      msg: 'success',
      retry: false,
      data: {
        apiKey: '68b6645301ccc80001b762fd',
        apiName: 'test_api',
        brokerId: null,
        authGroupMap: {
          API_COMMON: true,
          API_FUTURES: true,
          API_SPOT: true,
          API_LEADTRADE_FUTURES: false,
          API_EARN: false,
          API_TRANSFER: false,
          API_WITHDRAW: false,
          API_MARGIN: true,
        },
        permissionMap: {
          API_COMMON: false,
          API_FUTURES: true,
          API_SPOT: true,
          API_LEADTRADE_FUTURES: false,
          API_EARN: true,
          API_TRANSFER: true,
          API_WITHDRAW: true,
          API_MARGIN: true,
        },
        ipWhitelistStatus: 1,
        ipWhitelist:
          '13.113.198.239,10.0.2.95,35.79.200.241,10.0.10.21,52.68.186.23,10.0.6.209,3.113.174.164,10.0.12.141,35.72.214.12,10.0.9.151,35.76.235.115,10.0.8.163,3.113.165.83,10.0.10.234,18.177.170.135,52.197.247.255,3.114.229.55,10.0.13.57,10.0.5.163',
        ipWhitelistScope: 'API_COMMON,API_FUTURES,API_SPOT,API_MARGIN',
        currentIp: '204.101.161.159',
        apiVersion: 3,
        isActivated: true,
        createdAt: 1756783699000,
        subName: null,
      },
    }).as('detail');
    cy.visit(url);
    cy.wait('@detail');
    cy.get('[data-inspector="api_manager_edit_page"]').should('exist');
    cy.get('[data-inspector="api_create_ip_add"]').should('exist');
  });
});
