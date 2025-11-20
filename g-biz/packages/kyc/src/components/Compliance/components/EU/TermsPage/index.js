/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { useSnackbar, Checkbox, useTheme } from '@kux/mui';
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
import icon from './img/icon.svg';
import iconDark from './img/icon-dark.svg';

const htmlToReactParser = new Parser();
const IMG_CONFIG = {
  light: icon,
  dark: iconDark,
};

export default ({ onNextPage, pageId, pageAfterApi, onPrePage, pageCode }) => {
  const { isSmStyle, flowData, setInnerPageElements, inApp } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();
  const { currentTheme } = useTheme();

  const [checkValues, setCheckValues] = useState({});
  const [nextLoading, setNextLoading] = useState(false);

  // 获取 page 配置
  const { data } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  const termParams = getJsonStringToObj(data?.pageElements?.termParams);

  const pageData = useMemo(() => getPageData({ pageCode, _t, termParams }), [
    pageCode,
    _t,
    termParams,
  ]);

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('7536faa7b9e84800a76d'),
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
        userTermSubRequests: termParams,
      });

      onNextPage();
    } catch (error) {
      if (error?.msg) {
        message.error(error?.msg);
      }
    }
    setNextLoading(false);
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
    return list.length !== pageData?.agreeList?.length;
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
            <img className="icon" src={IMG_CONFIG[currentTheme]} alt="icon" />
            <div className="title">{pageData.title}</div>
            <div className="subTitle">{pageData.subTitle}</div>
            <div className="desc">
              <ul>
                {pageData.descList?.map((item) => {
                  return <li key={item}>{htmlToReactParser.parse(item)}</li>;
                })}
              </ul>
            </div>
          </div>

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
        </Container>
      </ContentBox>

      {/* 底部按钮 */}
      <FooterBtnBox
        onNext={onNext}
        onPre={onPrePage}
        preText={_t('7536faa7b9e84800a76d')}
        nextText={_t('5e456e56b9914000abd2')}
        nextBtnProps={{
          disabled: isNextDisabled,
          loading: nextLoading,
        }}
        nextTooltip={isNextDisabled ? _t('b3eeecab96564000a789') : ''}
      />
    </Wrapper>
  );
};
