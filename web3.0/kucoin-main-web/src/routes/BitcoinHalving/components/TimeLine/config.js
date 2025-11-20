/**
 * Owner: ella@kupotech.com
 */
import { _t } from 'tools/i18n';
import { DateTimeFormat } from 'utils/seoTools';

export const FirstHalving = {
  title: _t('sJGVSv3nsy8NtzreAUC4Hz'),
  date: (lang) => {
    return DateTimeFormat({ lang: lang, date: '2012-11-28', options: { dateStyle: 'medium' } });
  },
  list: [
    {
      info: `${_t('vEKqXiLA18LazfETZXiagd')}:`,
      content: _t('t1DmNZhwv31HK8kjfpXk5u', { data: 50, count: 25 }),
    },
    {
      info: `${_t('3XbEqn8LBg5AzwTo2PMpx6')}:`,
      content: 210000,
      needFormat: true,
    },
    {
      info: `${_t('fJphzCgJyYjCQZpBmQP3u2')}:`,
      content: 12.35,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('cPamiqcY7EP8DZdAgvWYh2')}:`,
      content: 1175,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('rMhbP1oVE2GS3Cyc5T3Ptp')}:`,
      content: 95.52,
      needFormat: true,
      percent: true,
    },
  ],
};

export const SecondHalving = {
  title: _t('vCeDKBEnJd3Y5e29Y37cFc'),
  date: (lang) => {
    return DateTimeFormat({ lang: lang, date: '2016-07-09', options: { dateStyle: 'medium' } });
  },
  list: [
    {
      info: `${_t('vEKqXiLA18LazfETZXiagd')}:`,
      content: _t('t1DmNZhwv31HK8kjfpXk5u', { data: 25, count: 12.5 }),
    },
    {
      info: `${_t('3XbEqn8LBg5AzwTo2PMpx6')}:`,
      content: 420000,
      needFormat: true,
    },
    {
      info: `${_t('fJphzCgJyYjCQZpBmQP3u2')}:`,
      content: 650.93,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('cPamiqcY7EP8DZdAgvWYh2')}:`,
      content: 19716.7,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('rMhbP1oVE2GS3Cyc5T3Ptp')}:`,
      content: 29.29,
      needFormat: true,
      percent: true,
    },
  ],
};

export const ThirdHalving = {
  title: _t('qaEEzXXxPi1kSguvpkpUiU'),
  date: (lang) => {
    return DateTimeFormat({ lang: lang, date: '2020-05-11', options: { dateStyle: 'medium' } });
  },
  list: [
    {
      info: `${_t('vEKqXiLA18LazfETZXiagd')}:`,
      content: _t('t1DmNZhwv31HK8kjfpXk5u', { data: 12.5, count: 6.25 }),
    },
    {
      info: `${_t('3XbEqn8LBg5AzwTo2PMpx6')}:`,
      content: 630000,
      needFormat: true,
    },
    {
      info: `${_t('fJphzCgJyYjCQZpBmQP3u2')}:`,
      content: 8618.48,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('cPamiqcY7EP8DZdAgvWYh2')}:`,
      content: 69045,
      needFormat: true,
      preUnit: '$',
    },
    {
      info: `${_t('rMhbP1oVE2GS3Cyc5T3Ptp')}:`,
      content: 6.79,
      needFormat: true,
      percent: true,
    },
  ],
};

export const FourthHalving = {
  title: _t('4ZbkV8M7T4iuheoCo5catv'),
  date: (lang) => {
    return DateTimeFormat({
      lang: lang,
      date: '2024-04',
      options: { year: 'numeric', month: 'short' },
    });
  },
  list: [
    {
      info: `${_t('vEKqXiLA18LazfETZXiagd')}:`,
      content: _t('t1DmNZhwv31HK8kjfpXk5u', { data: 6.25, count: 3.125 }),
    },
    {
      info: `${_t('3XbEqn8LBg5AzwTo2PMpx6')}:`,
      content: 840000,
      needFormat: true,
    },
  ],
};
