/**
 * Owner: Ray.Lee@kupotech.com
 */
import { Accordion, px2rem, styled } from '@kux/mui';

import FAQJson from 'components/Seo/FAQJson';
import { map } from 'lodash';
import React, { useEffect, useState } from 'react';
import { tenantConfig } from 'src/config/tenant';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const { AccordionPanel } = Accordion;

const Icon1 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1C5.92472 1 1 5.92472 1 12C1 18.0753 5.92472 23 12 23C18.0753 23 23 18.0753 23 12C23 5.92472 18.0753 1 12 1ZM3 12C3 7.02928 7.02928 3 12 3C16.9707 3 21 7.02928 21 12C21 16.9707 16.9707 21 12 21C7.02928 21 3 16.9707 3 12Z"
      fill="#1D1D1D"
    />
    <path
      d="M11 11.001H8C7.44772 11.001 7 11.4487 7 12.001C7 12.5533 7.44772 13.001 8 13.001H11H13H16C16.5523 13.001 17 12.5533 17 12.001C17 11.4487 16.5523 11.001 16 11.001H13H11Z"
      fill="#1D1D1D"
    />
  </svg>
);

const Icon2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H11V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H13V8Z"
      fill="#1D1D1D"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1C5.92472 1 1 5.92472 1 12C1 18.0753 5.92472 23 12 23C18.0753 23 23 18.0753 23 12C23 5.92472 18.0753 1 12 1ZM3 12C3 7.02928 7.02928 3 12 3C16.9707 3 21 7.02928 21 12C21 16.9707 16.9707 21 12 21C7.02928 21 3 16.9707 3 12Z"
      fill="#1D1D1D"
    />
  </svg>
);

const Title = styled.h2`
  margin-bottom: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  font-size: ${px2rem(36)};
  line-height: ${px2rem(32)};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;
    font-size: ${px2rem(20)};
  }
`;

const Tutorial = styled.a`
  font-size: 14px;
  font-weight: 500;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.primary};
`;

const Container = styled.div`
  max-width: ${px2rem(1200)};
  width: 100%;
  margin: 0 auto;
  padding: ${px2rem(120)} 0 ${px2rem(27)} 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: ${px2rem(32)} 0;
  }
`;

const FaqBox = styled.div`
  /* width: 100%; */
  /* padding: 0 ${px2rem(24)}; */

  /* ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0;
    padding: 0 ${px2rem(18)};
  } */
`;

const Panel = styled(AccordionPanel)`
  margin-bottom: 24px;
  background-color: ${(props) => props.theme.colors.cover2};
  border-radius: 16px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 14px;
  }

  .KuxAccordion-activeBg {
    width: auto;
  }

  .KuxAccordion-head {
    display: flex;
    align-items: center;
    padding: 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
  }

  .KuxAccordion-iconWrapper {
    display: flex;
    align-items: center;
    ${(props) => props.theme.breakpoints.down('sm')} {
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  .KuxAccordion-panel {
    padding: 16px;
    color: ${(props) => props.theme.colors.text40};
    font-size: 16px;
    line-height: 150%;
    border-top: 1px solid ${(props) => props.theme.colors.divider4};
  }
`;

const Para = styled.p`
  margin-bottom: 10px;

  a {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Faq5Content = () => {
  return (
    <>
      <Para>{_t('55df93299c944000a790')}</Para>
      <Para>{_t('fd19ece589ac4000aaf3')}</Para>
      <Para>
        {_tHTML('15de039241e94000a70e', { href: addLangToPath('/support/34869477207961') })}
      </Para>
    </>
  );
};

/**
 * faq json answer 必须传字符串 不能传 对象
 */
export default () => {
  const faqList = React.useMemo(() => {
    return [
      {
        title: _t('5r8osDXo9YivAsNRwPr4Zv'),
        answer: _t('woPTaTiAaCDuFwpRgK1E4Z'),
        content: _t('woPTaTiAaCDuFwpRgK1E4Z'),
      },
      {
        title: _t('6Jt4Aoy8Z6Xi8tPHuFqHna'),
        answer: _t('hKvv3QegnMyz2dZzRY6D9w'),
        content: _t('hKvv3QegnMyz2dZzRY6D9w'),
      },
      {
        title: _t('67zkdqgCGHrNmxRoqj9WFg'),
        answer: _t('aHZBDpNctjU98xBavDzUo1'),
        content: _t('aHZBDpNctjU98xBavDzUo1'),
      },
      {
        title: _t('aj6DD1jE92fLaCg1zY57de'),
        answer: _t('rbT7E63ZUAs9XC9HthtF7K'),
        content: _t('rbT7E63ZUAs9XC9HthtF7K'),
      },
      {
        title: _t('f097865414cc4000a633'),
        answer: _t('55df93299c944000a790'),
        content: <Faq5Content />,
      },
    ];
  }, []);

  const [faqData, setFaqData] = useState();

  useEffect(() => {
    const faqJsonData = faqList.map((item) => {
      return {
        question: item.title,
        answer: item.answer,
      };
    });
    setFaqData(faqJsonData);
  }, [faqList]);

  return (
    <FaqBox className="wow fadeInUp" data-inspector="convert_faq">
      <Container data-inspector="convert_faq">
        {/* 如果需要去掉常见问题，注意去掉巡检用例 */}
        <FAQJson faq={faqData} />
        <Title>
          FAQ
          {/* 目前只有主站展示教程 */}
          {tenantConfig.convertPageConfig.showTutorial && (
            <Tutorial
              onClick={() => trackClick(['Tutorial', '1'])}
              href={addLangToPath(
                '/learn/kucoin-guide/how-to-swap-cryptos-with-0-fees-using-convert',
              )}
              data-inspector="convert_turorail_link"
            >
              {_tHTML('i3A3aeUMdt2rVaGftFZBVX')}
            </Tutorial>
          )}
        </Title>
        <Accordion bordered={false} expandIcon={(active) => (active ? <Icon1 /> : <Icon2 />)}>
          {map(faqList, ({ title, content }, i) => {
            return (
              <Panel header={title} key={i}>
                {content}
              </Panel>
            );
          })}
        </Accordion>
      </Container>
    </FaqBox>
  );
};
