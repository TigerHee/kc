const url = '/account/kyb/migrate';

const interceptCanTransfer = (targetSiteType) => {
  cy.intercept('/_api/user-dismiss-front/web/siteTransfer/queryUserCanTransfer*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        canTransfer: !!targetSiteType,
        targetSiteType,
      },
    },
  });
};

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });

  it('非主站未开放此功能', () => {
    interceptCanTransfer();
    cy.url().should('include', '/404');
  });
});
