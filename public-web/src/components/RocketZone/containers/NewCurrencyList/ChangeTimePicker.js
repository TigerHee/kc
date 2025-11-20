/**
 * Owner: jessie@kupotech.com
 */
import { styled } from '@kux/mui';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';

// 对应后端接口字段
const CANDLE_MAP = {
  changeRate1h: '1hour',
  changeRate4h: '4hour',
  changeRate24h: '1day',
};

const TIME_LIST = [
  {
    title: _t('24h', { num: 1 }),
    value: 'changeRate1h',
  },
  {
    title: _t('24h', { num: 4 }),
    value: 'changeRate4h',
  },
  {
    title: _t('24h', { num: 24 }),
    value: 'changeRate24h',
  },
];

const TimeLayer = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  .all_change_list {
    display: flex;
    float: left;
    li {
      margin-right: 4px;
    }
    .all_change_active {
      color: #00c27c;
    }
  }

  .all_change_letter_new {
    float: left;
  }
`;
const ChangeTimePicker = (props) => {
  const {
    activeRate,
    isFuture,
    setSorter,
    nameSpace,
    sorter,
    times = ['1hour', '4hour', '1day'],
  } = props;
  const dispatch = useDispatch();
  return (
    <TimeLayer>
      <ul className="all_change_list">
        {TIME_LIST.map((item, index) =>
          times.includes(CANDLE_MAP[item.value]) ? (
            <li
              tabIndex="-1"
              role="button"
              className={activeRate === index ? 'all_change_active' : ''}
              onClick={(e) => {
                e.stopPropagation();
                // 切换1 4 24 清除此前排序  不发送接口重新请求
                dispatch({
                  type: `${nameSpace}/updateSorter`,
                  payload: null,
                  override: true,
                });
                if (setSorter) {
                  setSorter({
                    field: sorter?.field,
                    order: null,
                  });
                }
                dispatch({
                  type: `${nameSpace}/updateActiveRate`,
                  payload: {
                    activeRate: index,
                  },
                });
              }}
              key={index}
            >
              {item.title}
            </li>
          ) : null,
        )}
      </ul>
      <div className="all_change_letter_new">{_t('7fBjKjvMKrxnbJxAyXJudy')}</div>
    </TimeLayer>
  );
};

export default ChangeTimePicker;
