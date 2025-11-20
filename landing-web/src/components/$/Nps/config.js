/**
 * Owner: jesse.shao@kupotech.com
 */
/**
 * 去除文本回车符
 */
import { _t } from 'utils/lang';

export const getText = (key, contents, toArray = false) => {
  if (!key || !contents || !contents[key]) {
    return toArray ? [] : '';
  }
  if (toArray) {
    return contents[key].split('\n');
  }
  return contents[key].replace(/\n/g, '');
};

export const IMG_WIDTH = {
  '100%': '200%',
  '200%': '100%',
};

// 0 => A
export const numToLetter = (i) => {
  return String.fromCharCode(i + 65);
};

export const FORM_ITEM_TYPE_MAP_LIST = [
  {
    type: 'radio',
    number: 1,
    // LANG: '（单选题）',
    // LANG: _t('upn6Z9y9v8Sb7SfwNhf9aq'),
  },
  {
    type: 'checkbox',
    number: 2,
    LANG: _t('aNz43xtx8dNJJjtaJBKyfH'),
  },
  {
    type: 'textarea',
    number: 3,
    // LANG: '（开放式问答题）',
  },
  {
    type: 'radioScale',
    number: 4,
    // LANG: '（单选量表题）',
  },
];

export const getDataForBackend = (formDatas) => {
  const answers = formDatas.questions.map((q) => {
    const el = {
      questionId: q.questionId,
      // questionType: q.type,
      type: q.type,
    };

    if (q?.options?.length) {
      el.options = q.options.map((o) => ({
        sort: o.sort,
        selected: o.selected || false,
        content: o.content,
      }));
    }
    if (q.optionContent) {
      el.optionContent = q.optionContent;
    }
    return el;
  });

  return answers;
};

export const isPreviewFn = () => window.location.href.includes('preview=true');
