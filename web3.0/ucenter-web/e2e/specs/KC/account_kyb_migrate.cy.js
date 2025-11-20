const url = '/account/kyb/migrate';

const interceptCanTransfer = (targetSiteType) => {
  cy.intercept('/_api/user-dismiss-front/web/siteTransfer/queryUserCanTransfer*', {
    statusCode: 200,
    body: {
      success: true,
      code: '200',
      data: {
        canTransfer: !!targetSiteType,
        targetSiteType
      },
    },
  });
}

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
    cy.visit(url);
  });

  it('不可迁移', () => {
    interceptCanTransfer();
    cy.url().should('include', '/404');
  });

  it('迁移到澳洲站', () => {
    interceptCanTransfer('australia');
    cy.get('[data-inspector="account_kyb_migrate_page"]').should('exist');
  });
});