const _visit =  (
  url,
  inspector,
  {
    delay = 0,
  } = {}
) => {
  if (!url) return;
  it(`${url} can be visit`, () => {
    cy.visit(url);
    cy.wait(delay);
    if (inspector) {
      cy.get(`[data-inspector="${inspector}"]`).should('exist');
    } else {
      // 未传入inspector，默认body div下应具有子元素
      cy.get('#body').children().should('exist');
    }
  })
};


export default (url, ...rest) => {
  describe(`【${url}】`, () => {
    _visit(url, ...rest);
  })
}

export const visit = (url) => {
  describe(`【${url}】visit collection`, () => {
    it(`${url} visit`, () => {
      cy.visit(url);
    })
  })
}