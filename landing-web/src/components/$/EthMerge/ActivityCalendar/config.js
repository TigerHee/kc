/**
 * Owner: jesse.shao@kupotech.com
 */
import moment from 'moment';
import { _t, _tHTML } from 'src/utils/lang';

const currency = 'USDC';
// 活动数据
export const ActivityWeeks = [
  {
    startTime: '2022-09-05',
    endTime: '2022-09-11',
    title: `${_t('ucrUvib4mvLEBzKhMHBqXT')}`,
    blockid: 'Announcement',
    prize: `50,000 ${currency}`,
    getH5Url: host => `${host}/announcement/en-usdc-carnival-week-1-learn-earn-share-50000-usdc`,
    getPcUrl: host => `${host}/announcement/en-usdc-carnival-week-1-learn-earn-share-50000-usdc`,
    getAppUrl: host => `${host}/announcement/en-usdc-carnival-week-1-learn-earn-share-50000-usdc`,
    activities: [
      {
        content: _t('k42QQLzVfFnJrQwgmYJSTK'),
      },
      {
        content: _t('gwaoT3TD12UzDXfqB7Z8vX'),
      },
    ],
  },
  {
    startTime: '2022-09-12',
    endTime: '2022-09-18',
    title: `${_t('kwo1JaTLUWAP8tF1esS39c')}`,
    blockid: 'Announcement',
    prize: `100,000 ${currency}`,
    getH5Url: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getPcUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getAppUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    activities: [
      {
        content: _t('r3CTU7FeEvPkPpfKuXPXB7'),
      },
      {
        content: _t('5ZS5DDDqKDeQjUrVs5Trbi'),
      },
      {
        content: _t('dVR1CcU2NRMSVoQ3kJKPUp'),
      },
    ],
  },
  {
    startTime: '2022-09-19',
    endTime: '2022-09-25',
    title: `${_t('fVE4SMNLuYYvPzHEnkkPbT')}`,
    blockid: 'Announcement',
    prize: `30,000 ${currency}`,
    getH5Url: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getPcUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getAppUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    activities: [
      {
        content: _t('tPhFt13nYxadwS7Yhf9rwX'),
        des: _t('7b2r6mtzaWGSQdnLUChjaA'),
      },
    ],
  },
  {
    startTime: '2022-09-23',
    endTime: '2022-09-27',
    title: `${_t('pCW4xq8ngrebZykLx5W5FQ')}`,
    blockid: 'Announcement',
    prize: `70,000 ${currency}`,
    getH5Url: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getPcUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    getAppUrl: host => `${host}/announcement/en-usdc-autumn-carnival-campaign-is-waiting-for-you-to-join-and-share-250000-usdc`,
    activities: [
      {
        content: _tHTML('fPomscyAFAm93SD8y8uzdG'),
      },
    ],
  },
];

/**
 * 获取月份文案
 * @param {*} data
 * @returns
 */
export const getMonthText = data => {
  const { startTime, endTime } = data;
  return `${moment(startTime).format('MMM')}. ${moment(startTime).format('DD')}~${moment(endTime).format('DD')}`;
};
