/**
 * Owner: tiger@kupotech.com
 */

/**
 * isShowBack 是否在弹窗展示返回按钮
 * isShowBorderTop 弹窗footer是否需要border
 * secondaryBtnText 次要按钮相关
 */

export const getPageData = ({ pageCode, _t, termParams }) => {
  const config = {
    page_55: {
      title: _t('d1a794607b564800ac48'),
      subTitle: _t('f644737872534000a62b'),
      descList: [_t('43d9cd8892254000a92d'), _t('db53ec6072774800a74d'), _t('cd616dc2393c4800a29c')],
      agreeList: [
        {
          label: _t('2bd37e1f5f8e4800aa33', { link: `/support/${termParams?.[0]?.termId}` }),
          key: '1',
        },
        {
          label: _t('EU_biometric_consent', { link: `/support/${termParams?.[1]?.termId}` }),
          key: '2',
        },
      ],
    },
  };

  return config[pageCode] || {};
};
