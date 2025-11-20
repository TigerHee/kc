const fs = require('fs-extra');
const path = require('path');
const { createFilter } = require('@rollup/pluginutils');
const { minify } = require('terser');
const pkg = require('../package.json');

// 生成 package.json 插件
function generatePackageJson() {
  let hasGenerated = false;

  return {
    name: 'generate-package-json',
    async writeBundle() {
      if (hasGenerated) {
        return;
      }

      console.log('📦 生成发布用的 package.json...');

      const devPackageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));

      // 自动扫描 externals 目录生成 exports 配置
      const externalsDir = 'externals';
      // 扫描 dist 目录，自动检测生成的文件
      const distDir = 'dist';
      const generatedFiles = (await fs.pathExists(distDir)) ? await fs.readdir(distDir) : [];

      // 扫描 assets 目录，检测图片资源
      const assetsDir = path.join(distDir, 'assets');
      const assetFiles = (await fs.pathExists(assetsDir)) ? await fs.readdir(assetsDir) : [];

      const exports = {
        '.': {
          import: './index.esm.js',
          // require: './index.js',
          types: './src/index.d.ts',
        },
      };

      // 扫描 externals 目录下的所有 .ts 文件
      if (await fs.pathExists(externalsDir)) {
        const files = await fs.readdir(externalsDir);
        for (const file of files) {
          if (file.endsWith('.ts')) {
            const name = path.basename(file, '.ts');
            const filePath = path.join(externalsDir, file);

            // 读取文件内容，查找 @types 注释
            let typePath = `./src/${name}.d.ts`; // 默认路径
            try {
              const content = await fs.readFile(filePath, 'utf8');
              const typesMatch = content.match(/\/\/\s*@types:\s*(.+)/);
              if (typesMatch) {
                typePath = typesMatch[1].trim();
              }
            } catch (error) {
              console.warn(`无法读取文件 ${filePath}:`, error.message);
            }

            const cssExists = generatedFiles.includes(`${name}.css`);

            if (['transfer', 'kyc', 'mailAuthorize'].includes(name)) {
              exports[`./${name}`] = {
                import: `./esm/${name}.js`,
                // "require": `./cjs/${name}.js`,
                types: typePath,
                default: `./esm/${name}.js`,
              };
            } else {
              exports[`./${name}`] = {
                import: `./esm/${name}.js`,
                // "require": `./cjs/${name}.js`,
                types: typePath,
              };
            }

            if (cssExists) {
              exports[`./${name}.css`] = {
                import: `./${name}.css`,
                require: `./${name}.css`,
              };
            }
          }
        }
      }

      // 添加图片资源的导出
      if (assetFiles.length > 0) {
        exports[`./assets/*`] = {
          import: `./assets/*`,
          require: `./assets/*`,
        };
      }

      exports[`./package.json`] = {
        import: `./package.json`,
        require: `./package.json`,
      };

      const publishPackageJson = {
        name: 'gbiz-next',
        version: devPackageJson.version,
        description: 'GBiz Next.js 组件库',
        main: 'index.js',
        module: 'index.esm.js',
        types: 'src/index.d.ts',
        exports,
        files: ['*.js', '*.d.ts', '*.esm.js', '*.css', 'assets/*', 'src/*', 'locales/*', 'esm', 'cjs', 'css'],
        peerDependencies: devPackageJson.peerDependencies || {},
        dependencies: devPackageJson.dependencies || {},
        keywords: ['react', 'nextjs', 'components'],
        license: 'MIT',
        repository: devPackageJson.repository,
        bugs: devPackageJson.bugs,
        homepage: devPackageJson.homepage,
      };

      await fs.writeJson('dist/package.json', publishPackageJson, {
        spaces: 2,
      });
      console.log('  ✓ 生成 package.json');

      hasGenerated = true;
    },
  };
}

// 复制静态资源插件
function copyStaticAssets() {
  return {
    name: 'copy-static-assets',
    async writeBundle() {
      console.log('📁 复制静态资源...');

      // 复制 locales 目录到版本化路径
      if (await fs.pathExists('src/locales')) {
        try {
          await fs.copy('src/locales', `dist/assets/${pkg.version}/locales`, {
            overwrite: true,
          });
          console.log(`  ✓ 复制 locales 目录到 assets/${pkg.version}/locales`);
        } catch (error) {
          if (error.code !== 'EEXIST') {
            throw error;
          }
          console.log('  ✓ locales 目录已存在，跳过复制');
        }
      }

      // 确保 assets 目录存在
      await fs.ensureDir('dist/assets');

      // 扫描 dist 根目录下的图片资源并移动到 assets 目录
      const distDir = 'dist';
      if (await fs.pathExists(distDir)) {
        const files = await fs.readdir(distDir);
        const imageExtensions = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

        for (const file of files) {
          const filePath = path.join(distDir, file);
          const ext = path.extname(file).toLowerCase();

          // 检查是否为图片文件且不在 assets 目录中
          if (imageExtensions.includes(ext) && !file.startsWith('assets/')) {
            try {
              const stats = await fs.stat(filePath);
              if (stats.isFile()) {
                const targetPath = path.join(distDir, 'assets', file);
                await fs.move(filePath, targetPath, { overwrite: true });
                console.log(`  ✓ 移动图片资源: ${file} -> assets/${file}`);
              }
            } catch (error) {
              console.warn(`  ⚠️  移动图片资源失败: ${file}`, error.message);
            }
          }
        }
      }

      console.log('  ✓ 静态资源复制完成');
    },
  };
}

// 清理 dist 目录插件
function cleanDist() {
  return {
    name: 'clean-dist',
    async buildStart() {
      console.log('🧹 清理 dist 目录...');
      await fs.remove('dist');
      await fs.ensureDir('dist');
      console.log('  ✓ 清理完成');
    },
  };
}

function inlineScriptMinify(options = {}) {
  const filter = createFilter(options.include || ['**/*.tsx', '**/*.jsx'], options.exclude);

  return {
    name: 'inline-script-minify',
    async transform(code, id) {
      if (!filter(id)) return null;

      const pattern = /__html:\s*`([\s\S]*?)`/g;
      let transformed = code;
      let match;
      let offset = 0;

      while ((match = pattern.exec(code)) !== null) {
        const original = match[0];
        const script = match[1];
        const minified = await minify(script, { format: { comments: false } });

        if (!minified.code) continue;

        const replacement = `__html:\`${minified.code}\``;
        const start = match.index + offset;
        const end = start + original.length;
        transformed = transformed.slice(0, start) + replacement + transformed.slice(end);
        offset += replacement.length - original.length;
      }

      return { code: transformed, map: null };
    },
  };
}

module.exports = {
  generatePackageJson,
  copyStaticAssets,
  cleanDist,
  inlineScriptMinify,
};
