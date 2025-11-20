module.exports = function (memo) {
  memo.module.rule('js').parser({ system: false });
  memo.module
    .rule('media')
    .test(/\.mp(3|4)$/)
    .use('file-loader')
    .loader(require.resolve('@umijs/deps/compiled/file-loader'));

  memo.module.rule('fonts').uses.clear();
  memo.module
    .rule('fonts')
    .use('url-loader')
    .loader(require.resolve('@umijs/deps/compiled/url-loader'))
    .options({
      limit: Infinity,
    });

  return memo;
};
