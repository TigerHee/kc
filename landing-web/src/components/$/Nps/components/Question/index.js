/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, Fragment, useMemo, useRef, useEffect } from 'react';
import useQuestion from '../../hooks/useQuestion';

import CheckboxQuestion from './CheckboxQuestion';
import RadioQuestion from './RadioQuestion';
import RadioScaleQuestion from './RadioScaleQuestion';
import TextAreaQuestion from './TextAreaQuestion';

import style from './style.less';

// 1单选、2多选、3开放式问答、4单选量表、5矩阵量表
const QuestionMapping = {
  1: RadioQuestion,
  2: CheckboxQuestion,
  3: TextAreaQuestion,
  4: RadioScaleQuestion,
};

const Question = ({ content }) => {
  const { surveyinfo, typeTextView, question, curNum } = useQuestion();
  const Com = QuestionMapping[question?.type];

  if (!Com) {
    return null;
  }

  return (
    <div className={style.container}>
      <div className={style.title}>
        {/* {curNum}.{question?.title || '--'} {typeTextView} questionId:{question.questionId} */}
        {curNum}.{question?.title || '--'} {typeTextView ? `(${typeTextView})` : ''}
      </div>
      <Com />
    </div>
  );
};

export default React.memo(Question);
