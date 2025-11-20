import { getFormDataValue, getSiteConfig, interceptCountryCode, interceptRiskValidation } from './utils';

export const url = '/account/security/phone';
const replaceUrl = '/account/security';

/** 用户信息（有无手机号） */
const interceptPhone = (hasPhone) => {
  cy.intercept('/_api/ucenter/user-info*', (req) => {
    req.reply((res) => {
      res.body.data.phoneValidate = hasPhone;
      res.body.data.phone = hasPhone ? '134****6789' : null;
    });
  });
};

/** 老流程的发送验证码 */
const interceptSendCode = () => {
  cy.intercept('/_api/ucenter/bind-phone/code*', {
    code: '200',
    success: true,
    data: { retryAfterSeconds: 60 },
  }).as('sendCode');
};
/** 新流程的发送验证码 */
const interceptSendCodeV2 = () => {
  cy.intercept('/_api/risk-validation-center/v1/security/validation/send-validation-code*', {
    code: '200',
    success: true,
    data: { retryAfterSeconds: 60 },
  }).as('sendCodeV2');
};

/** 绑定手机号 */
const interceptBindPhone = () => {
  cy.intercept('POST', '/_api/ucenter/user/phone*', {
    code: '200',
    success: true,
    data: {},
  }).as('bindPhone');
};

/** 新流程修改手机号 */
const interceptUpdatePhoneV2 = () => {
  cy.intercept('POST', '/_api/ucenter/v2/user/phone/update*', {
    code: '200',
    success: true,
    data: {},
  }).as('updatePhoneV2');
};

const selectCountryCode = () => {
  cy.get(`[data-inspector="country-selector"]`).click();
  cy.get('.KuxSelect-panelContainer').should('exist');
  cy.get('.KuxSelect-optionItem').first().click();
};

const MOCK_PHONE = '4255550100';
export const enterPhone = () => {
  cy.get('#phone input').type(MOCK_PHONE);
};
export const checkPhone = (phone) => {
  expect(phone).to.equal(MOCK_PHONE);
};

const MOCK_PHONE_CODE = '888888';
export const enterPhoneCode = (isV2 = false) => {
  // 发送验证码
  cy.get('#code .KuxInput-suffix').click();
  // 检查接口是否调用
  if (isV2) {
    cy.wait('@sendCodeV2').its('response.statusCode').should('eq', 200);
  } else {
    cy.wait('@sendCode').its('response.statusCode').should('eq', 200);
  }
  // 输入验证码
  cy.get('#code input').type(MOCK_PHONE_CODE);
};
export const checkPhoneCode = (phoneCode) => {
  expect(phoneCode).to.equal(MOCK_PHONE_CODE);
};

export const submit = () => {
  cy.get('[data-inspector="bind_phone_form_confirm"]').click();
};

export const afterBindOrUpdatePhone = () => {
  cy.url().should((curUrl) => {
    const path = new URL(curUrl).pathname;
    expect(path.endsWith(replaceUrl)).to.be.true;
  });
};

export const checkBindPhone = (tenant = 'KC') => {
  interceptPhone(false);
  interceptCountryCode();
  interceptSendCode();
  interceptBindPhone();
  getSiteConfig(url, siteConfig => {
    if (!siteConfig.securityConfig.phoneBindOpt) {
      return afterBindOrUpdatePhone();
    }
    // 通过安全验证
    cy.validationCodePassed();

    // 土耳其站国家不可选
    tenant !== 'TR' && selectCountryCode();
    enterPhone();
    enterPhoneCode();
    submit();
    // 检查接口入参
    cy.wait('@bindPhone').then((interception) => {
      // 检查入参是否跟输入一致
      const requestBody = interception.request.body;
      checkPhone(getFormDataValue(requestBody, 'phone'));
      checkPhoneCode(getFormDataValue(requestBody, 'code'));
      expect(getFormDataValue(requestBody, 'countryCode')).to.include(
        // 土耳其站锁死国家为土耳其
        tenant === 'TR' ? '90' : '1'
      );
      expect(getFormDataValue(requestBody, 'validationType')).to.include('SMS');
    });
  });
}

export const checkUpdatePhone = (tenant = 'KC') => {
  interceptPhone(true);
  const { checkToken } = interceptRiskValidation();
  interceptCountryCode();
  interceptSendCodeV2();
  interceptUpdatePhoneV2();
  return getSiteConfig(url, siteConfig => {
    if (!siteConfig.securityConfig.phoneBindOpt) {
      return afterBindOrUpdatePhone();
    }

    // 土耳其站国家不可选
    tenant !== 'TR' && selectCountryCode();

    enterPhone();
    enterPhoneCode(true);
    submit();
    return cy.wait('@updatePhoneV2').then((interception) => {
      // 检查入参是否跟输入一致
      checkToken(interception.request.headers);
      const requestBody = interception.request.body;
      checkPhone(getFormDataValue(requestBody, 'phone'));
      checkPhoneCode(getFormDataValue(requestBody, 'code'));
      expect(getFormDataValue(requestBody, 'countryCode')).to.include(
        // 土耳其站锁死国家为土耳其
        tenant === 'TR' ? '90' : '1'
      );
    });
  });
}
