export default api => {
  api.modifyHTMLWithAST(($, { route, getChunkPath }) => {
    $('head script').each(function(i, elem) {
      if (
        $(this)
          .html()
          .indexOf('window.routerBase') > -1
      ) {
        // 删除umi注入的默认routerBase
        $(this).remove();
      }
    });
    return $;
  });
};
