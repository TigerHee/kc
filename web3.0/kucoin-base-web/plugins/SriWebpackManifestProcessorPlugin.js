const crypto = require('crypto');
/**
 * 使用 sha384 算法生成 SRI 哈希
 * @param {string | Buffer} content - 要生成 SRI 的文本内容或 Buffer 对象
 * @returns {string} SRI 格式的哈希值，例如：`sha384-<Base64 编码的哈希>`
 */
function generateSRIHash(content) {
  if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
    throw new TypeError('Content must be a string or Buffer.');
  }

  // 使用 crypto 的 createHash 生成 sha384 哈希
  const hash = crypto
    .createHash('sha384')  // 指定算法 sha384
    .update(content)       // 更新数据内容
    .digest('base64');     // 将结果编码为 Base64

  return `sha384-${hash}`;
}

class SriWebpackManifestProcessorPlugin {
  constructor({ inputManifestFileName, outputFileName } = {}) {
    this.inputManifestFileName = inputManifestFileName || 'import-map.json'; // 默认输入 manifest 文件
    this.outputFileName = outputFileName || 'import-map.json';    // 默认输出文件名
  }

  apply(compiler) {
    // 使用 Webpack 的 emit 钩子，确保在所有资源生成后执行
    compiler.hooks.emit.tapAsync(
      'SriWebpackManifestProcessorPlugin',
      (compilation, callback) => {
        // Step 1: 从 compilation.assets 获取 WebpackManifestPlugin 生成的 manifest 文件
        const manifestAsset = compilation.assets[this.inputManifestFileName];

        if (!manifestAsset) {
          console.warn(
            `[SriWebpackManifestProcessorPlugin] 没找到预处理的 import-map 文件: (${this.inputManifestFileName})`
          );
          callback(); // 如果没有找到 Manifest 文件，结束处理
          return;
        }

        // Step 2: 解析 manifest 文件内容
        const manifestContent = manifestAsset.source(); // 读取文件内容
        let manifest;
        try {
          manifest = JSON.parse(manifestContent);
        } catch (err) {
          console.error(
            `[SriWebpackManifestProcessorPlugin] 文件 import-map 解析失败: ${err.message}`
          );
          callback(err);
          return;
        }

        // Step 3: 生成integrity的操作，对 compilation.assets 的内容进行处理
        const sourceMap = [
          ...Object.values(manifest.imports ?? {}),
          ...Object.values(manifest.depcache ?? {}).flat(),
        ];
        const rootPath = process.env.NODE_ENV === 'development' ? '/' : process.env.REACT_APP_CDN + '/';
        const integrity = sourceMap.map((url) => {
          const relativePath = url.split(rootPath)[1];
          const content = compilation.assets[relativePath];
          if (content) {
            console.log('[SriWebpackManifestProcessorPlugin] 进行sha384计算:', relativePath);
            const sha384Hash = generateSRIHash(content.source());
            return [
              url,
              sha384Hash
            ]
          }
          return null
        }).filter(Boolean).reduce((acc, [url, sha384Hash]) => {
          acc[url] = sha384Hash;
          return acc;
        }, {});
        manifest.integrity = integrity;
        const processedManifest = manifest;

        // Step 4: 将处理后的结果写入为一个新的文件
        const finalManifestContent = JSON.stringify(processedManifest, null, 2); // 转成 JSON 格式
        compilation.assets[this.outputFileName] = {
          source: () => finalManifestContent,
          size: () => finalManifestContent.length,
        };
        console.log(`[SriWebpackManifestProcessorPlugin] Generated file: ${this.outputFileName}`); // 通知 Webpack 构建流程完成
        callback();
      }
    );
  }
}

module.exports = SriWebpackManifestProcessorPlugin;
