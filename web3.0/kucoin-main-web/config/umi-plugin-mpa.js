/**
 * MPA 使用的 umi 插件
 * 目前仅修改临时生成的 .umi-production 目录名
 */
export default (api) => {
  api.describe({
    key: 'subApp',
    config: {
      schema(joi) {
        return joi.string();
      },
    },
  });

  api.modifyPaths(async (paths) => {
    return {
      ...paths,
      absTmpPath: `${paths.absTmpPath}-${api.config.subApp}`
    };
  });
};
