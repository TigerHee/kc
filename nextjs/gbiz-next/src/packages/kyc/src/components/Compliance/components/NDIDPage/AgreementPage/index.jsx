/**
 * Owner: tiger@kupotech.com
 */
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Parser } from 'html-to-react';
import { styled, useSnackbar } from '@kux/mui';
import { Wrapper, ContentBox, FooterBtnBox, PageTitle } from '../../commonStyle';
import useLang from '../../../../../hookTool/useLang';
import useCommonData from '../../../hooks/useCommonData';
import { postJsonWithPrefix } from '../../../service';
import thTerm from './thTerm';
import enTerm from './enTerm';

export const htmlToReactParser = new Parser();

const Content = styled.div`
  .PageTitle {
    margin-bottom: 24px;
  }
  .term {
    font-size: 16px;
    font-weight: 400;
    line-height: 150%;
    color: var(--color-text60);
  }
  .termItem {
    display: flex;
    margin-bottom: 12px;
  }
  .contentItem {
    display: flex;
    margin-bottom: 12px;
  }
`;

export default ({ onNextPage, onPrePage, pageId, pageAfterApi }) => {
  const { isSmStyle, setInnerPageElements, flowData } = useCommonData();
  const { message } = useSnackbar();
  const { _t, i18n = {} } = useLang();
  const { language: currentLang } = i18n;
  const isLangTH = currentLang === 'th_TH';

  const boxRef = useRef(null);
  // 是否已读
  const [isRead, setRead] = useState(false);

  useEffect(() => {
    const boxEl = boxRef.current;
    if (boxEl.scrollHeight <= boxEl.clientHeight) {
      setRead(true);
    }
  }, []);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setRead(true);
    }
  };

  useEffect(() => {
    setInnerPageElements({
      pagePreButtonTxt: _t('kyc_process_previous'),
      pageTitle: _t('0b64bc2eba224000afb8'),
    });
  }, []);

  const onNext = async () => {
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

  const list = isLangTH ? thTerm : enTerm;

  return (
    <Wrapper>
      <ContentBox
        className={clsx({
          isSmStyle,
        })}
        ref={boxRef}
        onScroll={handleScroll}
      >
        <Content>
          {isSmStyle && <PageTitle className="PageTitle">{_t('0b64bc2eba224000afb8')}</PageTitle>}
          <div className="term">
            {list.map(({ index, content }) => {
              return (
                <div className="termItem" key={index}>
                  <div>{index}&nbsp;</div>
                  <div>{htmlToReactParser.parse(content)}</div>
                </div>
              );
            })}
          </div>
        </Content>
      </ContentBox>

      <FooterBtnBox
        onNext={onNext}
        onPre={onPrePage}
        preText={_t('kyc_process_previous')}
        nextText={_t('5e456e56b9914000abd2')}
        nextBtnProps={{
          disabled: !isRead,
        }}
      />
    </Wrapper>
  );
};
