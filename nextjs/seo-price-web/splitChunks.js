module.exports = {
  // 'react': {
  //   test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
  //   name: 'react',
  //   chunks: 'all',
  //   priority: 30,
  // },
  // 'gbiz-next': {
  //   test: /[\\/]node_modules[\\/]gbiz-next[\\/]/,
  //   name: (module) => {
  //     // 提取 gbiz-next 子模块路径
  //     const modulePath = module.identifier();

  //     console.log('modulePath --> ', modulePath)
  //     const match = modulePath.match(/gbiz-next[\\/](.+?)[\\/]/);
  //     if (match && match[1]) {
  //       const subModule = match[1].replace(/[\\/]/g, '-');
  //       // 生成简短 hash (使用模块路径的字符码)
  //       const hash = modulePath
  //         .split('')
  //         .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  //         .toString(36)
  //         .substring(0, 6);
  //       return `gbiz-next-${subModule}-${hash}`;
  //     }
  //     return 'gbiz-next-core';
  //   },
  //   chunks: 'all',
  //   priority: 30,
  // },
  'next-dist': {
    test: /[\\/]node_modules[\\/]next\/dist[\\/]/,
    name: 'next-dist',
    chunks: 'all',
    priority: 30,
  },
  // 'kc-next': {
  //   test: /[\\/]node_modules[\\/]kc-next[\\/]/,
  //   name: 'kc-next',
  //   chunks: 'all',
  //   priority: 30,
  // },
  'kux-mui': {
    test: /[\\/]node_modules[\\/]@kux[\\/]mui-next[\\/]/,
    name: 'kux-mui',
    chunks: 'all',
    priority: 30,
  },
  'kux-icons': {
    test: /[\\/]node_modules[\\/]@kux[\\/]icons[\\/]/,
    name: 'kux-icons',
    chunks: 'all',
    priority: 30,
  },
  // 'sentry': {
  //   test: /[\\/]node_modules[\\/](@sentry[\\/]|@sentry-)/,
  //   name: 'sentry',
  //   chunks: 'all',
  //   priority: 30,
  // },
  'i18n': {
    test: /[\\/]node_modules[\\/](i18next(?:-[^\\/]+)?|[^\\/]+-i18next)[\\/]/,
    name: 'i18n',
    chunks: 'all',
    priority: 30,
  },
  'combined-vendors': {
    test: /[\\/]node_modules[\\/]/,
    name: (module) => {
      // 提取模块名称
      const modulePath = module.identifier();
      const match = modulePath.match(/[\\/]node_modules[\\/](@?[^\/\\]+)/);
      if (match && match[1]) {
        const moduleName = match[1]
          .replace(/[@\/\\]/g, '-')  // 替换特殊字符
          .toLowerCase();            // 转换为小写
        return `vendor-${moduleName}`;
      }
      return 'combined-vendor';
    },
    chunks: 'all',
    priority: 10,
    enforce: true,
    reuseExistingChunk: true,
    minSize: 32 * 1024,
    maxSize: 1 * 1024 * 1024,
  },
}