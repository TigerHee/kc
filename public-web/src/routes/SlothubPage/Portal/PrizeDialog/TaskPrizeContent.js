/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-07 11:57:26
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-22 16:16:53
 */
// import { TaskContentWrapper } from 'src/components/Votehub/styledComponents';
import { _t, _tHTML } from 'src/tools/i18n';
import TaskPrizeGrid from './components/TaskPrizeItemGrid';
import { TASK_REWARD_POINT_COMMON_TYPE } from './constant';
import { GainPrizeTitle, TaskContentWrapper } from './styled';

const TaskPrizeContent = ({ prizeData }) => {
  const { totalPoints, pointList, coin } = prizeData;

  const isCommonToken = coin === TASK_REWARD_POINT_COMMON_TYPE;
  return (
    <TaskContentWrapper>
      <GainPrizeTitle>{_t('97d965ca48344000a78f')}</GainPrizeTitle>
      <GainPrizeTitle>
        {isCommonToken
          ? _tHTML('2a7bc849c18a4000abe7', { x: totalPoints })
          : _tHTML('828e028629f14000acac', { x: totalPoints, token: coin })}
      </GainPrizeTitle>

      <TaskPrizeGrid items={pointList} />
    </TaskContentWrapper>
  );
};

export default TaskPrizeContent;
