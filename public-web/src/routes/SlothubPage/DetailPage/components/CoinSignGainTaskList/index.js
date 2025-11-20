/*
 * @Date: 2024-05-29 15:08:51
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import numberFormat from '@kux/mui/utils/numberFormat';
import { memo, useMemo } from 'react';
import Html from 'src/components/common/Html';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { useStore } from '../../store';
import { EnrollCheckDialog } from './components/EnrollCheckDialog';
import { TASK_CATEGORY, TITLE_TYPE } from './constant';
import { useMakeTaskInfoList } from './hooks/useMakeTaskInfoList';
import { RightIcon, TaskDesc, TaskItem, TaskTitle, Title, Wrap } from './styled';

// 任务标题
const TitleRender = memo(({ info, children }) => {
  const { currentLang } = useLocale();
  const { titleParams, titleType, payCurrency, payNum, gainCurrency, gainNum, taskCategory } =
    info || {};
  const title = titleParams?.[currentLang] || titleParams?.en_US;

  if (titleType === TITLE_TYPE.template) {
    return (
      <Html>
        {_t(taskCategory === TASK_CATEGORY.cash ? '3ee5bb1349d74000afc0' : '0cc795ff4c8d4000a4cb', {
          num1: numberFormat({
            number: payNum || 0,
            lang: currentLang,
          }),
          token1: payCurrency,
          num2: numberFormat({
            number: gainNum || 0,
            lang: currentLang,
          }),
          token2: gainCurrency,
        })}
      </Html>
    );
  }

  if (title) return <Html>{title}</Html>;
  if (children) return children;
  return null;
});

const CoinSignGainTaskList = () => {
  const taskList = useMakeTaskInfoList();
  const { state } = useStore();
  const { currency } = state.projectDetail || {};
  const categories = useSelector((state) => state.categories);

  const { currencyName = '' } = categories[currency] || {};

  return useMemo(
    () => (
      <>
        <Wrap>
          <Title>{_t('f7559a3356dd4000a734')}</Title>
          {taskList.map((taskInfo, idx) => {
            const { taskName, desc, bgIcon, info, processComponent: ProcessComp } = taskInfo;
            return (
              <TaskItem key={idx}>
                <TaskTitle>{taskName?.()}</TaskTitle>

                <TaskDesc>
                  <TitleRender info={info}>{desc?.()}</TitleRender>
                </TaskDesc>
                <ProcessComp info={info} currencyName={currencyName} />
                <RightIcon className="horizontal-flip-in-arabic" src={bgIcon} />
              </TaskItem>
            );
          })}
        </Wrap>
        <EnrollCheckDialog />
      </>
    ),
    [currencyName, taskList],
  );
};

export default memo(CoinSignGainTaskList);
