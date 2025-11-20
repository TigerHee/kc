/**
 * Owner: victor.ren@kupotech.com
 */
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import nodeGlobals from 'rollup-plugin-node-globals';
import css from 'rollup-plugin-import-css';
// import { terser } from 'rollup-plugin-terser';
import commonPlugins from './config/plugins.config';
// import visualizer from 'rollup-plugin-visualizer';

function resolveNestedImport(packageFolder, importee, dir) {
  const folderOrFile = importee.split('/')[1];
  const resolvedFilename = path.resolve(
    __dirname,
    dir ? `./src/${packageFolder}/${folderOrFile}/index` : `./src/${packageFolder}/${folderOrFile}`,
  );
  return `${resolvedFilename}.js`;
}

const nestedFolder = {
  resolveId: (importee) => {
    // console.log('importee ---------- :', importee);
    if (importee.indexOf('components/') === 0) {
      return resolveNestedImport('components', importee, true);
    }

    // if (importee.indexOf('config/') === 0) {
    //   return resolveNestedImport('config', importee, true);
    // }

    if (importee.indexOf('hooks/') === 0) {
      return resolveNestedImport('hooks', importee);
    }

    if (importee.indexOf('hocs/') === 0) {
      return resolveNestedImport('hocs', importee);
    }

    if (importee.indexOf('utils/') === 0) {
      return resolveNestedImport('utils', importee);
    }

    if (importee.indexOf('emotion/') === 0) {
      return resolveNestedImport('emotion', importee);
    }

    if (importee.indexOf('context/') === 0) {
      return resolveNestedImport('context', importee);
    }

    if (importee.indexOf('themes/') === 0) {
      return resolveNestedImport('themes', importee);
    }

    if (importee.indexOf('styles/') === 0) {
      return resolveNestedImport('styles', importee);
    }

    return undefined;
  },
};

export default () => [
  {
    input: `src/index.js`,
    output: {
      file: `lib/umd/kux-mui.umd.js`,
      format: 'umd',
      name: '$KuxMui',
      sourcemap: 'inline',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        // '@emotion/react': 'emotionReact',
        // '@emotion/styled': 'emotionStyled',
        // 'lodash-es': '_',
      },
    },
    external: ['react', 'react-dom'],
    plugins: [
      nestedFolder,
      resolve({
        browser: true,
      }),
      ...commonPlugins,
      nodeGlobals(),
      css(),
    ],
  },
  {
    input: `src/index.js`,
    output: {
      file: `lib/umd/kux-mui.umd.min.js`,
      format: 'umd',
      name: '$KuxMui',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        // '@emotion/react': 'emotionReact',
        // '@emotion/styled': 'emotionStyled',
        // 'lodash-es': '_',
      },
    },
    external: ['react', 'react-dom'],
    plugins: [
      nestedFolder,
      resolve({
        browser: true,
      }),
      ...commonPlugins,
      nodeGlobals(),
      css({ minify: true }),
      // terser({
      //   compress: {
      //     drop_console: true,
      //   },
      // }),
      // visualizer({ open: true, gzipSize: true }),
    ],
  },
];
