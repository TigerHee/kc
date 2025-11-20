/**
 * Owner: victor.ren@kupotech.com
 */
import glob from 'glob';
import path from 'path';
import rimraf from 'rimraf';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import commonPlugins from './config/plugins.config';

rimraf(path.resolve(__dirname, './lib'), (err) => {
  if (err) {
    console.log('remove lib error', err);
  }
});

const isDev = process.env.NODE_ENV !== 'production';

const entriesComponent = glob.sync('src/components/**/index.js');

const otherEntries = glob.sync('src/**/*.js', {
  ignore: ['src/components/**/*'],
});

const entries = [...entriesComponent, ...otherEntries];

const external = entries.map((input) => {
  return path.resolve(__dirname, input);
});

export default entries.map((input) => {
  input = input.replace('src/', '');
  const fileInput = isDev ? input : input.replace('components/', '');

  return {
    input: `src/${input}`,
    output: [
      {
        file: `lib/${fileInput}`,
        format: 'esm',
        exports: 'auto',
      },
      {
        file: `lib/node/${fileInput}`,
        format: 'cjs',
        exports: 'auto',
      },
    ],
    plugins: [
      ...commonPlugins,
      peerDepsExternal({
        includeDependencies: true,
      }),
    ],
    external: [...external, '@emotion/react', '@emotion/styled', '@emotion/cache'],
  };
});
