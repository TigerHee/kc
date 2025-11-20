/* eslint-disable no-undef */
import { TR_MODULES } from '../../constant';
import { check404, checkModulesRender, checkRender, verifyTradePwd, visitPage } from '../../utils';

describe('新交易大厅页面巡检', () => {
  beforeEach(() => {
    cy.login();
  });

  it('screen >= 1280 新交易大厅页面巡检', () => {
    // 进入页面
    visitPage();

    // 检查header渲染正常
    checkRender('[data-inspector="tradeV4_header"]');

    // 使用登录抽屉执行登录操作
    // loginUseDrawer();

    // 验证交易密码
    // verifyTradePwd();

    // 检查模块渲染情况
    checkModulesRender(TR_MODULES);

    // 检查是否有模块 render error
    // cy.get('.flexlayout__error_boundary_container').should('not.exist');

    // 检查死链
    check404('#trade4-xl-container');
  });
});
