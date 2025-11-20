// rollup-plugin-normal-module-replacement.js

export default function normalModuleReplacementPlugin(replacements) {
  return {
    name: 'normal-module-replacement',
    resolveId(source, importer) {
      if (!replacements || !replacements.length) {
        return null;
      }
      if (source.match(/^@kufox\/mui/) || source.match(/^@kux\/mui/)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const i of replacements) {
          const { search, replace } = i;
          if (source.match(search)) {
            const _replace = source.replace(search, replace);
            // console.log(`Replacing '${source}' with '${_replace}' in '${importer}'`);
            return _replace;
          }
        }
      }
      return source;
    },
  };
}
