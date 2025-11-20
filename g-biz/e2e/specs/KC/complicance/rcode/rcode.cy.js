/* eslint-disable no-undef */

const homePageUrl = '/?rcode=testrcode';
describe(`【${homePageUrl}】法国IP rcode 合规第一版`, () => {
  beforeEach(() => {
    // 法国IP识别合规
    cy.rcodeValidate({
      region: null,
      isIntercept: true,
      regionV2: null,
      interceptV2: false,
      interceptV3: false,
      inviterCategory: '',
    });
    cy.complianceFree();
  });

  it(`${homePageUrl} 法国IP识别合规 合规巡检`, () => {
    cy.waitForSSG(homePageUrl);

    cy.url().should('include', '/forbidden');
  });
});

const signupUrl = '/ucenter/signup?rcode=testrcode';
describe(`【${signupUrl}】rcode 合规`, () => {
  beforeEach(() => {
    // 比利时IP识别合规
    cy.rcodeValidate({
      region: null,
      isIntercept: false,
      regionV2: 'BE',
      interceptV2: true,
      interceptV3: false,
      inviterCategory: '',
    });
    cy.complianceFree();
  });

  it(`${signupUrl} 比利时IP识别合规 合规巡检`, () => {
    cy.waitForSSG(signupUrl);

    cy.url().should('include', '/forbidden');
  });
});

const signupUrlV2 = '/ucenter/signup?rcode=QBSSH12W';
describe(`【${signupUrlV2}】法国IP rcode 合规第二版`, () => {
  beforeEach(() => {
    // 法国IP识别合规
    cy.rcodeValidate({
      region: null,
      isIntercept: false,
      regionV2: null,
      interceptV2: false,
      interceptV3: true,
      inviterCategory: '',
    });
    cy.complianceFree();
  });

  it(`${signupUrlV2} 法国IP识别合规 合规第二版 合规巡检`, () => {
    cy.waitForSSG(signupUrlV2);

    cy.url().should('include', '/forbidden');
  });
});

const signupUrlTr = '/ucenter/signup?rcode=QBSSH12W';
describe(`【${signupUrlTr}】rcode 合规`, () => {
  beforeEach(() => {
    // 法国IP识别合规
    cy.rcodeValidate({
      region: null,
      isIntercept: false,
      regionV2: 'TR',
      interceptV2: true,
      interceptV3: false,
      inviterCategory: 'TobReferral',
    });
    cy.complianceFree();
  });

  it(`${signupUrlTr}  营销土耳其，TOB、TOC合规 合规巡检`, () => {
    cy.waitForSSG(signupUrlTr);

    cy.url().should('include', '/forbidden');
  });
});
