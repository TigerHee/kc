/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import JsBridge from 'utils/jsBridge';
import Loading from 'components/Loading';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';
import Online from 'src/components/$/Nps/Online';
import { isPreviewFn } from 'src/components/$/Nps/config';
import useQuestion from 'src/components/$/Nps/hooks/useQuestion';

const isPreview = isPreviewFn();

const Nps = ({
  match: {
    params: { path },
  },
  history,
}) => {
  const pathId = path;
  const dispatch = useDispatch();
  const { setEN_USLangWhenNoMatch } = useQuestion();
  const { isInApp } = useSelector((state) => state.app);
  const [isOkUrl, setIsOkUrl] = useState(false);

  //在app中隐藏app的header
  useEffect(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'event',
        params: {
          name: 'updateHeader',
          visible: false,
          statusBarTransparent: true,
        },
      });
    }
  }, [isInApp]);

  const payload = isPreview
    ? {
        surveyId: pathId,
      }
    : {
        deliverId: pathId,
      };

  useEffect(() => {
    dispatch({
      type: 'nps/getSurveyinfo',
      payload,
    }).then((res) => {
      setIsOkUrl(true);

      // 已经提交过了：展示结束弹窗
      if (res?.data?.collected === true || (!res?.data?.exist && !isPreview)) {
        dispatch({
          type: 'nps/update',
          payload: {
            showModalType: 1,
          },
        });
        return;
      }

      // 开始答题弹窗
      dispatch({
        type: 'nps/update',
        payload: {
          showModalType: 2,
        },
      });

      // 语言不匹配,重定向
      setEN_USLangWhenNoMatch(res?.data);

      // // 未配置的pathId 跳转至404
      // if (!res?.data?.exist && !isPreview) {
      //   history.replace('/404');
      //   return;
      // }
    });
  }, []);

  if (isOkUrl) {
    return (
      <Fragment>
        <Online pathId={pathId} />
      </Fragment>
    );
  }

  return <Loading />;
};

export default brandCheckHoc(React.memo(Nps), () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
