/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector, useDispatch } from 'dva';
import NpsTextArea from './NpsTextArea';
import { numToLetter } from 'components/$/Nps/config';
import { ReactComponent as NopeSvg } from 'src/assets/nps/nope.svg';
import { ReactComponent as RadioSvg } from 'src/assets/nps/checkbox.svg';
import classnames from 'classnames';
import fp from 'lodash/fp';
import useQuestion from '../..//hooks/useQuestion';
import style from './style.less';

const RadioQuestion = () => {
  const { surveyinfo, curIndex } = useQuestion();
  const dispatch = useDispatch();
  const question = surveyinfo?.questions?.[curIndex];
  const options = question?.options || [];

  return (
    <div className={style.container}>
      {options.map((op, idx) => {
        return (
          <div key={idx} className={classnames(style.optionWrap, { [style.active]: op.selected })}>
            <div
              role="button"
              tabIndex={0}
              className={style.option}
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
              <div className={style.optPrefix}>{numToLetter(idx)}</div>
              <div className={style.optDesc}>{op.optionName}</div>
              {op.selected ? <RadioSvg /> : <NopeSvg />}
            </div>
            {!!op.followTextInput && (
              <NpsTextArea
                value={op.content}
                onChange={(v) => {
                  dispatch({
                    type: 'nps/update',
                    payload: {
                      surveyinfo: fp.set(
                        `questions[${curIndex}].options[${idx}].content`,
                        v,
                        surveyinfo,
                      ),
                    },
                  });
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(RadioQuestion);
