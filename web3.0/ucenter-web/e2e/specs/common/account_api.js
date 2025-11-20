/* eslint-disable no-undef */

import { checkRender, interceptCheckValidations } from "./utils";

export const url = '/account/api';
const MOCK_API_KEY = 'test_api_key_01';
const MOCK_API_NAME = 'test_api_name_01';
const MOCK_SUB_NAME = 'test_sub_name';
const LEAD_TRADE_TAB_SELECTOR = '[data-inspector="api_page_lead-trader-tab"]';
const MOCK_API_DETAIL = {
  apiKey: MOCK_API_KEY,
  apiName: MOCK_API_NAME,
  brokerId: null,
  authGroupMap: {
    API_COMMON: true,
    API_FUTURES: true,
    API_SPOT: true,
    API_EARN: true,
    API_TRANSFER: false,
    API_WITHDRAW: false,
    API_MARGIN: true,
  },
  permissionMap: {
    API_COMMON: false,
    API_FUTURES: true,
    API_SPOT: true,
    API_EARN: true,
    API_TRANSFER: true,
    API_WITHDRAW: true,
    API_MARGIN: true,
  },
  ipWhitelistStatus: 0,
  ipWhitelist: '',
  ipWhitelistScope: null,
  currentIp: '10.40.96.53',
  apiVersion: 3,
  isActivated: true,
  createdAt: 1731900595000,
}
const MOCK_LEAD_TRADE_API_DETAIL = {
  apiKey: MOCK_API_KEY,
  apiName: MOCK_API_NAME,
  subName: MOCK_SUB_NAME,
  brokerId: null,
  authGroupMap: {
    API_COMMON: true,
    API_LEADTRADE_FUTURES: false
  },
  permissionMap: {
    API_COMMON: false,
    API_LEADTRADE_FUTURES: true
  },
  ipWhitelistStatus: 0,
  ipWhitelist: '',
  ipWhitelistScope: null,
  currentIp: '10.40.96.53',
  apiVersion: 3,
  isActivated: true,
  createdAt: 1731900595000,
}

const enterNameAndPwd = () => {
  cy.get('[data-inspector="api_create_api_name"] input').type(MOCK_API_NAME);
  cy.get('[data-inspector="api_create_api_password"] input').type('1234567');
}

const interceptCreateInfo = () => {
  cy.intercept('/_api/cyber-truck-vault/v2/api-key/create-info*', (req) => {
    req.reply((res) => {
      res.body.data.needCaptcha = false;
    });
  }).as('createInfo');
}

