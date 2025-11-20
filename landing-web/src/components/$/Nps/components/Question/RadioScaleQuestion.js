/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useState, Fragment, useMemo, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'dva';
import classnames from 'classnames';
import fp from 'lodash/fp';
import useQuestion from '../..//hooks/useQuestion';
import style from './style.less';

const RadioScaleQuestion = ({ content }) => {
  const { surveyinfo, curIndex } = useQuestion();
  const dispatch = useDispatch();
  const question = surveyinfo?.questions?.[curIndex];
  const options = question?.options || [];
  const firstSelectedIdx = options.findIndex((e) => e.selected);
  const left = options?.[0]?.optionName || '--';
  const right = options?.[options?.length - 1]?.optionName || '--';

  return (
    <div className={style.radioScaleQuestion}>
      <div className={style.topDesc}>
        <div className={style.left}>{left}</div>
        <div className={style.right}>{right}</div>
      </div>
      <div className={style.boxes}>
        {options.map((op, idx) => {
          const active = firstSelectedIdx >= 0 && idx <= firstSelectedIdx;

          return (
            <div
              role="button"
              tabIndex={0}
              key={idx}
              className={classnames(style.box, { [style.active]: active })}
              onClick={() => {
                const newOptions = options.map((o, i) => ({
                  ...o,
                  selected: idx === i,
                }));

                dispatch({
                  type: 'nps/update',
                  payload: {
                    surveyinfo: fp.set(`questions[${curIndex}].options`, newOptions, surveyinfo),
                  },
                });
              }}
            >
              {idx || 0}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(RadioScaleQuestion);
