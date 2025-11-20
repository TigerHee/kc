module.exports = () => ({
  plugins: [
    require.resolve('postcss-nested'),
    [require.resolve('postcss-preset-env'), {
      stage: 3,
      autoprefixer: {
        flexbox: 'no-2009'
      },
      browsers: [
        'last 2 versions',
        'Firefox ESR',
        '> 1%',
        'ie >= 9',
        'iOS >= 8',
        'Android >= 4'
      ]
    }]
  ]
});
