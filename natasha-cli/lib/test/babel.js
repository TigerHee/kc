module.exports = (context, opts) => {
  const preset = {
    presets: [
      [
        require('@babel/preset-env').default,
        {
          env: {
            targets: {
              node: 'current'
            },
            modules: 'commonjs'
          }
        }
      ],
      [require('@babel/preset-react').default],
      [
        require('@babel/preset-typescript').default,
        {
          allowNamespaces: true
        }
      ]
    ].filter(Boolean),
    plugins: [
      [require('@babel/plugin-proposal-decorators').default, { legacy: false }],
      [require('@babel/plugin-transform-runtime').default],
      [
        require('@babel/plugin-proposal-object-rest-spread').default,
        { loose: true }
      ],
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true
        }
      ],
      [require('@babel/plugin-transform-modules-commonjs').default]
    ].filter(Boolean)
  };
  return preset;
};
