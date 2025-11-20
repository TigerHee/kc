/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { RightOutlined } from '@kufox/icons';
import { Box, px2rem, styled, useMediaQuery, useTheme } from '@kufox/mui';
import FAQJson from 'components/Seo/FAQJson';
import { debounce, map } from 'lodash';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Scroll from 'react-scroll';
import NO_1 from 'static/kcs/no-1.png';
import NO_2 from 'static/kcs/no-2.png';
import NO_3 from 'static/kcs/no-3.png';
import seo_management from 'static/kcs/seo-management.png';
import { _t } from 'tools/i18n';
import Modal from '../Modal';

const { Element, Link: ScrollLink } = Scroll;

const Links = styled.ul`
  border-bottom-width: ${px2rem(1)};
  border-bottom-color: rgba(227, 228, 230, 0.8);
  border-bottom-style: solid;
  overflow-x: auto;
  white-space: nowrap;
  overflow-y: hidden;
  margin: 0;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: ${px2rem(40)};
    padding: 0;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    height: ${px2rem(80)};
    padding: 0 ${px2rem(14)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: ${px2rem(80)};
    padding: 0 ${px2rem(14)};
  }
`;

const Link = styled.li`
  list-style: none;
  display: inline-block;
  ${(props) => props.theme.breakpoints.up('sm')} {
    &:not(:first-of-type) {
      margin-left: ${px2rem(30)};
    }
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    &:not(:first-of-type) {
      margin-left: ${px2rem(40)};
    }
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    &:not(:first-of-type) {
      margin-left: ${px2rem(40)};
    }
  }
`;

const Url = styled(ScrollLink)`
  display: inline-block;
  position: relative;
  height: 100%;
  color: ${(props) => (props.active ? '#2DBD96' : '#01081E')};
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(40)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(80)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(80)};
  }
  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    display: ${(props) => (props.active ? 'block' : 'none')};
    width: 100%;
    height: ${px2rem(2)};
    background-color: ${`#2DBD96`};
    content: '';
  }
  &:hover {
    color: ${(props) => (props.active ? '#2DBD96' : '#01081E')};
    ${
      '' /* &::after {
      display: block;
    } */
    }
  }
`;
const TabsWrapper = styled(Box)`
  margin: 0;
  width: 100%;
  position: sticky;
  z-index: 10;
  top: ${px2rem(80)};
  background: #fff;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding-right: ${px2rem(24)};
    padding-left: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding-right: ${px2rem(24)};
    padding-left: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding-right: ${px2rem(120)};
    padding-left: ${px2rem(120)};
  }
`;

const ContentWrapper = styled(Box)`
  position: relative;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 ${(props) => (props.value === 'FAQ' ? 0 : px2rem(24))};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 ${(props) => (props.value === 'FAQ' ? 0 : px2rem(24))};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0 ${(props) => (props.value === 'FAQ' ? 0 : px2rem(120))};
  }
`;
const TabsElement = styled(Element)`
  background: ${(props) => (props.name === 'FAQ' ? '#f7f8fa' : '#fff')};
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 0 ${(props) => (props.name === 'FAQ' ? px2rem(24) : 0)};
    padding-top: ${(props) => (props.name === 'FAQ' ? px2rem(40) : px2rem(24))};
    padding-bottom: ${(props) => (props.name === 'FAQ' ? px2rem(0) : px2rem(24))};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    padding: 0 ${(props) => (props.name === 'FAQ' ? px2rem(24) : 0)};
    padding-top: ${px2rem(40)};
    padding-bottom: ${px2rem(40)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    padding: 0 ${(props) => (props.name === 'FAQ' ? px2rem(120) : 0)};
    padding-top: ${(props) => (props.name === 'FAQ' ? px2rem(40) : px2rem(50))};
    padding-bottom: ${(props) => (props.name === 'FAQ' ? px2rem(40) : px2rem(50))};
  }
