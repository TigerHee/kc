/**
 * Owner: tiger@kupotech.com
 */
/**
 * isShowBack 是否在弹窗展示返回按钮
 * isShowBorderTop 弹窗footer是否需要border
 */

export const getPageData = ({ pageCode, _t }) => {
  const config = {
    page_41: {
      section: _t('b1f2739eb29b4800a245', { numerator: 1, denominator: 2 }),
      title: _t('1f7a6f89951a4800a981'),
      total: _t('ea0c453782d44000aaae', { num: 10 }),
      list: [_t('30596ac00eb64800a54c', { num: 8 }), _t('2bc441c26a684800a181')],
      primaryBtnText: _t('0580ee9e2f1e4800a0d9'),
    },
    page_43: {
      section: _t('b1f2739eb29b4800a245', { numerator: 2, denominator: 2 }),
      title: _t('6dc6d9c0ae964000a435'),
      total: _t('ea0c453782d44000aaae', { num: 19 }),
      list: [_t('3405fa3e16e04800ac76'), _t('0f77ab8a2ec94800af9f')],
      primaryBtnText: _t('0580ee9e2f1e4800a0d9'),
      // isShowBack: true,
    },
    page_80: {
      section: null,
      title: _t('b9d7189bd28c4000a84d'),
      total: _t('ea0c453782d44000aaae', { num: 16 }),
      list: [_t('a09dfb7fd3694000a6e1')],
      primaryBtnText: _t('0580ee9e2f1e4800a0d9'),
    },
  };

  return config[pageCode] || {};
};
