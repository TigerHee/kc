/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { useSnackbar, Checkbox } from '@kux/mui';
import JsBridge from '@tools/bridge';
import addLangToPath from '@tools/addLangToPath';
import storage from '@utils/storage';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { postJsonWithPrefix, getInitDataCommon } from '@kycCompliance/service';
import useFetch from '@kycCompliance/hooks/useFetch';
import { getJsonStringToObj } from '@kycCompliance/config';
import { getPageData } from './pageConfig';
import { Container, CheckboxDesc } from './style';

const htmlToReactParser = new Parser();

export default ({ onNextPage, pageId, pageAfterApi, onPrePage, pageCode }) => {
  const { isSmStyle, flowData, setInnerPageElements, inApp } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();
  const [checkValues, setCheckValues] = useState({});

  // 获取 page 配置
  const { data } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  const termParams = getJsonStringToObj(data?.pageElements?.termParams);

  console.info('termParams', termParams);

  const pageData = useMemo(() => getPageData({ pageCode, _t, termParams }), [
    pageCode,
    _t,
    termParams,
  ]);

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: pageData.title,
    });
  }, [pageData.title]);

  const onNext = async () => {
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;
      await postJsonWithPrefix(pageAfterApi, {
        flowId,
        transactionId,
        complianceStandardCode,
        pageId,
        userTermSubRequests: termParams,
      });

      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
  };

  const onOpenLink = (e) => {
    const target = e?.target;
    const url = target?.getAttribute('data-link');
    if (url) {
      e.preventDefault();
      if (inApp) {
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${url}`,
          },
        });
      } else {
        window.open(addLangToPath(url, storage.getItem('kucoinv2_lang')), '_blank');
      }
    }
  };

  const isNextDisabled = useMemo(() => {
    const list = Object.values(checkValues).filter((i) => Boolean(i));
    return list.length !== pageData?.agreeList.length;
  }, [checkValues, pageData]);

  return (
    <Wrapper>
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <Container
          className={classnames({
            isSmStyle,
          })}
        >
          <div className="content">
            {isSmStyle && <div className="title">{pageData.title}</div>}
            <div className="desc">
              {pageData.descList?.map((item) => {
                return (
                  <span key={item} onClick={onOpenLink}>
                    {htmlToReactParser.parse(item)}
                  </span>
                );
              })}
            </div>
            {pageData.agreeDesc && <div className="agreeDesc">{pageData.agreeDesc}</div>}

            <div className="checkList">
              {pageData.agreeList?.map(({ label, key }) => {
                return (
                  <Checkbox
                    key={key}
                    checkOptions={{
                      type: 2, // 1黑色 2 灰色
                      checkedType: 1, // 1黑色 2 绿色
                    }}
                    size="small"
                    checked={checkValues[key]}
                    onChange={(e) =>
                      setCheckValues((pre) => {
                        return { ...pre, ...{ [key]: e.target.checked } };
                      })
                    }
                  >
                    <CheckboxDesc
                      onClick={onOpenLink}
                      className={classnames({
                        isSmStyle,
                      })}
                    >
                      {htmlToReactParser.parse(label)}
                    </CheckboxDesc>
                  </Checkbox>
                );
              })}
            </div>
          </div>
        </Container>
      </ContentBox>

      {/* 底部按钮 */}
      <FooterBtnBox
        onNext={onNext}
        onPre={onPrePage}
        preText={_t('kyc_process_previous')}
        nextText={_t('5e456e56b9914000abd2')}
        nextBtnProps={{
          disabled: isNextDisabled,
        }}
      />
    </Wrapper>
  );
};
