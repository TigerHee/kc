/**
 * Owner: tiger@kupotech.com
 */
import { useState, useEffect } from 'react';
import { useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import { debounce } from 'lodash';
import { Wrapper, ContentBox, FooterBtnBox, PageTitle, StyledSpin } from '../../commonStyle';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import { Content, ArrowIcon } from './style';
import Item from './Item';
import { postJsonWithPrefix, getNdidData, cancelNdidNode } from '../../../service';
import SystemError from '../../SystemError';

export default ({ onNextPage, onPrePage, pageId, pageAfterApi }) => {
  const { message } = useSnackbar();
  const { _t } = useLang();
  const { isSmStyle, setInnerPageElements, flowData } = useCommonData();

  // 更多列表是否展开
  const [isShowMoreList, setShowMoreList] = useState(true);
  // 用户选择的节点
  const [selectVal, setSelectVal] = useState('');
  // 是否展示系统错误
  const [isShowErr, setShowErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registeredList, setRegisteredList] = useState([]);
  const [registerableList, setRegisterableList] = useState([]);
  const [isNextLoading, setNextLoading] = useState(false);

  const onCancel = () => {
    cancelNdidNode({ transactionId: flowData.transactionId })
      .then(() => {})
      .catch(() => {});
  };

  const getList = debounce(() => {
    setLoading(true);
    getNdidData({
      transactionId: flowData.transactionId,
    })
      .then((res) => {
        setShowErr(false);
        setRegisteredList(res?.data?.registeredList || []);
        setRegisterableList(res?.data?.registerableList || []);
      })
      .catch(() => {
        setShowErr(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, 300);

  useEffect(() => {
    onCancel();
    getList();
  }, []);

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: _t('6c01b131ba5b4000a35a'),
    });
  }, []);

  const onNext = async () => {
    setNextLoading(true);
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
        nodeId: selectVal,
      });

      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
    setNextLoading(false);
  };

  return (
    <Wrapper>
      <StyledSpin spinning={loading} size="large" />
      {isShowErr ? (
        <SystemError onRetry={getList} />
      ) : (
        <>
          <ContentBox
            className={classnames({
              isSmStyle,
            })}
          >
            <Content>
              {isSmStyle && (
                <PageTitle className="PageTitle">{_t('6c01b131ba5b4000a35a')}</PageTitle>
              )}

              <div className="desc">{_t('fedd036941cb4000ad7f')}</div>

              {registeredList.length > 0 && (
                <>
                  <div className="label">{_t('e501a40361a24000a4ad')}</div>
                  {registeredList.map((item) => (
                    <Item
                      key={item}
                      item={item}
                      selectVal={selectVal}
                      setSelectVal={setSelectVal}
                    />
                  ))}
                </>
              )}

              {registerableList.length > 0 && (
                <>
                  <div className="label mt" onClick={() => setShowMoreList(!isShowMoreList)}>
                    <span>{_t('431536155d344000ae94')}</span>
                    <ArrowIcon isShowMoreList={isShowMoreList} />
                  </div>
                  {isShowMoreList
                    ? registerableList.map((item) => (
                        <Item
                          key={item.nodeId}
                          item={item}
                          selectVal={selectVal}
                          setSelectVal={setSelectVal}
                        />
                      ))
                    : null}
                </>
              )}
            </Content>
          </ContentBox>

          <FooterBtnBox
            onNext={onNext}
            onPre={onPrePage}
            preText={_t('kyc_process_previous')}
            nextText={_t('5e456e56b9914000abd2')}
            nextBtnProps={{
              disabled: !selectVal,
              loading: isNextLoading,
            }}
          />
        </>
      )}
    </Wrapper>
  );
};
