/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import loadable from '@loadable/component';
import classnames from 'classnames';
import { isBoolean } from 'lodash';
import { useSnackbar } from '@kux/mui';
import { Wrapper, ContentBox, FooterBtnBox, PageTitle, StyledSpin } from '../../commonStyle';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import { Content, TransIcon } from './style';
import { getCountdown } from './config';
import ResultModal from './ResultModal';
import { postJsonWithPrefix, getNdidTimerData } from '../../../service';

const ExitModal = loadable(() => import('../../ExitModal'));

export default ({ onPrePage, onNextPage, pageId, pageAfterApi, pageCode }) => {
  const { message } = useSnackbar();
  const { _t } = useLang();
  const { isSmStyle, setInnerPageElements, flowData } = useCommonData();
  // 过期时间
  const [endTime, setEndTime] = useState('');
  // 倒计时数据
  const [countDown, setCountDown] = useState({
    minute: '00',
    second: '00',
  });
  // 倒计时页面渲染数据
  const [data, setData] = useState({});
  // 结果弹窗是否展示
  const [isResultModalOpen, setResultModalOpen] = useState(false);
  // 是否成功
  const [isSuccess, setSuccess] = useState(false);
  // 挽留弹窗是否展示
  const [isExitOpen, setExitOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 提交
  const onSubmit = async () => {
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
      });
      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
  };

  // 拉取结果
  const getData = () => {
    getNdidTimerData({
      transactionId: flowData.transactionId,
    })
      .then((res) => {
        if (isBoolean(res?.data?.ndidResult)) {
          setResultModalOpen(true);
          setSuccess(res?.data?.ndidResult);
        }
        setData(res?.data || {});
        setEndTime(res?.data?.expireTime);
      })
      .catch((error) => {
        if (error?.msg) {
          message.error(error?.msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 轮训用户结果信息
  useEffect(() => {
    let timer = null;
    if (!isResultModalOpen) {
      timer = window.setInterval(() => {
        getData();
      }, 10 * 1000);
    }

    return () => {
      timer && window.clearInterval(timer);
    };
  }, [isResultModalOpen]);

  // 页面初始化
  useEffect(() => {
    getData();
  }, []);

  // 设置页面文案
  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: _t('990952372b344000a530'),
    });
  }, []);

  // 计算倒计时
  useEffect(() => {
    let timer = null;
    if (endTime && !isResultModalOpen) {
      setCountDown(getCountdown(endTime));

      timer = window.setInterval(() => {
        const val = getCountdown(endTime);
        setCountDown(val);

        if (val.isEnd) {
          setResultModalOpen(true);
          setSuccess(false);
          window.clearInterval(timer);
        }
      }, 1000);
    }

    return () => {
      timer && window.clearInterval(timer);
    };
  }, [endTime, isResultModalOpen]);

  // 结果弹窗按钮点击
  const handleResultClick = () => {
    setResultModalOpen(false);
    if (isSuccess) {
      onSubmit();
    } else {
      onPrePage();
    }
  };

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <Content
          className={classnames({
            isSmStyle,
          })}
        >
          {isSmStyle && (
            <PageTitle textCenter className="PageTitle">
              {_t('990952372b344000a530')}
            </PageTitle>
          )}

          <div className="desc">{_t('d2bc5b16b5404000a1b5')}</div>

          {/* 倒计时 */}
          <div className="countdownBox">
            <div className="countdownItem">
              <div className="number">{countDown?.minute}</div>
              <div className="unit">M</div>
            </div>
            <div className="countdownItem">
              <div className="number">{countDown?.second}</div>
              <div className="unit">S</div>
            </div>
          </div>

          {/* logo等三方信息 */}
          <div className="linkBox">
            {data.nodeLogo && (
              <div className="linkLogoBox">
                <img className="linkLogo" src={window._BRAND_LOGO_MINI_} alt="kc_logo" />
                <TransIcon />
                <img className="linkLogo" src={data.nodeLogo} alt="third_logo" />
              </div>
            )}

            <div className="linkDesc">{_t('b56ffea30f9a4000a306')}</div>
            <div className="linkId">{_t('bb8ef8957f364000a28c', { id: data?.referenceId })}</div>
          </div>

          {data?.nodeName && (
            <div className="tips">
              {_t('7b124503d4ef4000a0a7', { identityProvider: data?.nodeName })}
            </div>
          )}
        </Content>
      </ContentBox>

      {!isSmStyle && (
        <FooterBtnBox onPre={() => setExitOpen(true)} preText={_t('kyc_process_previous')} />
      )}

      {/* ndid认证结果 */}
      <ResultModal
        open={isResultModalOpen}
        onCancel={handleResultClick}
        onOk={handleResultClick}
        isSuccess={isSuccess}
        data={data}
      />

      {/* 挽留弹窗 */}
      {isExitOpen && (
        <ExitModal
          open={isExitOpen}
          onCancel={() => setExitOpen(false)}
          onOk={() => {
            setExitOpen(false);
            onPrePage();
          }}
          pageCode={pageCode}
        />
      )}
    </Wrapper>
  );
};
