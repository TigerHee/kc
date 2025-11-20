/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo } from 'react';
import { useHistory, useDispatch, useSelector } from 'dva';
import { styled, Global, css } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import { KUCOIN_HOST_COM } from 'utils/siteConfig';
import { addLangToPath } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import AlertModal from './../AlertModal';
import useQuestion from '../../hooks/useQuestion';
// import { ReactComponent as Close } from 'src/assets/nps/close.svg';
import banner1 from 'src/assets/nps/banner1.png';
import banner2 from 'src/assets/nps/banner2.png';

const SurveyDesc = styled.div`
  width: 100%;
  font-size: 14px;
  line-height: 18px;
  color: #000d1d;
  font-weight: 400;

  ${(props) => {
    if (props.theme.currentTheme === 'dark') {
      return `color: #E1E8F5;`;
    }
  }}
`;

const SurveyDescBottom = styled.div`
  margin-top: 6px;
  width: 100%;
  font-size: 14px;
  line-height: 16px;
  color: rgba(0, 13, 29, 0.4);

  font-weight: 400;

  ${(props) => {
    if (props.theme.currentTheme === 'dark') {
      return `color: #E1E8F5;`;
    }
  }}
`;

const ShowModals = memo((props) => {
  const { surveyinfo } = useQuestion();
  const surveyDesc = surveyinfo?.survey?.surveyDesc;
  const dispatch = useDispatch();
  const { isInApp, currentLang } = useSelector((state) => state.app);
  const showModalType = useSelector((state) => state.nps.showModalType);

  const closeModal = () => {
    dispatch({
      type: 'nps/update',
      payload: {
        showModalType: 0,
      },
    });
  };

  const onFinish = () => {
    closeModal();
    // app 内 点击我知道了按钮，返回到原生来源页；web 内 点击我知道了按钮，返回到www.kucoin.com;
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      window.location.href = addLangToPath(KUCOIN_HOST_COM);
    }
  };

  if (showModalType === 1) {
    return (
      <AlertModal
        bannerImg={banner1}
        okWords={_t('tCLK8oziCFvcnAna2zf9om')}
        open
        title={_t('sQAqiFrXCAiDZKZZ44KfMD')}
        onOk={onFinish}
      >
        {_t('jwsHPXDKcQ3xS8e8y7QKUE')}
      </AlertModal>
    );
  }

  if (showModalType === 2) {
    return (
      <AlertModal
        bannerImg={
          <img
            src={banner2}
            alt="banner2"
            style={{ width: '100%', background: 'rgba(1, 188, 141, 0.08)' }}
          />
        }
        okWords={_t('aUFS2yCRGryYYzMSa6tFwo')}
        open
        onOk={closeModal}
      >
        {surveyDesc && <SurveyDesc>{surveyDesc}</SurveyDesc>}
        <SurveyDescBottom>{_t('fDQPxeCTHNmtXBveMJJC6f')}</SurveyDescBottom>
      </AlertModal>
    );
  }

  return null;
});

export default ShowModals;
