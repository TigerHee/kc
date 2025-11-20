const MuiModuleReplacementList = [
  {
    search: /@kufox\/mui\/isPropValid/,
    replace: 'node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js',
  },
  {
    search: /@kufox\/mui\/styled/,
    replace: 'node_modules/@kufox/mui/emotion/index.js',
  },
  {
    search: /@kufox\/mui\/(with\w+)/,
    replace: 'node_modules/@kufox/mui/hocs/$1.js',
  },
  {
    search: /@kufox\/mui\/(use\w+)/,
    replace: 'node_modules/@kufox/mui/hooks/$1.js',
  },
  {
    search: /@kufox\/mui\/((?:px2rem|animate|ownerWindow|ownerDocument|debounce))/,
    replace: 'node_modules/@kufox/mui/utils/$1.js',
  },
  {
    search: /@kux\/mui\/isPropValid/,
    replace: 'node_modules/@emotion/is-prop-valid/dist/emotion-is-prop-valid.esm.js',
  },
  {
    search: /@kux\/mui\/styled/,
    replace: 'node_modules/@kux/mui/emotion/index.js',
  },
  {
    search: /@kux\/mui\/css/,
    replace: 'node_modules/@kux/mui/emotion/css.js',
  },
  {
    search: /@kux\/mui\/keyframes/,
    replace: 'node_modules/@kux/mui/emotion/keyframes.js',
  },
  {
    search: /@kux\/mui\/(with\w+)/,
    replace: 'node_modules/@kux/mui/hocs/$1.js',
  },
  {
    search: /@kux\/mui\/(use\w+)/,
    replace: 'node_modules/@kux/mui/hooks/$1.js',
  },
  {
    search: /@kux\/mui\/((?:px2rem|animate|ownerWindow|ownerDocument|debounce))/,
    replace: 'node_modules/@kux/mui/utils/$1.js',
  },
  {
    search: /@kux\/mui\/ClassNames/,
    replace: 'node_modules/@kux/mui/emotion/ClassNames.js',
  },
  {
    search: /@kux\/mui\/Global/,
    replace: 'node_modules/@kux/mui/emotion/Global.js',
  },
];
export default MuiModuleReplacementList;
