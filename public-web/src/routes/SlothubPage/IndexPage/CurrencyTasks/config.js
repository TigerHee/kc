/*
 * @owner: borden@kupotech.com
 */
import loadable from '@loadable/component';
import { _t } from 'src/tools/i18n';
import { list2map } from '../../utils';

const Ended = loadable(() => import('./List/Ended'));
const Running = loadable(() => import('./List/Running'));
const NotLaunched = loadable(() => import('./List/NotLaunched'));

export const LIST_TYPES = [
  {
    value: 'RUNNING',
    label: (v) => _t('86b1ceb7b2e04000af63', { a: v?.ongoingCount || 0 }),
    component: (props) => <Running {...props} />,
  },
  {
    value: 'NOT_LAUNCHED',
    label: (v) => _t('abcde0a74df74000a329', { a: v?.upcomingCount || 0 }),
    component: (props) => <NotLaunched {...props} />,
  },
  {
    value: 'ENDED',
    label: (v) => _t('7275a41f17b44000a952', { a: v?.completedCount || 0 }),
    showFilter: true,
    component: (props) => <Ended {...props} />,
  },
];
export const LIST_TYPES_MAP = list2map(LIST_TYPES);
