/**
 * Owner: jessie@kupotech.com
 */
import { ICTradeAddOutlined, ICTradeMinusOutlined } from '@kux/icons';
import { Accordion, Divider, styled } from '@kux/mui';
import FAQJson from 'components/Seo/FAQJson';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import question from 'static/spotlight7/question.svg';
import { _t } from 'tools/i18n';
import AnchorPlaceholder from 'TradeActivityCommon/AnchorPlaceholder';
import { getTextFromHtml } from 'utils/seoTools';
import Title from './Title';

const { AccordionPanel } = Accordion;

const Wrapper = styled.section`
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const FAQContainer = styled.div`
  div.KuxAccordion-root {
    margin-bottom: 16px;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.cover2};
    border-radius: 16px;

    &:last-of-type {
      margin-bottom: 0;
    }

    .KuxAccordion-head {
      padding: 0;
      color: ${(props) => props.theme.colors.text};
      font-weight: 500;
      font-size: 14px;
      font-style: normal;
      line-height: 130%;

      .KuxAccordion-iconWrapper {
        svg {
          width: 20px;
          height: 20px;
          margin-left: 8px;
          color: ${(props) => props.theme.colors.text};
          vertical-align: middle;
        }
      }
    }

    .KuxAccordion-panel {
      padding: 0;
      color: ${(props) => props.theme.colors.text40};
      font-weight: 400;
      font-size: 14px;
      font-style: normal;
      line-height: 150%;

      .KuxDivider-root {
        margin: 16px 0;
        background: ${(props) => props.theme.colors.cover4};
      }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
      margin-bottom: 24px;
      padding: 32px 40px;

      .KuxAccordion-head {
        font-size: 24px;

        .KuxAccordion-iconWrapper {
          svg {
            width: 32px;
            height: 32px;
            margin-left: 16px;
          }
        }
      }

      .KuxAccordion-panel {
        font-size: 18px;

        .KuxDivider-root {
          margin: 40px 0;
        }
      }
    }

    .KuxAccordion-activeBg {
      display: none;
    }
  }
`;

function convertDataToDisplayText(data) {
  try {
    const arr = JSON.parse(data);
    return arr.map(({ type, content, href }) => {
      if (type === 'link') {
        return (
          <a href={href} target="_blank" rel="noreferrer">
            {content}
          </a>
        );
      } else if (type === 'text') {
        return <span>{content}</span>;
      }
    });
  } catch {
    // 兼容原数据
    return data;
  }
}

const Faq = () => {
  const { faqModule = [] } = useSelector((state) => state.spotlight7.detailInfo, shallowEqual);

  const transformText = (item) => {
    return item?.props?.dangerouslySetInnerHTML
      ? getTextFromHtml(item?.props?.dangerouslySetInnerHTML?.__html)
      : item;
  };

  const faqSeoData = map(faqModule, ({ title, content }) => ({
    question: transformText(title),
    answer: transformText(convertDataToDisplayText(content)),
  }));

  return !faqModule?.length ? null : (
    <Wrapper>
      <AnchorPlaceholder id="faq" />
      <FAQJson faq={faqSeoData} />
      <Title title={_t('newhomepage.faq')} icon={question} />

      <FAQContainer>
        <Accordion
          accordion
          bordered={false}
          expandIcon={(active) => (active ? <ICTradeMinusOutlined /> : <ICTradeAddOutlined />)}
        >
          {map(faqModule, ({ title, content }, index) => {
            return (
              <AccordionPanel header={title} key={`qustion_${index}`}>
                <Divider />
                {convertDataToDisplayText(content)}
              </AccordionPanel>
            );
          })}
        </Accordion>
      </FAQContainer>
    </Wrapper>
  );
};

export default Faq;
