/* eslint-disable no-undef */

const url = '/';

describe(`【${url}】`, () => {
  beforeEach(() => {
    // 土耳其用户访问
    cy.countryTR();
    cy.setComplianceApi({
      'compliance.header.turkeyEntry.1': false,
      'compliance.signup.leftIndia.1': false,
      'compliance.header.kurewards.1': false,
    });
  });

  it(`${url} 土耳其用户访问 主站header模块 合规巡检`, () => {
    cy.waitForSSG(url);

    cy.get('[data-inspector="inspector_header_url_/land/KuRewards"]').should('not.exist');
  });
});
