module.exports = function (memo) {
  memo.externals([
    {
      react: 'window.React',
      'react-dom': 'window.ReactDOM',
      'react-redux': 'window.ReactRedux',
      '@emotion/css': 'window.emotion',
      '@remote/download': 'window.$KcRemoteApp.packages.downloadBanner',
    },
    function (context, request, callback) {
      if (/^@kc\/mui$/.test(request)) {
        return callback(null, '$KcMui.components');
      }

      if (/^@kc\/mui\/lib/.test(request)) {
        return callback(null, request.replace(/^@kc\/mui\/lib/, '$KcMui').replace(/\//g, '.'));
      }

      if (/^@kufox\/mui/.test(request)) {
        return callback(null, request.replace(/^@kufox\/mui/, '$KufoxMui').replace(/\//g, '.'));
      }

      return callback();
    },
  ]);

  return memo;
};
