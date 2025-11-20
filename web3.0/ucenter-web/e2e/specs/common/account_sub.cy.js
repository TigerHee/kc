import { checkRender, getSiteConfig, interceptCheckValidations } from '../common/utils';

const url = '/account/sub';
const replaceUrl = '/account';

const MOCK_TOTAL_AMOUNT = '10.45';
const MOCK_TOTAL_AMOUNT_TR = '10,45';
const MOCK_BASE_CURRENCY = 'BTC';

const interceptOverview = () => {
  cy.intercept('/_api/kucoin-web-front/asset/sub/overview*', {
    code: '200',
    success: true,
    data: {
      "subAsset": {
        "totalAssets": MOCK_TOTAL_AMOUNT,
        "showFlag": null
      },
      "robotAsset": {
          "totalAssets": "0",
          "showFlag": null
      },
      "cached": false
    }
  })
}

const MOCK_SUB_NAME = 'testSubAccount001';
const interceptQuery = () => {
  cy.intercept('/_api/user-biz-front/asset/sub/page*', {
    "success": true,
    "code": "200",
    "currentPage": 1,
    "pageSize": 10,
    "totalNum": 1,
    "totalPage": 1,
    "items": [
        {
            "userId": "6842ad7321c9b300018249d8",
            "uid": 2400010001022344,
            "subName": MOCK_SUB_NAME,
            "status": 2,
            "hostedStatus": null,
            "type": 0,
            "remarks": null,
            "robot": false,
            "baseCurrency": MOCK_BASE_CURRENCY,
            "baseMainAmount": 0,
            "baseTradeAmount": 0,
            "baseMarginAmount": 0,
            "baseIsolatedAmount": 0,
            "baseTradeHFAmount": 0,
            "baseOptionAmount": 0,
            "baseFuturesAmount": 0,
            "tradeTypes": [
                "Spot"
            ],
            "openedTradeTypes": [
                "Spot"
            ],
            "oesBound": -1
        }
    ]
  })
}

const interceptApiList = () => {
  cy.intercept('/_api/cyber-truck-vault/v2/sub/api-keys*', {
    code: '200',
    success: true,
    data: []
  }).as('apiList')
}

const checkBySiteConfig = (callback) => {
  getSiteConfig(url, (siteConfig) => {
    if (siteConfig.accountConfig.supportSubAccount) {
      callback?.();
    } else {
      cy.url().should((curUrl) => {
        const path = new URL(curUrl).pathname;
        expect(path.endsWith(replaceUrl)).to.be.true;
      });
    }
  })
}

const MOCK_SUB_API_DETAIL = {
  "apiKey": "68492873f38bb50001a258d8",
  "apiName": "testSubApi001",
  "brokerId": null,
  "authGroupMap": {
      "API_COMMON": true,
      "API_FUTURES": false,
      "API_SPOT": false,
      "API_LEADTRADE_FUTURES": false,
      "API_EARN": false,
      "API_TRANSFER": false,
      "API_WITHDRAW": false,
      "API_MARGIN": false
  },
  "permissionMap": {
      "API_COMMON": false,
      "API_FUTURES": false,
      "API_SPOT": false,
      "API_LEADTRADE_FUTURES": false,
      "API_EARN": false,
      "API_TRANSFER": true,
      "API_WITHDRAW": false,
      "API_MARGIN": false
  },
  "ipWhitelistStatus": 0,
  "ipWhitelist": "",
  "ipWhitelistScope": null,
  "currentIp": "10.40.64.53",
  "apiVersion": 3,
  "isActivated": true,
  "createdAt": 1749624947000,
  "subName": null
}

const enterNameAndPwd = () => {
  cy.get('[data-inspector="api_create_api_name"] input').type(MOCK_SUB_API_DETAIL.apiName);
  cy.get('[data-inspector="api_create_api_password"] input').type('1234567');
}

const interceptSubApiList = () => {
  cy.intercept('/_api/cyber-truck-vault/v2/sub/api-keys*', {
    "success": true,
    "code": "200",
    "msg": "success",
    "retry": false,
    "data": [MOCK_SUB_API_DETAIL]
})
}
const interceptSubApiDetail = () => {
  cy.intercept('/_api/cyber-truck-vault/v2/sub/api-key/detail*', {
    code: '200',
    success: true,
    data: MOCK_SUB_API_DETAIL
  });
}

