module.exports = {
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeTitle: true,
    },
    {
      removeAttrs: {
        attrs: ['path:fill'],
      },
    },
  ],
};
