const url = '/download/ios';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="download_ios_page"]').should('exist');

    // 点击下载按钮 data-inspector="download_android_page"
    cy.get('[data-inspector="download_button"]').click();
    // 判断二维码存在 data-inspector="download_qr_code"
    cy.get('[data-inspector="download_qr_code"]').should('exist');
    // 再点击下关闭
    cy.get('[data-inspector="download_button"]').click();
    cy.get('[data-inspector="download_qr_code"]').should('not.exist');
  });
});
