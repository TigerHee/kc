/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';
import { useMemo, useState } from 'react';
import { ReactComponent as LessIcon } from 'static/account/kyc/index/less.svg';
import { ReactComponent as PlusIcon } from 'static/account/kyc/index/plus.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';

const FAQBox = styled.div`
  border: 1px solid rgba(29, 29, 29, 0.08);
  border-radius: 20px;
  padding: 28px 32px 16px 32px;
  margin-bottom: 24px;
  @media screen and (max-width: 1439px) {
    padding: 28px 24px 16px 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 24px 16px;
  }
`;
const FAQTitle = styled.h4`
  font-weight: 600;
  font-size: 20px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;
const FAQList = styled.div`
  display: flex;
  flex-direction: column;
`;
const FAQItem = styled.div`
  cursor: pointer;
  padding: 22px 0 21px 0px;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 20px 0;
  }
  & + div {
    border-top: 1px solid ${({ theme }) => theme.colors.divider4};
  }
`;
const FAQItemTitleBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const FAQItemTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;
const FAQIcon = styled.div`
  width: 20px;
  height: 21px;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 36px;
  svg {
    color: ${({ theme, active }) => {
    return active ? theme.colors.icon : theme.colors.icon;
  }};
    opacity: 1;
  }
`;
const FAQItemDesc = styled.div`
  padding-top: 14px;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text60};
  padding-right: 10px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
  span > span {
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
  }
`;

export default function FAQ() {
  const [expandFAQ, setExpandFAQ] = useState(-1);

  const faqArr = useMemo(() => {
    return [
      {
        title: _t('duopwSqWAp4MosvgTERSku'),
        desc: [_t('v7wUQUYHK8i7Bgt1ZoVb9o')],
      },
      {
        title: _t('p4RzQQdjDzt1r6z3CyotCv'),
        desc: [_t('wSbZSSzVqhzzgHCpFuXZ7k')],
      },
      {
        title: _t('eiuR4Jr2YCjCk8DXKeTqgS'),
        desc: [_t('21oedGV3neFadNwFWVwaRN')],
      },
      {
        title: _t('waBZXNh64osNDZySKSJr1r'),
        desc: [_tHTML('52459a58045b4000a44c')],
      },
    ];
  }, []);

  return (
    <FAQBox data-inspector="account_kyc_faq">
      <FAQTitle>{_t('ib8hU23L3uqtcWzHhNybiV')}</FAQTitle>
      <FAQList>
        {faqArr.map((item, index) => (
          <FAQItem
            data-testid={`faqItem${index}`}
            key={item.title}
            onClick={(e) => {
              if (
                e?.target?.nodeName?.toLocaleUpperCase() === 'SPAN' &&
                e?.target?.parentNode?.nodeName?.toLocaleUpperCase() === 'SPAN'
              ) {
                window.open(addLangToPath('/support'));
                return;
              }
              setExpandFAQ((i) => (i === index ? -1 : index));
            }}
          >
            <FAQItemTitleBox>
              <FAQItemTitle>{item.title}</FAQItemTitle>
              <FAQIcon active={expandFAQ === index}>
                {expandFAQ === index ? <LessIcon /> : <PlusIcon />}
              </FAQIcon>
            </FAQItemTitleBox>
            {expandFAQ === index
              ? item?.desc.map((i) => <FAQItemDesc key={i}>{i}</FAQItemDesc>)
              : null}
          </FAQItem>
        ))}
      </FAQList>
    </FAQBox>
  );
}
