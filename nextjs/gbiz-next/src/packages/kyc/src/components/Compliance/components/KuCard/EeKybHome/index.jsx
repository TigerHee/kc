/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { cloneDeep, omitBy } from 'lodash-es';
import { Button, useSnackbar } from '@kux/mui';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { Wrapper, ContentBox, FooterBtnBox, StyledSpin } from 'kycCompliance/components/commonStyle';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { GetTransactionSettings, delMataData, getInitDataCommon } from 'kycCompliance/service';
import useFetch from 'kycCompliance/hooks/useFetch';
import { companyInfoKeyList, legalInfoKeyList, uboBaseList } from './config';
import { Container, CheckIcon, RightArrowIcon, EditIcon, AddIcon, DeleteIcon } from './style';

// UBO 必填要素数量 - 额外计算4个前端显示相关的
const uboExtraRequireLength = 4;
const uboPage1RequireLength = uboExtraRequireLength + 1;
const uboAllRequireLength = uboExtraRequireLength + 12;

export default ({ onNextPage, pageCode }) => {
  const { message } = useSnackbar();
  const { isSmStyle, onPageToFixed, flowData, setInnerPageElements, setCrossPageData, formData, onCacheFormData } =
    useCommonData();
  const { _t } = useLang();

  const [allValue, setAllValue] = useState({});
  const [uboList, setUboList] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // 获取 page 配置
  const { data: pageData } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  const pageElements = pageData?.pageElements || {};

  const getData = () => {
    setIsPageLoading(true);
    GetTransactionSettings({ transactionId: flowData.transactionId })
      .then(res => {
        const metadataList = res?.data?.metadataList || [];
        const obj = {};
        metadataList.forEach(({ metaCode, metaAlias, metaData }) => {
          if (metaCode) {
            obj[metaCode] = metaData;
          }
          if (metaAlias) {
            obj[metaAlias] = metaData;
          }
        });
        setAllValue(obj);
        onCacheFormData(obj);

        const newUboList = uboBaseList
          .map(item => {
            const result = {
              ...item,
              firstName: obj[`ubo${item.no}FirstName`],
              lastName: obj[`ubo${item.no}LastName`],
            };
            Object.keys(item).forEach(key => {
              if (obj[key]) {
                result[key] = obj[key];
              }
            });
            return result;
          })
          .sort((a, b) => a.firstName?.charAt(0)?.localeCompare(b.firstName?.charAt(0)));
        setUboList(newUboList);
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  };

  useEffect(() => {
    getData();
    setCrossPageData({});
    setInnerPageElements({
      headerHidePre: true,
    });
  }, []);

  const onNext = () => {
    let userName = '';
    if (
      completeUboList.some(item => {
        const validValuesLength = Object.values(
          omitBy(item, (value, key) => key.includes('BackendPhoto') || key.includes('AddressLine2') || !Boolean(value))
        ).length;

        if (validValuesLength < uboAllRequireLength) {
          userName = `${item.firstName || ''} ${item.lastName || ''}`;
          return true;
        }
        return false;
      })
    ) {
      message.info(_t('16883f1ac9644000a7ee', { userName }));
      return;
    }

    onNextPage();
  };

  // 添加 UBO
  const onAddUbo = () => {
    const emptyUbo = uboList.find(item => !item.firstName || !item.lastName);
    if (emptyUbo) {
      setCrossPageData(emptyUbo);
      onPageToFixed(emptyUbo.pageCode);
      return;
    }
  };

  // 删除 UBO
  const onDeleteUbo = item => {
    const metaCodes = Object.keys(item).filter(key => key.includes('ubo'));
    delMataData({
      transactionId: flowData.transactionId,
      metaCodes,
    })
      .then(() => {
        const newFormData = cloneDeep(formData);
        // 删除与 metaCodes 匹配的 key
        metaCodes.forEach(metaCode => {
          delete newFormData[metaCode];
        });
        onCacheFormData(newFormData, true);

        getData();
      })
      .catch(error => {
        message.error(error.msg || error.message);
      });
  };

  // 基础信息列表
  const baseList = [
    {
      title: _t('96fb93e8c1c34800a359'),
      isComplete: companyInfoKeyList.every(item => allValue[item]),
      onPageTo: () => {
        onPageToFixed('page_86');
      },
    },
    {
      title: _t('2300e28fd5984000a44b'),
      isComplete: legalInfoKeyList.every(item => allValue[item]),
      onPageTo: () => {
        const legalInfoData = legalInfoKeyList.reduce((acc, key) => {
          acc[key] = allValue[key];
          return acc;
        }, {});
        setCrossPageData(legalInfoData);
        onPageToFixed('page_88');
      },
    },
  ];

  // 完成 UBO 列表
  const completeUboList = uboList.filter(item => {
    const validValuesLength = Object.values(item).filter(v => Boolean(v)).length;
    return validValuesLength >= uboPage1RequireLength;
  });
  // completeUboList 长度大于0
  const completeUboListLengthOver0 = completeUboList?.length > 0;
  // UBO 是否完成
  const isUboComplete = completeUboListLengthOver0 || String(formData.leUboOrNot) === '1';
  // UBO 是否可以添加
  const isCanAddUbo = completeUboList?.length < 5;
  // 是否可以提交
  const isCanSubmit = !isPageLoading && isUboComplete && baseList.every(({ isComplete }) => isComplete);

  return (
    <Wrapper>
      <StyledSpin spinning={isPageLoading} size="small" />
      <ContentBox
        className={clsx({
          isSmStyle,
        })}
      >
        <Container
          className={clsx({
            isSmStyle,
          })}
        >
          {isSmStyle && <h2 className="title">{pageElements?.pageTitle}</h2>}
          <p className="desc">{pageElements?.pageDescription}</p>
          <div className="list">
            {baseList.map(({ title, isComplete, onPageTo }) => (
              <div className="item" key={title} onClick={onPageTo}>
                <div className="itemContent">
                  <div className="itemLeft">
                    <CheckIcon
                      className={clsx({
                        isComplete,
                      })}
                    />
                    <span className="itemTitle">{title}</span>
                  </div>

                  {isComplete ? <EditIcon /> : <RightArrowIcon />}
                </div>
              </div>
            ))}

            {/* UBO */}
            <div
              className="item"
              onClick={() => {
                if (completeUboList.length === 0) {
                  onAddUbo();
                }
              }}
            >
              <div className="itemContent">
                <div className="itemLeft">
                  <CheckIcon
                    className={clsx({
                      isComplete: isUboComplete,
                    })}
                  />
                  <span className="itemTitle">{_t('8bb9cf63b8bb4000ab75')}</span>
                </div>

                {completeUboListLengthOver0 ? null : <RightArrowIcon />}
              </div>

              {completeUboListLengthOver0 && (
                <div className="uboInfo">
                  {completeUboList.map(item => {
                    const { firstName, lastName, pageCode } = item;

                    return (
                      <div className="uboItem" key={firstName + lastName + pageCode}>
                        <div className="uboItemLeft">
                          {firstName} {lastName}
                        </div>
                        <div className="uboItemRight">
                          <DeleteIcon
                            onClick={() => {
                              onDeleteUbo(item);
                            }}
                          />
                          <EditIcon
                            onClick={() => {
                              setCrossPageData(item);
                              onPageToFixed(pageCode);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  <p className="uboDesc">{_t('a37b9d4b94fd4800a6af')}</p>

                  {isCanAddUbo && (
                    <Button type="default" onClick={onAddUbo}>
                      <AddIcon />
                      <span>{_t('cda6f4b361064000a895')}</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </ContentBox>

      {/* 底部按钮 */}
      <FooterBtnBox
        onNext={onNext}
        nextText={pageElements?.pageNextButtonTxt}
        nextBtnProps={{
          disabled: !isCanSubmit,
        }}
      />
    </Wrapper>
  );
};