export const checkNormalAPI = () => {
  describe('普通 API', () => {
    beforeEach(() => {
      cy.intercept('GET', '/_api/cyber-truck-vault/v2/api-keys*', {
        success: true,
        code: '200',
        msg: 'success',
        data: [MOCK_API_DETAIL],
      }).as('queryList');
    });

    it('创建', () => {
      interceptCheckValidations();
      interceptCreateInfo();
      cy.intercept('POST', '/_api/cyber-truck-vault/v2/api-key*', {
        code: '200',
        success: true,
        data: {
          status: 'success'
        }
      }).as('create');

      cy.visit(url);

      cy.get('[data-inspector="account_api_create_btn"]').click();

      cy.wait('@createInfo').then(({ response }) => {
        cy.get('[data-inspector="api_create_api_tab"]').should('have.attr', 'aria-selected', 'true');
        const { permissionMap, authGroupMap, currentIp } = response.body.data ?? {};
        // 通用权限锁死为 true
        const exPermissionMap = { ...permissionMap, API_COMMON: true };
        const exAuthGroupMap = { ...authGroupMap, API_COMMON: true  }
        const groupSelector = '[data-inspector="api_create_auth_radio"]';
        Object.keys(exPermissionMap).forEach(key => {
          const checkboxSelector = `${groupSelector} input[value="${key}"]`;
          if (exPermissionMap[key]) {
            cy.get(checkboxSelector).should('exist');
            cy.get(checkboxSelector).parent().should(
              exAuthGroupMap[key] ? 'have.class' : 'not.have.class',
              'KuxCheckbox-checked'
            )
          } else {
            cy.get(checkboxSelector).should('not.exist');
          }
        });
        cy.get('.ip_lable_current').should('contain', currentIp);
        enterNameAndPwd();
        cy.get('[data-inspector="api_create_submit"]').click();
        cy.wait('@create').then(() => {
          checkRender('[data-inspector="api_manager_create_success"]');
        })
      });
    });

    it('编辑', () => {
      interceptCheckValidations();
      cy.intercept('/_api/cyber-truck-vault/v2/api-key/detail*', {
        code: '200',
        success: true,
        data: MOCK_API_DETAIL
      }).as('detail');
      cy.intercept('/_api/cyber-truck-vault/v2/api-key/update*', {
        code: '200',
        success: true
      }).as('update');

      cy.visit(url);

      cy.wait('@queryList').then(() => {
        cy.get('.list_item__btns>span:has(.ICEdit2_svg__icon)').click();
        cy.url().should('include', `/account/api/edit?apiKey=${MOCK_API_KEY}`);
        cy.wait('@detail').then(() => {
          const exPermissionMap = { ...MOCK_API_DETAIL.permissionMap, API_COMMON: true };
          const exAuthGroupMap = { ...MOCK_API_DETAIL.authGroupMap, API_COMMON: true };
          Object.keys(exPermissionMap).forEach(key => {
            const checkboxSelector = `#authGroupMap input[value="${key}"]`;
            if (exPermissionMap[key]) {
              cy.get(checkboxSelector).should('exist');
              cy.get(checkboxSelector).parent().should(
                exAuthGroupMap[key] ? 'have.class' : 'not.have.class',
                'KuxCheckbox-checked'
              )
            } else {
              cy.get(checkboxSelector).should('not.exist');
            }
          });
          cy.get('[data-testid="btn"]').click();
          cy.wait('@update').then(() => {
            cy.url().should(curUrl => {
              const path = new URL(curUrl).pathname;
              expect(path.endsWith(url)).to.be.true;
            })
          });
        })
      })
    });

    it('删除', () => {
      cy.intercept('POST', `/_api/cyber-truck-vault/api-key/delete/${MOCK_API_KEY}*`, {
        success: true,
        code: '200',
        msg: 'success',
        data: {},
      }).as('apiDelete');

      cy.visit(url);

      cy.wait('@queryList').then(() => {
        cy.get('.list_item__btns>span:has(.ICDelete_svg__icon)').click();
        cy.get('.KuxModalFooter-root .KuxButton-contained').click();
        cy.wait('@apiDelete').its('response.statusCode').should('eq', 200);
      });
    });
  });
}

export const checkBrokerAPI = () => {
  describe('非公开经纪商 API', () => {
    beforeEach(() => {
      cy.intercept('/_api/ucenter/user-info*', (req) => {
        req.reply((res) => {
          res.body.data.type = 10;
        });
      });
      cy.intercept('GET', '/_api/cyber-truck-vault/broker/nd/apikey*', {
        code: '200',
        success: true,
        data: [MOCK_API_DETAIL]
      }).as('queryList');
    });

    it('创建', () => {
      interceptCheckValidations();
      interceptCreateInfo();
      cy.intercept('POST', '/_api/cyber-truck-vault/broker/nd/apikey*', {
        code: '200',
        success: true,
        data: { status: 'success' }
      }).as('create')

      cy.visit(url);

      cy.wait('@queryList').then(() => {
        cy.get('[data-inspector="account_api_create_btn"]').click();
        cy.get('[data-inspector="api_create_auth_radio"] .KuxCheckbox-group').should('not.exist');
        enterNameAndPwd();
        cy.get('[data-inspector="api_create_submit"]').click();
        cy.wait('@create').then(() => {
          checkRender('[data-inspector="api_manager_create_success"]');
        })
      })
    });

    it('删除', () => {
      cy.intercept('POST', '/_api/cyber-truck-vault/broker/nd/delete-apikey*', {
        code: '200',
        success: true,
        data: {}
      }).as('apiDelete')

      cy.visit(url);

      cy.wait('@queryList').then(() => {
        cy.get('.list_item__btns>span:has(.ICDelete_svg__icon)').click();
        cy.get('.KuxModalFooter-root .KuxButton-contained').click();
      })
      cy.wait('@apiDelete').its('response.statusCode').should('eq', 200);
      
    })
  });
}