export const checkSubAccount = (tenant = 'KC') => {
  describe(`【${url}】`, () => {
    beforeEach(() => {
      cy.login();
    });

    describe('子账号主页', () => {
      it('绑定引导', () => {
        cy.securityMethodsNone();

        checkBySiteConfig(() => {
          checkRender('[data-inspector="account_sub_page"]');
          cy.get('[data-inspector="account_sub_page"] a').then(([$a1, $a2]) => {
            cy.wrap($a1).should('have.attr', 'href').and('include', '/account/security/g2fa');
            cy.wrap($a2).should('have.attr', 'href').and('include', '/account/security/protect');
          });
        });
      });

      it('子账号资产总计', () => {
        interceptOverview();
        interceptQuery();
        cy.securityMethodsAll();

        checkBySiteConfig(() => {
          cy.url().then((curUrl) => {
            if ((tenant === 'TR' && curUrl === url) || curUrl ===`/tr${url}`) {
              // 土耳其语的数字分隔符是逗号
              cy.get('[data-inspector="account_sub_page_total"]').contains(`${MOCK_TOTAL_AMOUNT_TR} ${MOCK_BASE_CURRENCY}`);
            } else {
              cy.get('[data-inspector="account_sub_page_total"]').contains(`${MOCK_TOTAL_AMOUNT} ${MOCK_BASE_CURRENCY}`);
            }
          })
        });
      });
    });

    describe('创建子账号', () => {
      it('创建子账号', () => {
        cy.securityMethodsAll();
        cy.intercept('POST', '/_api/ucenter/v2/sub/user/create*', {
          code: '200',
          success: true
        }).as('create');

        checkBySiteConfig(() => {
          cy.get('[data-inspector="account_sub_create"]').click();
          cy.get('#subName input').type('testSubName');
          cy.get('#password input').type('Abc88888888');
          cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
          cy.validationCodePassed();
          cy.wait('@create').its('response.statusCode').should('eq', 200);
        });
      });
    });

    describe('子账号资金划转', () => {
      it('子账号资金划转', () => {
        cy.securityMethodsAll();
        interceptQuery();

        checkBySiteConfig(() => {
          cy.get('.handleLimit').first().click();
          // 子账号划转弹窗有 assets-web 提供，这里只检查是否渲染
          cy.get('.from-to-selector').should('exist');
        });

      });
    });

    describe('子账号设置', () => {
      describe('查看 API', () => {
        it('创建', () => {
          cy.securityMethodsAll();
          interceptQuery();
          interceptApiList();
          interceptCheckValidations();
          cy.intercept('/_api/cyber-truck-vault/v2/api-key/create-info*').as('createInfo');
          cy.intercept('POST', '/_api/cyber-truck-vault/v2/sub/api-key*', {
            code: '200',
            success: true,
            data: {
              status: 'success'
            }
          }).as('create');

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_api"]').click();
            cy.url('should').should('include', `/account-sub/api-manager/${MOCK_SUB_NAME}`);
            cy.get('.KuxButton-containedPrimary').click();
            cy.wait('@createInfo').then(() => {
              enterNameAndPwd();
              cy.get('[data-inspector="api_create_submit"]').click();
              cy.wait('@create').then(() => {
                checkRender('[data-inspector="api_manager_create_success"]');
              });
            });
          });
        });

        it('编辑', () => {
          cy.securityMethodsAll();
          interceptQuery();
          interceptApiList();
          interceptCheckValidations();
          interceptSubApiList();
          interceptSubApiDetail();
          cy.intercept('/_api/cyber-truck-vault/v2/sub/api-key/update*', {
            code: '200',
            success: true,
            data: {}
          }).as('update');

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_api"]').click();
            cy.url('should').should('include', `/account-sub/api-manager/${MOCK_SUB_NAME}`);
            cy.get('.ICEdit2_svg__icon').parent().click();
            cy.get('[data-inspector="api_manager_edit_page"]').should('exist');
            cy.get('.KuxButton-containedPrimary').click();
            cy.wait('@update').then(() => {
              cy.url('should').should('include', `/account-sub/api-manager/${MOCK_SUB_NAME}`);
            });
          });
        });

        it('删除', () => {
          cy.securityMethodsAll();
          interceptQuery();
          interceptApiList();
          interceptCheckValidations();
          interceptSubApiList();
          cy.intercept(`/_api/cyber-truck-vault/sub/api-key/delete/${MOCK_SUB_API_DETAIL.apiKey}*`, {
            code: '200',
            success: true,
            data: {}
          }).as('delete');

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_api"]').click();
            cy.url('should').should('include', `/account-sub/api-manager/${MOCK_SUB_NAME}`);
            cy.get('.ICDelete_svg__icon').parent().click();
            cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
            cy.wait('@delete').its('response.statusCode').should('eq', 200);
          });
        });
      });

      describe('交易权限', () => {
        it('修改交易权限', () => {
          interceptCheckValidations();
          interceptQuery();
          cy.intercept('/_api/user-biz-front/sub/position/info*').as('info');
          cy.intercept('/_api/user-biz-front/sub/user/update/access*', {
            code: '200',
            success: true,
          }).as('update');
  
          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_perm_update"]').click();
            cy.wait('@info').then(() => {
              cy.get('.KuxCheckbox-wrapper').click();
              cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
              cy.wait('@update').its('response.statusCode').should('eq', 200);
            })
          })
        });
      });

      describe('冻结子账号', () => {
        it('冻结子账号', () => {
          interceptQuery();
          cy.intercept('POST', '_api/ucenter/sub/user/freeze*', {
            code: '200',
            success: true,
          }).as('freeze')

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_freeze"]').click();
            cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
            cy.wait('@freeze').its('response.statusCode').should('eq', 200);
          });
        });
      });

      describe('重置子账号登录密码', () => {
        it('重置子账号登录密码', () => {
          interceptQuery();
          interceptCheckValidations();
          cy.intercept('POST', '/_api/ucenter/sub/user/reset-password*', {
            code: '200',
            success: true
          })

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_login_pwd_reset"]').click();

            cy.get('#password input').type('Abc88888888');
            cy.get('#rpassword input').type('Abc88888888');
            cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
          })
        });
      });

      describe('重置子账号交易密码', () => {
        it('重置子账号交易密码', () => {
          interceptQuery();
          interceptCheckValidations();
          cy.intercept('/_api/ucenter/sub/user/reset-trading-password*', {
            code: '200',
            success: true
          })

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_trading_pwd_reset"]').click();
  
            cy.get('#password input').type('456456');
            cy.get('#rpassword input').type('456456');
            cy.get('.KuxDialog-root .KuxButton-containedPrimary').click();
          });
        })
      });

      describe('重置子账号谷歌验证', () => {
        it('重置子账号谷歌验证', () => {
          interceptQuery();
          interceptCheckValidations();
          cy.intercept('/_api/ucenter/google2fa*', {
            code: '200',
            success: true,
            data: 'CQWNT576NR7CTSAMZASSLUKJSSGEKFJY'
          });
          cy.intercept('/_api/ucenter/sub/user/reset-2fa*', {
            code: '200',
            success: true,
          });

          checkBySiteConfig(() => {
            cy.get('.settingBtn').click();
            cy.get('[data-inspector="accounts_table_g2fa_reset"]').click();
            cy.get('.codeView').should('exist');
          });
        })
      });
    })

    if (tenant === 'KC') {
      describe('子账号资产详情', () => {
        it('查看资产详情', () => {
          cy.securityMethodsAll();
          interceptQuery();
  
          checkBySiteConfig(() => {
            cy.get('.handleLimit').eq(1).click();
            cy.url().should('include', `/account/assets/${MOCK_SUB_NAME}`);
            // 子账号资产页面由 assets-web 提供，这里只检查是否渲染
            cy.get('[data-inspector="account_sub_assets_page"]').should('exist');
          });
        })
      });
    }


    describe('子账号数据查询', () => {
      it('转账记录', () => {
        cy.securityMethodsAll();

        checkBySiteConfig(() => {
          cy.get('[data-inspector="account_sub_page_query"]').click();
          cy.get('[data-inspector="account_sub_history_page"]').should('exist');
        });
      });
    });
  })
}