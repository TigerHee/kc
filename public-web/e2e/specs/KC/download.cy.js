const url = '/download';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="inspector_download_qrcode"]').should('exist');

    // ios 按钮 a 标签的链接 等于 xx
    cy.get('[data-inspector="inspector_download_apple"]').should(
      'have.attr',
      'href',
      'https://kucoin-ios.onelink.me/L1k4/18p1goqs',
    );

    // android 点击后跳转到 xx 链接
    cy.get('[data-inspector="inspector_download_google"]').should(
      'have.attr',
      'href',
      'https://kucoin-android.onelink.me/xTQQ/pvve7hp8',
    );

    // apk 点击后下载文件
    cy.get('[data-inspector="inspector_download_apk"]').should(
      'have.attr',
      'href',
      'https://kucoin-android.onelink.me/xTQQ/909khuy9',
    );
  });
});
