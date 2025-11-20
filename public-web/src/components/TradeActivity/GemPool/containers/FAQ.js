/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { Accordion, styled, useResponsive } from '@kux/mui';
import FAQJson from 'components/Seo/FAQJson';
import { map } from 'lodash';
import { memo, useCallback, useEffect, useRef } from 'react';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { push } from 'utils/router';
import { getTextFromHtml } from 'utils/seoTools';

const StyledFAQ = styled.section`
  margin-bottom: 64px;
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 120px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    // 小屏下样式复写，组件库支持后可删除
    .KuxAccordion-root {
      margin-bottom: 12px;
      .KuxAccordion-head {
        font-size: 14px;
        svg {
          width: 16px;
          height: 16px;
        }
      }
      .KuxAccordion-panel {
        font-size: 14px;
      }
    }
  }
`;

const FAQContainer = styled.div`
  padding: 0 16px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0;
  }
`;

const TitleWrapper = styled.h2`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%;
  padding: 0 16px;
  margin: 0;
  margin-bottom: 16px;
  color: ${(props) => props.theme.colors.text};

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: 24px;
    padding: 0;
    font-size: 24px;
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: 40px;
    padding: 0;
    font-weight: 600;
    font-size: 36px;
  }
`;

const { AccordionPanel } = Accordion;
const { KUCOIN_HOST } = siteCfg;

const FAQ = ({ showDisclaim = false }) => {
  const isInApp = JsBridge.isApp();
  const myRef = useRef();
  const { lg } = useResponsive();
  const faqData = [
    {
      question: _t('72cca37f35ed4000a76e'),
      answer: _t('7412364658244000ab4d'),
    },
    {
      question: _t('973d81a530f84000a4d1'),
      answer: _tHTML('1909313a7ec64000a0b6'),
    },
    {
      question: _t('00d0efcf31e44000aec7'),
      answer: _t('1214faff81764000a5fd'),
    },
    {
      question: _t('ca0b19e91ef14000aaf3'),
      answer: _tHTML('172d351df4b14000a049'),
    },
    {
      question: _t('e20aa15aed024000ab9d'),
      answer: _t('1e847f942aef4000a234'),
    },
  ];

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (isInApp) {
        const tragetUrl = KUCOIN_HOST + addLangToPath('/legal/terms-of-use');
        JsBridge.open({
          type: 'jump',
          params: {
            url: `/link?url=${encodeURIComponent(tragetUrl)}`,
          },
        });
      } else {
        push('/legal/terms-of-use');
      }
    },
    [isInApp],
  );

  useEffect(() => {
    const node = myRef.current;

    if (node instanceof HTMLElement) {
      const a = node.querySelector('.alink a');

      if (a) {
        a.addEventListener('click', handleClick);
      }
    }

    return () => {
      const node = myRef.current;

      if (node instanceof HTMLElement) {
        const a = node.querySelector('.alink a');
        if (a) {
          a.removeEventListener('click', handleClick);
        }
      }
    };
  }, [handleClick]);

  const transformText = (item) => {
    return item?.props?.dangerouslySetInnerHTML
      ? getTextFromHtml(item?.props?.dangerouslySetInnerHTML?.__html)
      : item;
  };

  const faqSeoData = map(faqData, ({ question, answer }) => ({
    question: transformText(question),
    answer: transformText(answer),
  }));

  return (
    <StyledFAQ data-inspector="inspector_gempool_faq">
      <TitleWrapper>{_t('2tavmdYbkww1RBa8p8Kak7')}</TitleWrapper>
      <FAQJson faq={faqSeoData} />
      <FAQContainer ref={myRef}>
        <Accordion dispersion size={!lg ? 'small' : 'default'}>
          {map(faqData, ({ question, answer }, index) => {
            return (
              <AccordionPanel header={question} key={`qustion_${index}`}>
                <div className={index === 1 ? 'alink' : ''}>{answer}</div>
              </AccordionPanel>
            );
          })}
        </Accordion>
      </FAQContainer>
      {showDisclaim && <AppleDisclaim />}
    </StyledFAQ>
  );
};

export default memo(FAQ);
