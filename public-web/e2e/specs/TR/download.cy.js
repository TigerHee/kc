const url = '/download';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.visit(url);
    cy.get('[data-inspector="inspector_download_qrcode"]').should('exist');
    cy.get('[data-inspector="inspector_download_apk"]').should('not.exist');

    // ios 点击后下载文件 TODO: 后期替换链接，需要修改用例
    cy.get('[data-inspector="inspector_download_apple"]').should(
      'have.attr',
      'href',
      'https://kucointr.onelink.me/NM0m/973fkf3j',
    );

     // android google play点击后下载文件
     cy.get('[data-inspector="inspector_download_google"]').should(
      'have.attr',
      'href',
      'https://kucointr.onelink.me/NM0m/973fkf3j',
    );
  });
});
