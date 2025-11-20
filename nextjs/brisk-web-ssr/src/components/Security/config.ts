export const getSecurityContent = (step: number, t: (key: string, options?: any) => string) => {
  const content = {
    0: {
      title: t('3c947143d86c4000a49f'),
      desc: [
        {
          summary: t('bcc2183cc5c74000a602'),
          detail: t('466b4f0fea4b4800a92e'),
        },
        {
          summary: t('437d2f87083a4800a230'),
          detail: t('9bff30b406454000a7ba'),
        },
        {
          summary: t('6a461a953f924000ad2b'),
          detail: t('16c6149cbe464000ad2c'),
        },
      ],
    },
    1: {
      title: t('a8d3290304354000aff6'),
      desc: [
        {
          summary: t('701fc93413b44000a39d'),
          detail: t('da1df7b8dd4f4800a398'),
        },
        {
          summary: t('78a7d071cbf44800a53c'),
          detail: t('28b0d19317374800aff5'),
        },
        {
          summary: t('6a015be3a4084000ae42'),
          detail: t('ec9dd343ccc54800aad5'),
        },
      ],
    },
    2: {
      title: t('59cf949a90804000a998'),
      desc: [
        {
          summary: t('b3d3c51d1fdf4000ae72'),
          detail: t('56d7c4140fc64000ad63'),
        },
        {
          summary: t('648cbd84207b4000a693'),
          detail: t('e122ba66b7624000af18'),
        },
      ],
    },
  };

  return content[step] || {};
};
