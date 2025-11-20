/**
 * Owner: harry.lai@kupotech.com
 */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@emotion/css';
import Button from '@mui/Button';
import { _t } from 'utils/lang';
import StarRate from './components/StarRate';
import MultiCheckbox from './components/MultiCheckbox';
import {
  ExperienceOptions,
  OTHER_OPTION_VALUE,
  TOP_AREA_ICON_MAP,
  OTHER_CONTENT_MAX_LENGTH,
} from './constant';
import {
  SurveyWrap,
  TopAreaIconWrap,
  TopAreaIcon,
  CloseIcon,
  Question,
  AnswerWrap,
  Content,
  TextArea,
} from './style';
import FinishDialog from './components/FinishDialog';
import { useVisibleInitialization, useClick } from './hooks';
import { useFocusTextarea } from './hooks/useFocusTextarea';

const rootNode = document.getElementById('root') || document;

const SurveyDefault = ({ onChange, value }) => {
  return (
    <>
      <Question
        className={css`
          font-size: 18px;
          margin-bottom: 22px;
        `}
      >
        {_t('7Sz13KgJ3ZQWcdxs6CCtz2')}
      </Question>
      <StarRate onChange={onChange} value={value} />
    </>
  );
};

/** 满意度调研弹窗 */
const SatisfactionSurvey = () => {
  const [finishDialogVisible, setFinishDialogVisible] = useState(false);
  const { visible, closeSurvey } = useVisibleInitialization();

  const toggleFinishDialog = () => setFinishDialogVisible(!finishDialogVisible);

  const {
    values,
    handleSelectedOptions,
    handleScore,
    handleInputOther,
    handleSubmit,
    handleDirectlyCloseSurvey,
  } = useClick({
    closeSurvey,
    toggleFinishDialog,
  });

  const isDefaultStep = values.score <= 0;
  const isMoreThreeStar = values.score > 3;
  const isSelectedOther = values.selectedOptions.includes(OTHER_OPTION_VALUE);

  const { textareaRef } = useFocusTextarea({ visible: isSelectedOther });

  const isSubmitDisabled = useMemo(
    () => !values.selectedOptions?.length || (isSelectedOther && !values.otherContent),
    [isSelectedOther, values],
  );

  if (!finishDialogVisible && !visible) return null;

  return createPortal(
    <>
      {visible && (
        <SurveyWrap grow={!isDefaultStep}>
          <TopAreaIconWrap>
            <TopAreaIcon
              src={
                isMoreThreeStar || isDefaultStep ? TOP_AREA_ICON_MAP.smile : TOP_AREA_ICON_MAP.cry
              }
            />
          </TopAreaIconWrap>
          <CloseIcon onClick={handleDirectlyCloseSurvey} />

          <Content>
            {isDefaultStep ? (
              <SurveyDefault onChange={handleScore} value={values.score} />
            ) : (
              <>
                <StarRate onChange={handleScore} value={values.score} />
                <Question
                  className={css`
                    margin: 16px 0;
                  `}
                >
                  {_t(isMoreThreeStar ? 'dg1bBYPooSE5x3nhThrtmh' : '5pRrQJFAj1sxryPDxiPLpg')}
                </Question>

                <MultiCheckbox
                  options={ExperienceOptions}
                  onChange={handleSelectedOptions}
                  value={values.selectedOptions}
                />

                {isSelectedOther && (
                  <TextArea
                    ref={textareaRef}
                    maxLength={OTHER_CONTENT_MAX_LENGTH}
                    placeholder={_t('x7L4HvLWwVJh8vsumGXFUk')}
                    value={values.otherContent}
                    onChange={(e) => handleInputOther(e.target?.value)}
                  />
                )}

                <Button
                  className={css`
                    margin-top: 24px;
                  `}
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                >
                  {_t('g9fJM29afT7uFDk1N4GKAr')}
                </Button>
              </>
            )}
          </Content>
        </SurveyWrap>
      )}
      <FinishDialog visible={finishDialogVisible} onClose={toggleFinishDialog} />
    </>,
    rootNode,
  );
};

export default SatisfactionSurvey;
