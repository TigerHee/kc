const absolutePathSourceMap = () => {
  return {
    name: 'absolute-path-sourcemap',
    generateBundle(options, bundle) {
      // eslint-disable-next-line no-restricted-syntax, no-unused-vars
      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === 'chunk' && value.map) {
          value.map.sources = value.map.sources.map((source) => {
            const absolutePath = source.replace(/(\.\.\/)+/g, '');
            return absolutePath.replace(/\\/g, '/');
          });
        }
      }
    },
  };
};
export default absolutePathSourceMap;
