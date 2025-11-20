/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector, useDispatch } from 'dva';
import { last, initial } from 'lodash';
import { FORM_ITEM_TYPE_MAP_LIST } from './../config';

const useQuestion = () => {
  const { currentLang } = useSelector((state) => state.app);
  const { surveyinfo, curNum, linkedList } = useSelector((state) => state.nps);
  const curIndex = last(linkedList) || 0;
  const question = surveyinfo?.questions?.[curIndex];
  const options = question?.options || [];
  const firstSelectedIdx = options.findIndex((e) => e.selected);
  const percent = ((curIndex + 1) / surveyinfo?.questions?.length) * 100;
  const typeTextView = FORM_ITEM_TYPE_MAP_LIST.find((e) => e.number === question?.type)?.LANG;
  const dispatch = useDispatch();
  const nextQuestionOpt = options.find((o) => o.selected && typeof o.nextQuestion === 'number');
  const nextQuestionIdx = nextQuestionOpt?.nextQuestion || curIndex + 1;

  const goPre = () => {
    const initialLinkedList = initial(linkedList);

    dispatch({
      type: 'nps/update',
      payload: {
        curNum: curNum - 1,
        linkedList: initialLinkedList,
      },
    });
  };

  const goNext = () => {
    // 跳转题关系
    // 无跳转题关系，直接进入下一题目
    dispatch({
      type: 'nps/update',
      payload: {
        curNum: curNum + 1,
        linkedList: [...linkedList, nextQuestionIdx],
      },
    });
  };

  const setEN_USLangWhenNoMatch = (data) => {
    if (data?.languages?.includes?.(currentLang)) {
      return;
    }
    dispatch({ type: 'app/selectLang', payload: { lang: 'en_US' } });
  };

  const noSelect = firstSelectedIdx < 0;
  const disabledNextBtn =
    (question?.type !== 3 && noSelect) || (question?.type === 3 && !question?.optionContent);
  return {
    surveyinfo,
    curIndex,
    question,
    options,
    firstSelectedIdx,
    noSelect,
    disabledNextBtn,
    curNum,
    percent,
    goPre,
    typeTextView,
    goNext,
    setEN_USLangWhenNoMatch,
  };
};

export default useQuestion;
