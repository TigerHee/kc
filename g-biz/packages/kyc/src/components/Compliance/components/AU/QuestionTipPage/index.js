/**
 * Owner: tiger@kupotech.com
 */
import { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { Parser } from 'html-to-react';
import { useSnackbar, useTheme } from '@kux/mui';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import useLang from '@packages/kyc/src/hookTool/useLang';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { postJsonWithPrefix } from '@kycCompliance/service';
import { Container } from './style';
import { getPageData } from './tipConfig';
import icon from './img/icon.svg';
import iconDark from './img/icon-dark.svg';

const IMG_CONFIG = {
  light: icon,
  dark: iconDark,
};

const htmlToReactParser = new Parser();

export default ({ onPrePage, onNextPage, pageId, pageAfterApi, pageCode }) => {
  const { isSmStyle, flowData, setInnerPageElements } = useCommonData();
  const { message } = useSnackbar();
  const { _t } = useLang();
  const { currentTheme } = useTheme();

  const [nextLoading, setNextLoading] = useState(false);

  const pageData = useMemo(() => getPageData({ pageCode, _t }), [pageCode, _t]);

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: pageData.title,
      step: pageData.step,
    });
  }, [pageData]);

  const onNext = async () => {
    setNextLoading(true);
    try {
      const { flowId, transactionId, complianceStandardCode } = flowData;

      if (pageAfterApi) {
        await postJsonWithPrefix(pageAfterApi, {
          flowId,
          transactionId,
          complianceStandardCode,
          pageId,
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
          <div className="imgBox">
            <img src={IMG_CONFIG[currentTheme]} alt="icon" />
          </div>
          {pageData.section && <div className="text40 section">{pageData.section}</div>}

          {isSmStyle && <div className="title">{pageData.title}</div>}

          <div className="text40 total">{pageData.total}</div>
          {pageData.list && (
            <div className="list">
              {pageData.list.map((item) => (
                <div className="listItem" key={item}>
                  {htmlToReactParser.parse(item)}
                </div>
              ))}
            </div>
          )}
        </Container>
      </ContentBox>

      <FooterBtnBox
        onNext={onNext}
        onPre={onPrePage}
        preText={_t('kyc_process_previous')}
        nextText={pageData.primaryBtnText}
        nextBtnProps={{
          loading: nextLoading,
        }}
      />
    </Wrapper>
  );
};
