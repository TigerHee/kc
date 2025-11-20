/* eslint-disable no-undef */

import { url, checkUserClearing, checkElements, interceptConfig } from '../common/account';

describe('内容合规', () => {
  beforeEach(() => cy.login());

  it('@level:p0 自动化清退', () => {
    cy.visit(url);
    checkUserClearing();
  });

  it('@level:p0 展业全开', () => {
    cy.countryJP();
    cy.complianceFree();
    interceptConfig();
    cy.visit(url);
    checkElements('TR');
  });
  
  it('@level:p0 展业全限制', () => {
    cy.countryJP();
    cy.complianceForbidden();
    interceptConfig();
    cy.visit(url);
    checkElements('TR');
  });

  it('@level:p0 英国 IP', () => {
    cy.countryGB();
    cy.complianceFree();
    interceptConfig();
    cy.visit(url);
    checkElements('TR');
  });

  it('@level:p0 非英国 IP（日本）', () => {
    cy.countryJP();
    cy.complianceFree();
    interceptConfig();
    cy.visit(url);
    checkElements('TR');
  });
});
