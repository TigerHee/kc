/**
 * Owner: tiger@kupotech.com
 */

export const getPageData = ({ pageCode, _t }) => {
  const config = {
    page_81: {
      pageTitle: _t('0079f0ecffd34000ad12'),
      content: [_t('e5be0b41d4744000a408'), _t('cb6def31c9024000a822')],
      bottomTitle: _t('705b77093f714800a14e'),
      bottomDescList: [
        _t('994fef6a3c5d4800a281'),
        _t('8c6fce1d49744800aef6'),
        _t('7c49ac03af784800a507'),
      ],
      disagreeText: _t('44cbd4f196834000a50d'),
    },
    page_83: {
      pageTitle: _t('cfaa8aa5830d4800a9f1'),
      content: [_t('8ed6520e9fae4800a8cf'), _t('a766d08e4ae14000addb')],
      bottomTitle: _t('705b77093f714800a14e'),
      bottomDescList: [
        _t('74c2cbcfa0b44800ac15'),
        _t('733870c952a24000a69e'),
        _t('642de07d7c6b4000a91b'),
      ],
      disagreeText: _t('44cbd4f196834000a50d'),
    },
  };

  return config[pageCode] || {};
};
