const url = '/download';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="inspector_download_qrcode"]').should('exist');

    // ios 按钮 a 标签的链接 等于 xx
    cy.get('[data-inspector="inspector_download_apple"]').should(
      'have.attr',
      'href',
      'https://kucointh.onelink.me/AiYm/3sry39qx',
    );

    // android 按钮 a 标签的链接 等于 xx
    cy.get('[data-inspector="inspector_download_google"]').should(
      'have.attr',
      'href',
      'https://kucointh.onelink.me/AiYm/dkabb2xw',
    );

    // apk 按钮 a 标签的链接 等于 xx
    cy.get('[data-inspector="inspector_download_apk"]').should(
      'have.attr',
      'href',
      'https://kucointh.onelink.me/AiYm/0a9yzxe6',
    );
  });
});
