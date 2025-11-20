import { useMemo } from 'react';
import { cloneDeep } from 'lodash-es';
import CommonSelect from 'kycCompliance/components/FormPage/CommonSelect';
import { getSelectOptions } from './config';
import { MutiQuestionWrapper } from './style';

export default ({ value, onChange, curQuestion }) => {
  const { showSubOptions = [], subOptionTitle, subOptionDesc, subOptions = [] } = curQuestion;

  const value0 = value[0];
  const value1 = value[1];
  const isShowSub = useMemo(() => {
    return showSubOptions.includes(value0);
  }, [showSubOptions, value0]);

  const subSubItem = subOptions.find(i => i.optionId === value1) || {};

  return (
    <MutiQuestionWrapper>
      <CommonSelect
        value={value0}
        onChange={v => {
          let newVal = cloneDeep(value);
          if (showSubOptions.includes(v)) {
            newVal[0] = v;
            newVal[1] = '';
          } else {
            newVal = [v];
          }
          onChange(newVal);
        }}
        options={getSelectOptions(curQuestion.options || [])}
        placeholder={curQuestion.title}
      />
      {isShowSub && (
        <>
          <div className="subTitle">{subOptionTitle}</div>
          <CommonSelect
            value={value1}
            onChange={v => {
              const newVal = cloneDeep(value);
              newVal[1] = v;
              newVal[2] = '';
              onChange(newVal);
            }}
            options={getSelectOptions(subOptions)}
            label={subOptionDesc}
            placeholder=""
          />
          {subSubItem.subOptions ? (
            <>
              <div className="divider"></div>
              <CommonSelect
                value={value[2]}
                onChange={v => {
                  const newVal = cloneDeep(value);
                  newVal[2] = v;
                  onChange(newVal);
                }}
                options={getSelectOptions(subSubItem.subOptions || [])}
                label={subSubItem.subOptionDesc}
                placeholder=""
              />
            </>
          ) : null}
        </>
      )}
    </MutiQuestionWrapper>
  );
};
