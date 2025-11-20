/**
 * Owner: willen@kupotech.com
 */
import React, { useState, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { _t, _tHTML } from 'src/tools/i18n';
import Pointer from './Pointer';
import WayImg from 'static/about-us/banner5_way.svg';
import PointImg from 'static/about-us/banner5_point.png';
import PointCheckedImg from 'static/about-us/banner5_point_checked.svg';
import Banner5BgCircle from 'static/about-us/banner5_bg_circle.svg';
import { useLocale } from '@kucoin-base/i18n';
import { px2rem, styled, keyframes } from '@kufox/mui';
import { tenantConfig } from 'config/tenant';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const getCurrentQuarter = () => {
  const today = new Date();
  const quarter = Math.floor((today.getMonth() + 3) / 3);
  return quarter;
};

const getCurrentYear = () => {
  const _year = new Date().getFullYear();
  return _year;
};

const periodData = [
  {
    id: 0,
    year: '2021',
    qname: 'Q1',
    peroid: '2021 Q1',
    pt: 621,
    text: 'aboutus.trend.item1.intro',
  },
  {
    id: 1,
    year: '',
    qname: 'Q2',
    peroid: '2021 Q2',
    pt: 571,
    text: 'aboutus.trend.item2.intro',
  },
  {
    id: 2,
    year: '',
    qname: 'Q3',
    peroid: '2021 Q3',
    pt: 522,
    text: 'aboutus.trend.item3.intro',
  },
  {
    id: 3,
    year: '',
    qname: 'Q4',
    peroid: '2021 Q4',
    pt: 538,
    text: 'aboutus.trend.item4.intro',
  },
  {
    id: 4,
    year: '2022',
    qname: 'Q1',
    peroid: '2022 Q1',
    pt: 560,
    text: 'aboutus.trend.item5.intro',
  },
  {
    id: 5,
    year: '',
    qname: 'Q2',
    peroid: '2022 Q2',
    pt: 514,
    text: 'aboutus.trend.item6.intro',
  },
  {
    id: 6,
    year: '',
    qname: 'Q3',
    peroid: '2022 Q3',
    pt: 445,
    text: 'aboutus.trend.item7.intro',
  },
  {
    id: 7,
    year: '',
    qname: 'Q4',
    peroid: '2022 Q4',
    pt: 429,
    text: 'aboutus.trend.item8.intro',
  },
  {
    id: 8,
    year: '2023',
    qname: 'Q1',
    peroid: '2023 Q1',
    pt: 457,
    text: 'aboutus.trend.item9.intro',
  },
];

// 展示最新的2023 Q3到2025 Q1
if (tenantConfig.aboutUs.useGlobalPeriod) {
  periodData.push(
    {
      id: 9,
      year: '',
      qname: 'Q3',
      peroid: '2023 Q3',
      pt: 398,
      text: 'aboutus.roadmap.2023.q3',
    },
    {
      id: 10,
      year: '',
      qname: 'Q4',
      peroid: '2023 Q4',
      pt: 293,
      text: 'aboutus.roadmap.2023.q4',
    },
    {
      id: 11,
      year: '2024',
      qname: 'Q1',
      peroid: '2024 Q1',
      pt: 291,
      text: 'aboutus.roadmap.2024.q1',
    },
    {
      id: 12,
      year: '',
      qname: 'Q2',
      peroid: '2024 Q2',
      pt: 290,
      text: 'aboutus.roadmap.2024.q2',
    },
    {
      id: 13,
      year: '',
      qname: 'Q3',
      peroid: '2024 Q3',
      pt: 289,
      text: 'aboutus.roadmap.2024.q3',
    },
    {
      id: 14,
      year: '',
      qname: 'Q4',
      peroid: '2024 Q4',
      pt: 288,
      text: 'aboutus.roadmap.2024.q4',
    },
    {
      id: 15,
      year: '2025',
      qname: 'Q1',
      peroid: '2025 Q1',
      pt: 287,
      text: 'aboutus.roadmap.2025.q1',
    },
  );
} else {
  periodData.push(
    {
      id: 9,
      year: '',
      qname: 'Q3',
      peroid: '2023 Q3',
      pt: 398,
      text: 'aboutus.trend.item10.intro',
    },
    {
      id: 10,
      year: '',
      qname: 'Q4',
      peroid: '2023 Q4',
      pt: 293,
      text: 'aboutus.trend.item11.intro',
    },
  );
}

const total = periodData.length;

const currentPeriod = `${getCurrentYear()} Q${getCurrentQuarter()}`;
const initialItem = periodData.find((item) => item.peroid === currentPeriod) || { id: 0 };

const PeriodItemBox = styled.div`
  flex: 1;
  flex-shrink: 0;
  max-width: ${px2rem(120)};
  color: ${(props) => (props.isActive ? '#fff' : '#717C8B')};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: ${px2rem(135)};
`;

const PeriodItemMain = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  img {
    &[data-role='int'] {
      display: block;
      width: ${px2rem(14)};
    }
  }
`;

const PeriodBottom = styled.div`
  font-weight: 500;
  font-size: ${px2rem(12)};
  margin-top: ${px2rem(12)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(12)};
  }
`;

const PeriodTop = styled.div`
  width: 100%;
  height: ${px2rem(40)};
  font-weight: 500;
  font-size: ${px2rem(20)};
  border-left: 1px solid ${(props) => (props.year ? '#4d6f68' : 'transparent')};
  padding-left: ${px2rem(6)};
  transform: translateX(50%);
  ${(props) => props.theme.breakpoints.down('md')} {
    padding-left: ${px2rem(4)};
  }
