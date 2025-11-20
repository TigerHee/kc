/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import Loading from 'components/Loading';
import LegoPreview from 'components/$/LeGo/preview';
import brandCheckHoc from 'src/hocs/brandCheckHoc';
import { tenantConfig } from 'src/config/tenant';

const Preview = ({
  match: {
    params: { path },
  },
  history,
}) => {
  const dispatch = useDispatch();
  const { isAe } = useSelector((state) => state.lego);
  const [isOkUrl, setIsOkUrl] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'lego/getPreviewConfig',
      payload: { legoId: path },
    }).then((code) => {
      // 未配置的path 跳转至404
      if (code === '110020') {
        history.replace('/404');
      } else {
        setIsOkUrl(true);
      }
    });
  }, []);

  // 判断是阿拉伯语
  useEffect(() => {
    if (isAe) {
      const bodyElement = document.getElementById('body');
      bodyElement.setAttribute('style', 'direction: rtl;');
    }
  }, [isAe]);

  if (isOkUrl) {
    return <LegoPreview />;
  }

  return <Loading />;
};

export default brandCheckHoc(Preview, () => ['KC_ROUTE'].includes(tenantConfig.siteRoute));
