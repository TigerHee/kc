/**
 * Owner: willen@kupotech.com
 */
import React, { useState } from 'react';
import { styled } from '@kufox/mui';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { LayoutBox, Content } from './StyledComps';
import { RightOutlined, LeftOutlined } from '@kufox/icons';

const jobs = [
  {
    title: 'Associate/VP/Director',
    desc: [],
    qs: [
      `1. A motivated self-starter with a passion for crypto (industry experience is preferred), along with an understanding of DeFi, NFT, the metaverse, Web 3.0, and other key components of crypto industry. The candidate should be extremely analytical and articulate. `,
      `2. Ability to participate in the fund’s global investment and M&A operations, joining the board of invested entities if required. `,
      `3. Work experience in crypto investment or consulting/CDD/Internet enterprise strategy or investment. `,
      `4. Excellent verbal and written communication skills in English (an international background is preferred). `,
    ],
  },
  {
    title: 'Associate – Technical',
    desc: [
      `1.  Conduct in-depth crypto industry/market research, along with technical-level information searching in all stages. `,
      `2. Research and analyze projects at the technical level (e.g., ZK, layer2, cross-chain). `,
      `3. Build relationship with developers in the crypto industry. `,
    ],
    qs: [
      `1. Developing experience in crypto related projects . `,
      `2. Education in computer science, financial engineering, statistics, quantitative economics, financial mathematics, applied mathematics, physics, or other related majors (master's degree or above is preferred). `,
      `3. An interest and at least 2 years of experience in the blockchain and crypto industry. `,
      `4. The candidate should be technology and research driven. `,
    ],
  },
  {
    title: 'Asset Evaluation – Intern ',
    desc: [
      `1. Collect industry data (including but not limited to on-chain and off-chain data) required to provide theoretical support for modelling analysis. `,
      `2. Research and analyze the relevant markets of the blockchain industry. Conduct analysis in specific areas, such as project feasibility, economic model analysis, etc. `,
      `3. Track investment institutions inside and outside industry, capturing value points and hot spots. `,
      `4. Track analyzed projects in areas such as financing, product updates, and regular updates in all dimensions. `,
    ],
    qs: [
      `1. Education in computer science, financial engineering, statistics, quantitative economics, financial mathematics, applied mathematics, physics, or other related majors (master's degree or above is preferred). `,
      `2. An interest in the blockchain and crypto industry with independent investment value judgment theories (background in data analysis is preferred). `,
      `3. Excellent verbal and written communication skills in English (an international background is preferred). `,
    ],
  },
];

const Title = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 48px;
  line-height: 72px;
  margin-bottom: 40px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 32px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-bottom: 24px;
    font-size: 20px;
    line-height: 24px;
  }
`;

const SliderItem = styled.div`
  h2 {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 32px;
    line-height: 24px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      font-size: 20px;
      line-height: 24px;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: 16px;
      line-height: 24px;
    }
  }
  h3 {
    margin-top: 32px;
    margin-bottom: 16px;
    color: ${(props) => props.theme.colors.text};
    font-size: 24px;
    line-height: 24px;
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-bottom: 8px;
      font-size: 16px;
    }
  }
  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    line-height: 28px;
    ${(props) => props.theme.breakpoints.down('md')} {
      font-size: 12px;
      line-height: 18px;
    }
  }
`;

const SliderBox = styled.div`
  margin-top: 100px;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 48px;
  }
`;

const PrevButton = styled.div`
  width: 60px;
  height: 54px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  border: 1px solid #5b5b5b;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 36px;
    height: 32px;
  }
`;

const NextButton = styled(PrevButton)`
  border-left: none;
`;
const ButtonGroup = styled.div`
  [dir='rtl'] & {
    display: inline-flex;
    flex-direction: row-reverse;
  }
`;

const Dots = styled.ul`
  padding: 0;
  display: flex;
  align-items: center;
  margin-top: 20px;
  li {
    margin: 0 4px;
    .dot-item {
      display: inline-block;
      width: 8px;
      height: 8px;
      border: 1px solid #5b5b5b;
      border-radius: 100%;
    }
    &.slick-active {
      .dot-item {
        background: ${(props) => props.theme.colors.primary};
        border: none;
      }
    }
  }
`;

export default () => {
  const slickRef = React.useRef();
  const [slide, updateSlide] = useState(0);

  const handleChange = (slide) => {
    updateSlide(slide);
  };
  const settings = {
    dots: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
  };

  const prev = () => {
    if (slickRef && slickRef.current && slickRef.current.slickPrev) {
      slickRef.current.slickPrev();
    }
  };

  const next = () => {
    if (slickRef && slickRef.current && slickRef.current.slickNext) {
      slickRef.current.slickNext();
    }
  };
  return (
    <SliderBox className="wow fadeInUp">
      <LayoutBox>
        <Content style={{ overflow: 'hidden' }}>
          <Title>
            <span>Opportunities</span>
            <ButtonGroup>
              <PrevButton onClick={prev}>
                <LeftOutlined size={24} />
              </PrevButton>
              <NextButton onClick={next}>
                <RightOutlined size={24} />
              </NextButton>
            </ButtonGroup>
          </Title>
          <Slider {...settings} afterChange={handleChange} ref={slickRef}>
            {jobs.map(({ title, desc, qs }, idx) => {
              return (
                <div key={idx}>
                  <SliderItem>
                    <h2>{title}</h2>
                    {desc.length ? <h3>Job Description</h3> : null}
                    {desc.map((v, index) => {
                      return <p key={index}>{v}</p>;
                    })}
                    <h3>Qualifications</h3>
                    {qs.map((v, index) => {
                      return <p key={index}>{v}</p>;
                    })}
                  </SliderItem>
                </div>
              );
            })}
          </Slider>
          <Dots>
            <li className={slide === 0 ? 'slick-active' : null}>
              <div className="dot-item" />
            </li>
            <li className={slide === 1 ? 'slick-active' : null}>
              <div className="dot-item" />
            </li>
            <li className={slide === 2 ? 'slick-active' : null}>
              <div className="dot-item" />
            </li>
          </Dots>
        </Content>
      </LayoutBox>
    </SliderBox>
  );
};