`;

const PeriodCheckedImg = styled.img`
  display: ${(props) => (props.isActive ? 'block' : 'none')};
  width: ${px2rem(120)};
  position: absolute;
  bottom: ${px2rem(-24)};
  animation: ${fadeIn} 0.5s;
`;

const PeriodItem = ({
  year = '',
  qname = '',
  pt = 0,
  id = 0,
  activeId,
  onClickPeriod = () => {},
}) => {
  const isActive = id === activeId;
  useLocale();

  return (
    <PeriodItemBox isActive={isActive}>
      <PeriodItemMain
        onClick={() => {
          onClickPeriod(id);
        }}
      >
        <PeriodTop year={year}>{year}</PeriodTop>
        <img data-role="int" src={PointImg} alt="" />
        <PeriodCheckedImg src={PointCheckedImg} isActive={isActive} alt="" />
        <PeriodBottom>{qname}</PeriodBottom>
      </PeriodItemMain>
    </PeriodItemBox>
  );
};

const Wrapper = styled.div`
  position: relative;
  min-height: ${px2rem(768)};
  background: #01081e url(${Banner5BgCircle});
  ${(props) => props.theme.breakpoints.down('md')} {
    min-height: ${px2rem(660)};
  }
`;

const MainBox = styled.div`
  max-width: ${px2rem(1200)};
  height: 100%;
  margin: 0 auto;
  padding-top: ${px2rem(80)};
  position: relative;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding-top: ${px2rem(40)};
  }
`;

const LayoutBox = styled.div`
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(12)};
  }
`;

const MainTitle = styled.div`
  font-weight: 500;
  color: #fff;
  text-align: center;
  font-size: ${px2rem(38)};
  line-height: ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(18)};
    line-height: ${px2rem(18)};
  }
`;

const Divider = styled.div`
  margin: ${px2rem(8)} auto 0;
  width: ${px2rem(40)};
  height: ${px2rem(4)};
  background: ${(props) => props.theme.colors.primary};
`;

const IntroBox = styled.div`
  animation: ${fadeIn} 0.5s;
  display: ${(props) => (props.active ? 'block' : 'none')};
  ${(props) => props.theme.breakpoints.down('lg')} {
    text-align: center;
  }
`;

const IntroPeriod = styled.div`
  font-size: ${px2rem(24)};
  line-height: ${px2rem(17)};
  font-weight: 500;
  color: #fff;
  margin-top: ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(12)};
  }
`;

const IntroScore = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(28)};
  margin-top: ${px2rem(12)};

  & b {
    font-weight: 400;
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(20)};
  }
`;

const ImageBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Bg = styled.div`
  height: ${px2rem(174)};
  background: url(${WayImg}) no-repeat center top;
  background-size: cover;
`;

const PeriodBox = styled(LayoutBox)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translateX(-50%);
`;

const Period = styled.div`
  max-width: ${px2rem(1200)};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  margin: auto;
`;

const StyledPointer = styled(Pointer)`
  z-index: 1;
  position: absolute;
  left: 0;
  top: ${px2rem(450)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    left: 50%;
    transform: translateX(-50%);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    top: ${px2rem(380)};
  }
`;

const Banner5 = () => {
  const [activeId, setActiveId] = useState(initialItem.id);
  useLocale();
  const activeItem = useMemo(() => periodData.find((item) => item.id === activeId), [activeId]);

  const handleClickPeriod = useCallback(
    (id) => {
      setActiveId(id);
    },
    [setActiveId],
  );

  const handleNext = useCallback(() => {
    const _id = activeId < total - 1 ? activeId + 1 : 0;
    setActiveId(_id);
  }, [activeId, setActiveId]);

  const handlePre = useCallback(() => {
    const _id = activeId > 0 ? activeId - 1 : total - 1;
    setActiveId(_id);
  }, [activeId, setActiveId]);

  const translateX = `${(-1 / 24) * 100}%`;

  const width = `${100 + (1 / 12) * 100}%`;

  return (
    <Wrapper data-inspector="about_us_road_map" className="wow fadeInUp">
      <ImageBox>
        <Bg />
        <PeriodBox>
          <Period
            style={{
              width: width,
              transform: `translateX(${translateX})`,
            }}
          >
            {_.map(periodData, (item, idx) => (
              <PeriodItem
                key={idx}
                id={item.id}
                activeId={activeId}
                onClickPeriod={handleClickPeriod}
                {...item}
              />
            ))}
          </Period>
        </PeriodBox>
      </ImageBox>
      <LayoutBox>
        <MainBox>
          <MainTitle>{_t('aboutus.trend.title')}</MainTitle>
          <Divider />
          {/* 遍历试为了切换动画 */}
          {_.map(periodData, (item) => (
            <IntroBox active={item.id === activeId} key={item.id}>
              <IntroPeriod>{activeItem.peroid}</IntroPeriod>
              <IntroScore>{_tHTML(activeItem.text)}</IntroScore>
            </IntroBox>
          ))}
          <StyledPointer
            current={activeId + 1}
            total={total}
            onNext={handleNext}
            onPre={handlePre}
          />
        </MainBox>
      </LayoutBox>
    </Wrapper>
  );
};

export default Banner5;
