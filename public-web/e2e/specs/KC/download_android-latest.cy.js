const url = '/download/android-latest';
describe(`【${url}】`, () => {
  it(`${url} route test`, () => {
    cy.intercept('GET', 'https://assets.staticimg.com/apps/android/kucoin.apk', {
      statusCode: 200,
      body: 'Redirect prevented', // 防止下载 apk
    }).as('apkRequest');

    cy.visit(url);

    // 说明自动发起了下载请求
    cy.wait('@apkRequest').then((interception) => {
      // 检查响应状态码是否为 200
      expect(interception.response.statusCode).to.eq(200);
      // 检查响应体是否为 'Redirect prevented'
      expect(interception.response.body).to.eq('Redirect prevented');
    });

    // cy.get('[data-inspector="download_android_latest_page"]').should('exist');
    // cy.get('[data-inspector="download_link"]').should(
    //   'have.text',
    //   'https://assets.staticimg.com/apps/android/kucoin.apk',
    // );
  });
});