`;

const TabsTitle = styled.div`
  color: #091133;
  font-weight: 600;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: ${px2rem(16)};
    font-size: ${px2rem(20)};
    line-height: ${px2rem(20)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: ${px2rem(17)};
    font-size: ${px2rem(32)};
    line-height: ${px2rem(32)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: ${px2rem(17)};
    font-size: ${px2rem(32)};
    line-height: ${px2rem(32)};
  }
`;
const TabsText = styled.div`
  color: rgba(0, 20, 42, 0.6);
  font-weight: 400;
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: ${px2rem(12)};
    line-height: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
`;
const BenefitWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(0, 20, 42, 0.6);
  font-weight: 400;
  flex-wrap: wrap;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: ${px2rem(16)};
    font-size: ${px2rem(12)};
    line-height: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: ${px2rem(29)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: ${px2rem(35)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
`;
const BenefitItem = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  flex: 1;
  ${(props) => props.theme.breakpoints.up('sm')} {
    min-width: 100%;
    max-width: 100%;
    padding-right: ${px2rem(12)};
    padding-bottom: ${px2rem(24)};
    padding-left: ${px2rem(12)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    min-width: ${px2rem(360)};
    max-width: 50%;
    padding-right: ${px2rem(24)};
    padding-bottom: ${px2rem(26)};
    padding-left: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    min-width: unset;
    max-width: unset;
    padding-right: ${px2rem(24)};
    padding-bottom: ${px2rem(30)};
    padding-left: ${px2rem(24)};
  }
  &:hover {
    background: rgba(245, 246, 248, 0.4);
  }
`;
const BenefitImgWrapper = styled.div`
  height: ${px2rem(95)};
  display: flex;
  align-items: center;
`;
const BenefitImgNo1 = styled.img`
  width: ${px2rem(75)};
`;
const BenefitImgNo2 = styled.img`
  width: ${px2rem(68)};
`;
const BenefitImgNo3 = styled.img`
  width: ${px2rem(75)};
`;
const BenefitTitle = styled.div`
  color: #091133;
  font-weight: 600;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: ${px2rem(14)};
    margin-bottom: ${px2rem(14)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(21)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: ${px2rem(9)};
    margin-bottom: ${px2rem(8)};
    font-size: ${px2rem(20)};
    line-height: ${px2rem(30)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: ${px2rem(12)};
    margin-bottom: ${px2rem(18)};
    font-size: ${px2rem(20)};
    line-height: ${px2rem(30)};
  }
`;
const BenefitContent = styled.div`
  color: rgba(0, 20, 42, 0.6);
  font-weight: 400;
  font-size: ${px2rem(12)};
  line-height: ${px2rem(18)};
`;
const BurnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(0, 20, 42, 0.6);
  font-weight: 400;
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: column;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-direction: column;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
`;
const BurnLeft = styled.div`
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(489)};
  }
`;
const BurnRight = styled.div`
  text-align: right;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(554)};
  }
`;
const MangeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(0, 20, 42, 0.6);
  font-weight: 400;
  margin-bottom: ${px2rem(30)};
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: column;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-direction: row;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
  }
`;
const MangeLeft = styled.div`
  text-align: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 100%;
    margin-right: 0;
    margin-bottom: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${px2rem(280)};
    margin-right: ${px2rem(20)};
    margin-bottom: 0;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(340)};
    margin-right: ${px2rem(20)};
    margin-bottom: 0;
  }
`;
const MangeImg = styled.img`
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: ${px2rem(200)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${px2rem(260)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(310)};
  }
