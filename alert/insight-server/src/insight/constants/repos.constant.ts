const isDev = process.env.NODE_ENV === 'development';
export const REPOS_GROUP_OPTION_DATA = isDev
  ? [
      {
        label: 'finance-web',
        value: 'FINW',
      },
      {
        label: 'kucoin-pay',
        value: 'PAYW',
      },
      {
        label: 'kucoin-web-2.0',
        value: 'KUC',
      },
      {
        label: 'kucoin-web-3.0',
        value: 'KUC3',
      },
      {
        label: 'kufox-deps',
        value: 'KUFD',
      },
      {
        label: 'trade-group',
        value: 'TRG',
      },
      {
        label: 'futures-web',
        value: 'KUWE',
      },
      {
        label: 'kufox-tools',
        value: 'KUFT',
      },
      {
        label: 'for-test',
        value: 'KUCW',
      },
    ]
  : [
      {
        label: 'finance-web',
        value: 'FINW',
      },
      {
        label: 'kucoin-pay',
        value: 'PAYW',
      },
      {
        label: 'kucoin-web-2.0',
        value: 'KUC',
      },
      {
        label: 'kucoin-web-3.0',
        value: 'KUC3',
      },
      {
        label: 'kufox-deps',
        value: 'KUFD',
      },
      {
        label: 'trade-group',
        value: 'TRG',
      },
      {
        label: 'futures-web',
        value: 'KUWE',
      },
      {
        label: 'kufox-tools',
        value: 'KUFT',
      },
    ];
