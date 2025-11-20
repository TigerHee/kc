/**
 * Owner: tiger@kupotech.com
 */

/**
 * isShowBack 是否在弹窗展示返回按钮
 * isShowBorderTop 弹窗footer是否需要border
 * secondaryBtnText 次要按钮相关
 */

const getLink = (termParams, index) => {
  return `/support/${termParams?.[index]?.termId}`;
};

export const getPageData = ({ pageCode, _t, termParams }) => {
  const config = {
    // 基础kyc
    page_39: {
      title: _t('c0d4fb9c3d134000a612'),
      descList: [_t('au_kyc_agreement_body', { link: getLink(termParams, 0) })],
      agreeList: [
        {
          label: _t('au_kyc_agreement_checkbox_1', { link: getLink(termParams, 1) }),
          key: '1',
        },
        {
          label: _t('au_kyc_agreement_checkbox_2', { link: getLink(termParams, 2) }),
          key: '2',
        },
        {
          label: _t('au_kyc_agreement_checkbox_3'),
          key: '3',
        },
      ],
    },
    // retail
    page_40: {
      title: _t('e472fb6e53004000a354'),
      descList: [
        _t('72a02b13a2b14800aeb6'),
        _t('14e8def41b784800aa5c', { link: getLink(termParams, 3) }),
        _t('1aee3c59a4dc4000a06b'),
      ],
      agreeDesc: _t('656227c07b9e4000a122'),
      agreeList: [
        {
          label: _t('f954f529e46e4000afa2', { link: getLink(termParams, 0) }),
          key: '1',
        },
        {
          label: _t('6cc9055364914000a9ee', { link: getLink(termParams, 1) }),
          key: '2',
        },
        {
          label: _t('0999a86512094000aa65', { link: getLink(termParams, 2) }),
          key: '3',
        },
        {
          label: _t('ef7a388d79954800abb2', { link: getLink(termParams, 4) }),
          key: '4',
        },
      ],
    },
    // wholesale
    page_45: {
      title: _t('e472fb6e53004000a354'),
      descList: [_t('72a02b13a2b14800aeb6'), _t('5368e2105eeb4800ae02'), _t('1aee3c59a4dc4000a06b')],
      agreeDesc: _t('656227c07b9e4000a122'),
      agreeList: [
        {
          label: _t('6d8b72129c4b4800ad08', {
            link: getLink(termParams, 1),
            link2: getLink(termParams, 2),
          }),
          key: '1',
        },
        {
          label: _t('e7f0347c57184000a432', { link: getLink(termParams, 0) }),
          key: '2',
        },
      ],
    },
  };

  config['page_108'] = config.page_39;
  config['page_109'] = config.page_40;
  config['page_110'] = config.page_45;

  return config[pageCode] || {};
};
