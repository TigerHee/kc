/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { LineProgress, Button, ThemeProvider } from '@kufox/mui';
import { _t } from 'utils/lang';
import { useSelector, useDispatch } from 'dva';
import JsBridge from 'utils/jsBridge';
// import useSnackbar from '@kufox/mui/hooks/useSnackbar';
import Toast from 'components/Toast';
import classnames from 'classnames';
import { searchToJson } from 'helper';
import NormalHeader from '../components/NormalHeader';
import Question from '../components/Question';
import ShowModals from '../components/ShowModals';
import useQuestion from '../hooks/useQuestion';
import { getDataForBackend, isPreviewFn } from '../config';

import style from './style.less';

const searchQuery = searchToJson();
const isPreview = isPreviewFn();

const Online = ({ pathId }) => {
  const isInApp = JsBridge.isApp();
  const { surveyinfo, curIndex, percent, disabledNextBtn, goNext, goPre } = useQuestion();
  const loading = useSelector((state) => state.loading.effects['nps/surveysubmit']);
  const dispatch = useDispatch();
  // const { message } = useSnackbar();

  const goSubmit = async () => {
    if (isPreview) {
      Toast({
        type: 'error',
        msg: _t('you are in preview mode, can not submit'),
        theme: 'light',
      });
      // message.error('you are in preview mode, can not submit');
      return;
    }
    const answers = getDataForBackend(surveyinfo);
    // surveysubmit
    const submittype = 'nps/surveysubmit';
    const res = await dispatch({
      type: submittype,
      payload: {
        ...searchQuery,
        deliverId: Number(pathId),
        surveyId: surveyinfo?.survey?.id,
        answers,
      },
    });
    if (res?.success) {
      dispatch({
        type: 'nps/update',
        payload: {
          showModalType: 1,
        },
      });
    }
  };

  const nextBtn = (
    <Button fullWidth onClick={goNext} disabled={disabledNextBtn}>
      {_t('mZAibG6mSo6s8qxrp2ew9o')}
    </Button>
  );
  const preBtn = (
    <Button onClick={goPre} type="default">
      {_t('mHM9JuUz58y3RXkXz4FTLV')}
    </Button>
  );

  const submitBtn = (
    <Button onClick={goSubmit} disabled={disabledNextBtn} loading={loading}>
      {_t('cw6hNErmVyjjvpe81wkmvH')}
    </Button>
  );

  const renderFoot = () => {
    const len = surveyinfo?.questions?.length;
    const lastIndex = len - 1;

    if (len === 1) {
      return submitBtn;
    }

    if (curIndex === 0) {
      return nextBtn;
    }

    // 最后一题
    if (curIndex === lastIndex) {
      return (
        <>
          {preBtn}
          {submitBtn}
        </>
      );
    }

    // 中间题
    return (
      <>
        {preBtn}
        {nextBtn}
      </>
    );
  };

  const scaleClass = location.href.includes('scale') ? style.scale2X : '';
  const isDark = location.href.includes('night=true');

  return (
    <ThemeProvider theme={isDark ? 'dark' : 'light'}>
      <ShowModals />
      <div
        id="nps-page-online"
        className={classnames(
          style.page,
          scaleClass,
          isDark ? 'page-isDark' : '',
          isInApp ? style.isInApp : '',
        )}
      >
        <div className={style.contentWrap}>
          <div className={style.fixedTopWrap}>
            <div className={style.fixedTop}>
              <NormalHeader title={surveyinfo?.survey?.surveyTitle || window._BRAND_NAME_} />
              <div className={style.StyleLineProgressWrap}>
                <LineProgress percent={percent} size="small" showInfo={false} className="p-line" />
              </div>
            </div>
          </div>
          <div className={classnames(style.mainScroll, style.mainWrapper)}>
            <Question />
          </div>

          <div className={style.fixedFootWrap}>
            <div className={style.fixedFoot}>
              <div className={style.foot}>{renderFoot()}</div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default React.memo(Online);
