module.exports = {
  presets: ['next/babel'],
  plugins: [
    [require.resolve('./babel-plugins/babel-plugin-auto-dva-register.js'), {
      includeRegex: '/src/'
    }]
  ]
};
