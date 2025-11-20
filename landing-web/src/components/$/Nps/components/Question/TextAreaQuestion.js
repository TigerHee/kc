/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import NpsTextArea from './NpsTextArea';
import fp from 'lodash/fp';
import useQuestion from '../..//hooks/useQuestion';
import style from './style.less';

const TextAreaQuestion = () => {
  const { surveyinfo, curIndex } = useQuestion();
  const dispatch = useDispatch();
  const question = surveyinfo?.questions?.[curIndex];

  return (
    <div className={style.container}>
      <NpsTextArea
        value={question.optionContent || ''}
        onChange={(v) => {
          dispatch({
            type: 'nps/update',
            payload: {
              surveyinfo: fp.set(`questions[${curIndex}].optionContent`, v, surveyinfo),
            },
          });
        }}
      />
    </div>
  );
};

export default React.memo(TextAreaQuestion);
