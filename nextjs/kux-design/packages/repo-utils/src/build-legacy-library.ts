import rollup from 'rollup'
import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'
import crypto from 'crypto'
import postcss from 'rollup-plugin-postcss'
import url from '@rollup/plugin-url'

export interface ILibConfig {
  /**
   * entry file path
   * @example 'src/system/react-redux.ts'
   */
  entry: string;
  /**
   * output file name, hash & format will be appended
   * when multiple files are generated, this will be omit
   * @example 'react-redux'
   */
  fileName: string;
  /**
   * library name
   * omit if build in systemjs
   */
  libName?: string;
  /**
   * output directory
   * @default 'dist/libs'
   */
  outputDir?: string;
  /**
   * library format
   * @default 'iife'
   */
  format?: 'amd' | 'cjs' | 'es' | 'iife' | 'umd' | 'system';
  /**
   * constant definitions
   * use for tree-shaking in production
   */
  define?: Record<string, string>;
  /**
   * extra assets out directory
   * required when library has multiple output files
   */
  assetsDir?: string;
  /**
   * public access path for assets, associated with the `assetsDir`
   * @example 'https://cdn.com/assets'
   */
  publicPath?: string;

  /**
   * external dependencies
   * * ['react', 'react-dom'] will be always external
   * @example ['react-redux']
   */
  external?: string[];
}


/**
 * Generate a hash for the given file content
 * @param {string} content
 * @returns {string}
 */
function generateHash(content: string) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

/**
 * Default external dependencies
 */
const defaultExternal = ['react', 'react-dom']

/**
 * Build a SystemJS library
 * @param {string} src - The input file path
 * @param {string} outputDir - The output directory
 */
export async function buildLegacyLibrary(options: ILibConfig) {
  const cwd = process.cwd()
  const external = defaultExternal.concat(options.external || [])

  const inputOptions: rollup.InputOptions = {
    input: path.resolve(cwd, options.entry), // Use the provided input file
    external,
    jsx: 'react-jsx',
    plugins: [
      resolve(), // Resolves node_modules
      commonjs(), // Converts CommonJS to ES Modules
      typescript({
        tsconfig: path.resolve(cwd, 'tsconfig.json'), // Use the root tsconfig
      }),
      replace({
        preventAssignment: true, // Prevent direct assignment
        values: {
          // Replace with production environment
          'process.env.NODE_ENV': JSON.stringify('production'),
          ...options.define, // Add custom definitions
        },
      }),
      postcss({
        extract: true, // Extract CSS if option is set
        minimize: true, // Minify CSS
        // @ts-expect-error set sass options
        use: {
          sass: {
            includePaths: [path.resolve(cwd, 'node_modules')], // Include paths for Sass
            silenceDeprecations: ['import'],
            api: 'modern',
          }
        }
      }),
      // 修正 @rollup/plugin-url 插件不能处理带有 ?url 后缀的文件的问题
      {
        name: 'process-url-suffix',
        async resolveId(source, importer) {
          if (source.includes('?url')) {
            const resolvedPath = await this.resolve(source.replace('?url', ''), importer, { skipSelf: true });
            if (resolvedPath) {
              return resolvedPath;
            }
          }
          return null; // Let other plugins handle it
        },
        load(id) {
          if (id.includes('?url')) {
            // Modify how Rollup handles files with `?url`
            return null; // Allow Rollup to continue processing this file
          }
          return null;
        },
      },
      url({
        include: /\.(png|jpe?g|gif|webp|svg|json)$/i, // Include files with ?url suffix
        limit: 0, // Always emit files
        emitFiles: true, // Emit files as separate files
        fileName: '[name][extname]', // Use a hash in the file name
        publicPath: options.publicPath || '', // Public path for assets
        destDir: options.assetsDir || 'dist/assets', // Output directory for assets
      }),
      babel({
        babelHelpers: 'runtime', // Change to 'runtime'
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                chrome: '64',
                edge: '79',
                firefox: '67',
                opera: '51',
                safari: '12',
              },
              useBuiltIns: 'usage', // Add polyfills based on usage
              corejs: 3, // Use CoreJS version 3 for polyfills
            },
          ],
          '@babel/preset-react', // Add preset-react to support JSX
        ],
        plugins: [
          '@babel/plugin-transform-runtime', // Ensure this plugin is included
        ],
        include: /node_modules/, // Include all node_modules for transpilation
        exclude: /(core-js|regenerator-runtime)/, // Exclude already optimized polyfills
        // exclude: 'node_modules/**', // Exclude node_modules
      }),
      terser(), // Minify output
    ],
  };

  const format = options.format || 'iife';

  try {
    // Create a Rollup bundle
    const bundle = await rollup.rollup(inputOptions);

    // Generate the output file name with a hash
    const outputContent = await bundle.generate({ format });
    const hash = generateHash(outputContent.output[0].code);
    const outputFileName = `${options.fileName}.${hash}.${format}.js`;
    const outputDir = options.outputDir || 'dist/libs';

    const outputOptions = {
      dir: options.assetsDir ? path.resolve(cwd, outputDir) : undefined, // Output directory
      file: options.assetsDir ? undefined : path.resolve(cwd, outputDir, outputFileName), // Output file with hash
      format,
      name: options.libName,
      sourcemap: false, // Enable sourcemaps
    };
    // Write the final output
    await bundle.write(outputOptions as rollup.OutputOptions);

    console.log(`Build completed! Output file: ${outputFileName}`);
  } catch (error: any) {
    console.error('Build failed:', error.message);
    console.error('\t', error.stack);
  }
}
