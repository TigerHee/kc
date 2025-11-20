/**
 * Owner: willen@kupotech.com
 */
import siteConfig from 'utils/siteConfig';
import { _t, _tHTML } from 'tools/i18n';

const { KUCOIN_HOST } = siteConfig;

export const TOC_TOB_LINK = {
  rf: `${KUCOIN_HOST}/referral`,
  af: `${KUCOIN_HOST}/affiliate`,
};

export const REWARDS_ITEMS = [
  {
    text: _t('creator.third.li1'),
  },
  {
    text: _t('creator.third.li2'),
  },
  // {
  //   text: _t('creator.third.li3'),
  // },
];

export const FAQS = [
  {
    question: _t('creator.seventh.item1.title'),
    answer: _t('creator.seventh.item1.sub'),
  },
  {
    question: _t('creator.seventh.item2.title'),
    answer: _t('creator.seventh.item2.sub'),
  },
  {
    question: _t('creator.seventh.item3.title'),
    answer: _tHTML('creator.seventh.item3.sub'),
    answerText: _t('creator.seventh.item3.sub'),
  },
  {
    question: _t('creator.seventh.item4.title'),
    answer: _t('creator.seventh.item4.sub'),
  },
  {
    question: _t('creator.seventh.item5.title'),
    answer: _t('creator.seventh.item5.sub'),
  },
];

export const TERMS_CONDITIONS = [
  {
    question: _t('creator.ninth.item1.title'),
    answer: _t('creator.ninth.item1.sub'),
  },
  {
    question: _t('creator.ninth.item2.title'),
    answer: _t('creator.ninth.item2.sub'),
  },
  {
    question: _t('creator.ninth.item3.title'),
    answer: _t('creator.ninth.item3.sub'),
  },
  {
    question: _t('creator.ninth.item4.title'),
    answer: _t('creator.ninth.item4.sub'),
  },
  {
    question: _t('creator.ninth.item5.title'),
    answer: _t('creator.ninth.item5.sub'),
  },
  {
    question: _t('creator.ninth.item6.title'),
    answer: _t('creator.ninth.item6.sub'),
  },
];

export const STEPS = [
  {
    title: _t('creator.fifth.step1.title'),
    describe: [_t('creator.fifth.step1.sub')],
  },
  {
    title: _t('creator.fifth.step2.title'),
    describe: [_t('creator.fifth.step2.sub1'), _tHTML('creator.fifth.step2.sub2')],
  },
  {
    title: _t('creator.fifth.step3.title'),
    describe: [_t('creator.fifth.step3.sub')],
  },
  {
    title: _t('creator.fifth.step4.title'),
    describe: [_t('creator.fifth.step4.sub1'), _t('creator.fifth.step4.sub2')],
  },
  {
    title: _t('creator.fifth.step5.title'),
    describe: [
      _t('creator.fifth.step5.sub1'),
      _t('creator.fifth.step5.sub2'),
      _t('creator.fifth.step5.sub3'),
    ],
  },
];

export const TEXT_WIDTH = {
  es_ES: '50%',
  ko_KR: '50%',
  ja_JP: '50%',
  nl_NL: '50%',
  tr_TR: '50%',
  fil_PH: '50%',
  pl_PL: '50%',
};
