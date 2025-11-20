const url = '/account/kyb/setup';
const inspectorId = '[data-inspector="account_kyb_step_page"]'

describe(`【${url}】`, () => {
  beforeEach(() => {
    cy.login();
  });
  it('选择国家和机构类型', () => {
    cy.intercept('/_api/kyc/kyc/regions/v3*').as('regions');
    cy.intercept('/_api/kyc/v2/company/normal/create-or-update*', {
      code: '200',
      success: true,
      data: {},
      msg: 'success'
    }).as('submit');
    cy.visit(url);
    cy.wait('@regions').then(({ response }) => {
      // 选择国家
      const { code: regionCode, name: regionName } = response.body.data.find(d => d.code !== 'OT' && d.regionType === 3)
      cy.get(`#registrationCountry`).click();
      cy.get('#registrationCountry_popper input').type(regionName);
      cy.get('.custom_select_options').first().click();
      // 选择机构类型
      cy.get('#companyType').click();
      cy.get('.custom_select_options>div').first().click();
      cy.get(`${inspectorId} .KuxButton-contained`).click();
      cy.wait('@submit').then(({ request }) => {
        const requestBody = request.body;
        expect(requestBody.registrationCountry).to.equal(regionCode);
        expect(requestBody.companyType).to.equal('NORMAL');
        expect(requestBody.currentPhase).to.equal(0);
        cy.url().should('include', '/account/kyb/home');
      })
    })
  })
});