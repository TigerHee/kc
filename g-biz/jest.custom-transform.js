module.exports = {
  process(src, filename) {
    // 自定义的 mock 内容
    return `module.exports = '${filename}';`;
  }
};