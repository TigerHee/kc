export default (url) => {
  describe(`【${url}】`, () => {
    it(`${url} can not visit`, () => {
      cy.visit(url);
      cy.url().should('to.match', /\/error|\/404/)
    })
  })
}