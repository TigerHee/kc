const { extname } = require('path');
const t = require('@babel/types');

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

/**
 * @see https://github.com/umijs/umi/blob/v3.5.33/packages/babel-plugin-auto-css-modules/src/index.ts
 * @see https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/README.md
 */
module.exports = function autoCssModule () {
  return {
    visitor: {
      ImportDeclaration (
        path,
        { opts }
      ) {
        const {
          specifiers,
          source,
          source: { value }
        } = path.node;
        if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
          source.value = `${value}?${opts.flag || 'modules'}`;
        }
      },

      // e.g.
      // const styles = await import('./index.less');
      VariableDeclarator (
        path,
        { opts }
      ) {
        const { node } = path;
        if (
          t.isAwaitExpression(node.init) &&
          t.isCallExpression(node.init.argument) &&
          t.isImport(node.init.argument.callee) &&
          node.init.argument.arguments.length === 1 &&
          t.isStringLiteral(node.init.argument.arguments[0]) &&
          CSS_EXT_NAMES.includes(extname(node.init.argument.arguments[0].value))
        ) {
          node.init.argument.arguments[0].value = `${
            node.init.argument.arguments[0].value
          }?${opts.flag || 'modules'}`;
        }
      }
    }
  };
};
