/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { sensors } from 'utils/sensors';

import { useScheduleContext } from '../context';

import NotStartCard from './NotStartCard';
import EndCard from './EndCard';
import ProcessingCard from './ProcessingCard';

import { SlideContentIndex } from './StyledComps';

// --- 样式 end ---
const SlideContent = ({
  onShowTipDialog,
  onNotStartCountDownFinish,
  onProcessCountDownFinish,
  data,
}) => {
  const { btnClickCheck, isSign } = useScheduleContext();
  const { notStart, inProcessing, id } = data;
  const { push } = useHistory();
  const showWinnerList = useCallback(
    () => {
      // 埋点
      sensors.trackClick(['AllList', '1']);
      push(`/prediction/winner-list?id=${id}`)
    },
    [push, id],
  );
  const renderContent = useMemo(
    () => {
      // 未开始
      if (notStart) {
        return (
          <NotStartCard
            onShowTipDialog={onShowTipDialog}
            onCountDownFinish={onNotStartCountDownFinish}
            round={data}
          />
        );
      }
      // 进行中
      if (inProcessing) {
        return (
          <ProcessingCard
            round={data}
            btnClickCheck={btnClickCheck}
            onShowTipDialog={onShowTipDialog}
            onCountDownFinish={onProcessCountDownFinish}
            isSign={isSign}
          />
        );
      }
      return (
        <EndCard
          round={{ ...data, hasResult: data?.lottery }}
          onShowTipDialog={onShowTipDialog}
          onShowWinner={showWinnerList}
        />
      );
    },
    [
      data,
      inProcessing,
      notStart,
      onShowTipDialog,
      btnClickCheck,
      onProcessCountDownFinish,
      onNotStartCountDownFinish,
      isSign,
      showWinnerList,
    ],
  );
  return (
    <SlideContentIndex>
      <Fragment>{renderContent}</Fragment>
    </SlideContentIndex>
  );
};

SlideContent.propTypes = {
  data: PropTypes.object, // 展示数据
  onShowTipDialog: PropTypes.func.isRequired, // 点击tip回调
  onNotStartCountDownFinish: PropTypes.func.isRequired, // 未开始卡片倒计时结束后回调
  onProcessCountDownFinish: PropTypes.func.isRequired, // 进行中卡片倒计时结束后回调
};

SlideContent.defaultProps = {
  data: {},
  onShowTipDialog: () => {},
  onNotStartCountDownFinish: () => {},
  onProcessCountDownFinish: () => {},
};

export default SlideContent;
