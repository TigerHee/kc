/**
 * Owner: tiger@kupotech.com
 */
import { useState, useMemo, useEffect, Fragment } from 'react';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { Button, Alert, useSnackbar } from '@kux/mui';
import useLang from '@packages/kyc/src/hookTool/useLang';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { postJsonWithPrefix, getInitDataCommon } from '@kycCompliance/service';
import { Wrapper, ContentBox } from '@kycCompliance/components/commonStyle';
import useFetch from '@kycCompliance/hooks/useFetch';
import { getJsonStringToObj } from '@kycCompliance/config';
import { getPageData } from './pageConfig';
import { Container, TermFooter } from './style';

const htmlToReactParser = new Parser();

const type1 = '1';
const type2 = '2';

export default ({ onNextPage, pageId, pageAfterApi, pageCode }) => {
  const { isSmStyle, flowData, setInnerPageElements } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();

  const [type, setType] = useState('');
  const [nextLoading, setNextLoading] = useState(false);

  // 获取 page 配置
  const { data } = useFetch(getInitDataCommon, { params: { pageCode }, ready: pageCode });
  const termParams = getJsonStringToObj(data?.pageElements?.termParams);

  const pageData = useMemo(() => getPageData({ pageCode, _t }), [pageCode, _t]);

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: pageData.pageTitle,
      isHeaderShowTitle: true,
    });
  }, [pageData.pageTitle]);

  const onNext = async () => {
    setNextLoading(true);
    try {
      if (pageAfterApi) {
        const { flowId, transactionId, complianceStandardCode } = flowData;
        await postJsonWithPrefix(pageAfterApi, {
          flowId,
          transactionId,
          complianceStandardCode,
          pageId,
          userTermSubRequests: termParams,
        });
      }

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
          {pageData.content?.map((item) => (
            <Fragment key={item}>{htmlToReactParser.parse(item)}</Fragment>
          ))}
        </Container>
      </ContentBox>
      <TermFooter
        className={classnames({
          isSmStyle,
        })}
      >
        <section className="termFooterContent">
          <div className="termFooterTitle">{pageData.bottomTitle}</div>

          <div className="termFooterDescList">
            {pageData.bottomDescList.map((item, index) => (
              <div key={item} className="footerDescListItem">
                <span>{index + 1}. </span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="termFooterBtnBox">
            <Button onClick={() => setType(type2)} className="btn" variant="outlined">
              {_t('2c77ddbead164800a2a2')}
            </Button>
            <Button
              onClick={() => {
                setType(type1);
                onNext();
              }}
              loading={nextLoading}
              className="btn"
              variant="outlined"
            >
              {_t('e1cbc132fd994000aea3')}
            </Button>
          </div>

          {type === type2 && (
            <Alert showIcon type="warning" title={pageData.disagreeText} className="alert" />
          )}
        </section>
      </TermFooter>
    </Wrapper>
  );
};