export const checkLeadTradeAPI = (tenant = 'KC') => {
  describe('带单 API', () => {
    beforeEach(() => {
      cy.intercept('/_api/ct-copy-trade/v1/copyTrading/isLeadTraderAccount*', {
        success: true,
        code: '200',
        msg: 'success',
        data: true,
      }).as('isLeadTraderAccount');
      cy.intercept('GET', '/_api/cyber-truck-vault/v2/leadtrade-api-keys*', {
        success: true,
        code: '200',
        msg: 'success',
        data: [MOCK_LEAD_TRADE_API_DETAIL],
      }).as('queryList');
    });

    if (tenant != 'KC') {
      it('非主站暂不开放 API 带单', () => {
        cy.visit(url);
        cy.get('LEAD_TRADE_TAB_SELECTOR').should('not.exist');
      });
      return;
    }

    it('创建', () => {
      interceptCheckValidations();
      interceptCreateInfo();
      cy.intercept('POST', '/_api/cyber-truck-vault/v2/api-key*', {
        code: '200',
        success: true,
        data: {
          status: 'success'
        }
      }).as('create');

      cy.visit(url);

      cy.wait('@isLeadTraderAccount').then(() => {
        cy.get(LEAD_TRADE_TAB_SELECTOR).click();
        cy.wait('@queryList').then(() => {
          cy.get('[data-inspector="account_api_create_btn"]').click();
          // 检查是否默认选择通用权限和带单权限
          cy.get('input[value="API_COMMON"]').parent().should('have.class', 'KuxCheckbox-checked');
          cy.get('input[value="API_LEADTRADE_FUTURES"]').parent().should('have.class', 'KuxCheckbox-checked');
          enterNameAndPwd();
          cy.get('[data-inspector="api_create_submit"]').click();
          cy.wait('@create').then(() => {
            checkRender('[data-inspector="api_manager_create_success"]');
          });
        })
      });
    });

    it('编辑', () => {
      interceptCheckValidations();
      cy.intercept('GET', '/_api/cyber-truck-vault/v2/sub/api-key/detail*', {
        success: true,
        code: '200',
        data: MOCK_LEAD_TRADE_API_DETAIL,
      }).as('detail');
      cy.intercept('POST', '/_api/cyber-truck-vault/v2/sub/api-key/update*', {
        success: true,
        code: '200',
        data: {}
      }).as('update')

      cy.visit(url);

      cy.wait('@isLeadTraderAccount').then(() => {
        cy.get(LEAD_TRADE_TAB_SELECTOR).click();
        cy.wait('@queryList').then(() => {
          cy.get('.list_item__btns>span:has(.ICEdit2_svg__icon)').click();
          cy.url().should('include', `/account-sub/api-manager/edit/${MOCK_SUB_NAME}`);
          cy.wait('@detail').then(() => {
            cy.get('[data-testid="btn"]').click();
            cy.wait('@update').then(() => {
              cy.url().should(curUrl => {
                const path = new URL(curUrl).pathname;
                expect(path.endsWith(url)).to.be.true;
              })
            });
          });
        });
      });
    });

    it('删除', () => {
      cy.intercept(`/_api/cyber-truck-vault/sub/api-key/delete/${MOCK_API_KEY}*`, {
        code: '200',
        success: true,
        data: {}
      }).as('apiDelete');

      cy.visit(url);

      cy.wait('@isLeadTraderAccount').then(() => {
        cy.get(LEAD_TRADE_TAB_SELECTOR).click();
        cy.wait('@queryList').then(() => {
          cy.get('.list_item__btns>span:has(.ICDelete_svg__icon)').click();
          cy.get('.KuxModalFooter-root .KuxButton-contained').click();
          cy.wait('@apiDelete').its('response.statusCode').should('eq', 200);
        });
      });
    })
  })
}