`;
const MangeRight = styled.div`
  ${(props) => props.theme.breakpoints.up('sm')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${px2rem(380)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    width: ${px2rem(606)};
  }
`;
const BurnListItem = styled.div`
  border-bottom: 1px solid #e3e4e6;
  font-weight: ${(props) => (props.header ? 500 : 400)};
  display: flex;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: ${px2rem(50)};
    padding: 0 ${px2rem(12)};
    line-height: ${px2rem(50)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    height: ${px2rem(56)};
    padding: 0 ${px2rem(24)};
    line-height: ${px2rem(56)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: ${px2rem(56)};
    padding: 0 ${px2rem(24)};
    line-height: ${px2rem(56)};
  }
`;
const BurnViewMore = styled.div`
  font-size: ${px2rem(14)};
  color: #00c295;
  line-height: ${px2rem(18)};
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: ${px2rem(16)};
    padding: 0 ${px2rem(12)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: ${px2rem(24)};
    padding: 0 ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: ${px2rem(24)};
    padding: 0 ${px2rem(24)};
  }
  svg {
    margin-left: ${px2rem(8)};
  }
`;
const FaqWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: column;
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    flex-direction: row;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: row;
    margin-top: ${px2rem(7)};
  }
`;
const FaqItem = styled.div`
  flex: 1;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-bottom: ${px2rem(40)};
    padding-right: ${px2rem(20)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-bottom: ${px2rem(40)};
    padding-right: ${px2rem(70)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-bottom: ${px2rem(40)};
    padding-right: ${px2rem(70)};
  }
`;
const FaqTitle = styled.div`
  font-size: ${px2rem(20)};
  color: #091133;
  font-weight: 600;
  ${(props) => props.theme.breakpoints.up('sm')} {
    line-height: ${px2rem(28)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    line-height: ${px2rem(30)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    line-height: ${px2rem(30)};
  }
`;
const FaqText = styled.div`
  font-size: ${px2rem(12)};
  color: rgba(0, 20, 42, 0.6);
  line-height: ${px2rem(18)};
  margin-top: ${px2rem(12)};
  font-weight: 400;
`;
const ModalChildren = styled.div`
  text-align: right;
  width: 100%;
`;
const ModalContent = styled.div`
  overflow-y: auto;
  ${(props) => props.theme.breakpoints.up('sm')} {
    height: ${px2rem(280)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    height: ${px2rem(460)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    height: ${px2rem(460)};
  }
`;
const BurnList = [
  {
    date: '2022.05',
    number: '85,450',
  },
  {
    date: '2022.04',
    number: '157,537',
  },
  {
    date: '2022.03',
    number: '238,178',
  },
  {
    date: '2022.02',
    number: '248,202',
  },
  {
    date: '2022.01',
    number: '301,538',
  },
  {
    date: '2021.12',
    number: '300,316',
  },
  {
    date: '2021.11',
    number: '343,354',
  },
  {
    date: '2021.10',
    number: '252,146',
  },
  {
    date: '2021.09',
    number: '347,620',
  },
  {
    date: '2021.08',
    number: '254,105',
  },
  {
    date: '2021.07',
    number: '140,829',
  },
  {
    date: '2021.06',
    number: '185,096',
  },
  {
    date: '2021.05',
    number: '683,621',
  },
  {
    date: '2021.04',
    number: '348,241',
  },
  {
    date: '2021.03',
    number: '160,723',
  },
  {
    date: '2021.02',
    number: '250,645',
  },
  {
    date: '2021.01',
    number: '147,102',
  },
  {
    date: '2020Q4',
    number: '275,179',
  },
  {
    date: '2020Q3',
    number: '609,756',
  },
  {
    date: '2020Q2',
    number: '521,890',
  },
  {
    date: '2020Q1',
    number: '600,167',
  },
  {
    date: '2019Q4',
    number: '513,100',
  },
  {
    date: '2019Q3',
    number: '937,500',
  },
  {
    date: '2019Q2',
    number: '375,366',
  },
  {
    date: '2019Q1',
    number: '280,501',
  },
  {
    date: '2018Q4',
    number: '198,238',
  },
  {
    date: '2018Q3',
    number: '196,211',
  },
  {
    date: '2018Q2',
    number: '396,211',
  },
  {
    date: '2018Q1',
    number: '312,500',
  },
];

const faqlist = [
  {
    question: _t('kcs.faq.place'),
    answer: _t('kcs.faq.place.desc'),
  },
  {
    question: _t('kcs.faq.bonus'),
    answer: _t('kcs.faq.bonus.desc'),
  },
  {
    question: _t('kcs.faq.small'),
    answer: _t('kcs.faq.small.desc'),
  },
  {
    question: _t('kcs.faq.price'),
    answer: _t('kcs.faq.price.desc'),
  },
];

export default () => {
  useLocale();
  const theme = useTheme();
  const [tab, setTab] = useState('Benefits');
  const [show, setShow] = useState(false);
  const sm = useMediaQuery((themes) => themes.breakpoints.down('md'));
  const handleSetActive = useCallback(
    debounce((key) => {
      if (tab !== key) {
        setTab(key);
      }
    }, 0),
    [tab, debounce, setTab],
  );
  useEffect(() => {
    handleSetActive('Benefits');
  }, []);
  const kcsTabs = [
    {
      label: _t('kcs.benefits'),
      value: 'Benefits',
      content: () => (
        <TabsElement name="Benefits" data-inspector="Benefits">
          <TabsTitle>{_t('kcs.benefits')}</TabsTitle>
          {/* <TabsText>{_t('kcs.benefits.desc')}</TabsText> */}
          <BenefitWrapper>
            <BenefitItem>
              <BenefitImgWrapper>
                <BenefitImgNo1 src={NO_1} />
              </BenefitImgWrapper>
              <BenefitTitle>{_t('kcs.benefits.bonus')}</BenefitTitle>
              <BenefitContent>{_t('kcs.benefits.detail1')}</BenefitContent>
            </BenefitItem>
            <BenefitItem>
              <BenefitImgWrapper>
                <BenefitImgNo2 src={NO_2} />
              </BenefitImgWrapper>
              <BenefitTitle>{_t('kcs.benefits.trade')}</BenefitTitle>
              <BenefitContent>{_t('kcs.benefits.detail2')}</BenefitContent>
            </BenefitItem>
            <BenefitItem>
              <BenefitImgWrapper>
                <BenefitImgNo3 src={NO_3} />
              </BenefitImgWrapper>
              <BenefitTitle>{_t('kcs.benefits.burn')}</BenefitTitle>
              <BenefitContent>{_t('kcs.benefits.detail3')}</BenefitContent>
            </BenefitItem>
          </BenefitWrapper>
        </TabsElement>
      ),
    },
    {
      label: _t('kcs.burn'),
      value: 'Burn',
      content: () => (
        <TabsElement name="Burn" data-inspector="Burn">
          <TabsTitle>{_t('kcs.burn')}</TabsTitle>
          <BurnWrapper>
            <BurnLeft>
              <TabsText>{_t('kcs.burn.details')}</TabsText>
            </BurnLeft>
            <BurnRight>
              <BurnListItem header>
                <span>{_t('kcs.burn.period')}</span>
                <span>{_t('kcs.burn.number')}</span>
              </BurnListItem>
              {map(BurnList.slice(0, 5), ({ date, number }) => {
                return (
                  <BurnListItem key={number}>
                    <span>{date}</span>
                    <span>{number} </span>
                  </BurnListItem>
                );
              })}
              <BurnViewMore data-inspector="inspector_kcs_more" onClick={() => setShow(true)}>
                {_t('kcs.burn.more')} <RightOutlined size={18} />
              </BurnViewMore>
            </BurnRight>
          </BurnWrapper>
        </TabsElement>
      ),
    },
    {
      label: _t('kcs.management'),
      value: 'Management',
      content: () => (
        <TabsElement name="Management" data-inspector="Management">
          <MangeWrapper>
            <MangeLeft>
              <MangeImg src={seo_management} />
            </MangeLeft>
            <MangeRight>
              <TabsTitle>{_t('kcs.management')}</TabsTitle>
              <TabsText>{_t('kcs.management.desc')}</TabsText>
            </MangeRight>
          </MangeWrapper>
        </TabsElement>
      ),
    },
    {
      label: _t('kcs.faq'),
      value: 'FAQ',
      content: () => (
        <TabsElement name="FAQ" data-inspector="FAQ">
          <TabsTitle>{_t('kcs.faq')}</TabsTitle>
          <FaqWrapper>
            <FaqItem>
              <FaqTitle>{faqlist[0].question}</FaqTitle>
              <FaqText>{faqlist[0].answer} </FaqText>
            </FaqItem>
            <FaqItem>
              <FaqTitle>{faqlist[1].question}</FaqTitle>
              <FaqText>{faqlist[1].answer}</FaqText>
            </FaqItem>
          </FaqWrapper>
          <FaqWrapper>
            <FaqItem>
              <FaqTitle>{faqlist[2].question}</FaqTitle>
              <FaqText>{faqlist[2].answer} </FaqText>
            </FaqItem>
            <FaqItem>
              <FaqTitle>{faqlist[3].question}</FaqTitle>
              <FaqText>{faqlist[3].answer}</FaqText>
            </FaqItem>
          </FaqWrapper>
        </TabsElement>
      ),
    },
  ];

  return (
    <Fragment>
      <TabsWrapper>
        {/* 如果需要去掉常见问题，注意去掉巡检用例 */}
        <FAQJson faq={faqlist} />
        <Links theme={theme}>
          {map(kcsTabs, ({ label, value }) => {
            return (
              <Link key={value}>
                <Url
                  spy={true}
                  offset={sm ? -120 : -156}
                  duration={100}
                  smooth={false}
                  to={value}
                  active={value === tab ? 1 : 0}
                  ignoreCancelEvents={true}
                  onClick={() => handleSetActive(value)}
                  onSetActive={() => handleSetActive(value)}
                  // data-link={UNWANTED_ROUTER}
                >
                  {label}
                </Url>
              </Link>
            );
          })}
        </Links>
      </TabsWrapper>
      {map(kcsTabs, ({ content, value }) => {
        return (
          <ContentWrapper key={value} value={value}>
            {content()}
          </ContentWrapper>
        );
      })}
      {show ? (
        <Modal
          onClose={() => {
            setShow(false);
          }}
        >
          <ModalChildren data-inspector="inspector_kcs_burn_modal">
            <BurnListItem header>
              <span>{_t('kcs.burn.period')}</span>
              <span>{_t('kcs.burn.number')}</span>
            </BurnListItem>
            <ModalContent>
              {map(BurnList, ({ date, number }) => {
                return (
                  <BurnListItem key={number}>
                    <span>{date}</span>
                    <span>{number} </span>
                  </BurnListItem>
                );
              })}
            </ModalContent>
          </ModalChildren>
        </Modal>
      ) : null}
    </Fragment>
  );
};
