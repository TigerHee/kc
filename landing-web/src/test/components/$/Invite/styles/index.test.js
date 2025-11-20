/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  StyledUserIcon,
  StyledEmptyUserIcon,
  StyledXIcon,
  StyledKCIcon,
  Row,
  IconWrapper,
  Named,
  Wrapper,
  ContentWrapper,
  Container,
  BrandWrapper,
  Title,
  Desc,
  RegisterBtn,
  RewardsWrapper,
  RewardsContent,
  RewardsInfoWrapper,
  MainCouponCard,
  LotteryCouponCard,
  LotteryWrapper,
  Tag,
  SliderWrapper,
  CouponBox,
} from 'src/components/$/Invite/styles/index.js';

jest.mock('@kufox/mui', () => {
  return {
    __esModule: true,
    Button: () => null,
  };
});
jest.mock('assets/invite/content/user.svg', () => {
  return {
    ReactComponent: () => null,
  };
});
jest.mock('assets/invite/content/empty-user.svg', () => {
  return {
    ReactComponent: () => null,
  };
});
jest.mock('assets/invite/content/kucoin.svg', () => {
  return {
    ReactComponent: () => null,
  };
});
jest.mock('assets/invite/content/x.svg', () => {
  return {
    ReactComponent: () => null,
  };
});
jest.mock('helper', () => {
  return {
    getIsAndroid: () => false,
  };
});

const theme = {
  colors: { text: '#333333' },
  breakpoints: {
    down: () => {},
  },
};

describe('Invite styles', () => {
  it('renders the StyledUserIcon', () => {
    const { container } = render(<StyledUserIcon>Test StyledUserIcon</StyledUserIcon>);
    expect(container).toBeInTheDocument();
  });

  it('renders the StyledEmptyUserIcon', () => {
    const { container } = render(
      <StyledEmptyUserIcon>Test StyledEmptyUserIcon</StyledEmptyUserIcon>,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders the StyledXIcon', () => {
    const { container } = render(<StyledXIcon>Test StyledXIcon</StyledXIcon>);
    expect(container).toBeInTheDocument();
  });

  it('renders the StyledKCIcon', () => {
    const { container } = render(<StyledKCIcon>Test StyledKCIcon</StyledKCIcon>);
    expect(container).toBeInTheDocument();
  });

  it('renders the Row between true', () => {
    render(<Row between={true}>Test Row</Row>);
    const row = screen.getByText('Test Row');
    expect(row).toHaveStyle('justify-content: space-between; margin-top: 4px;');
  });

  it('renders the Row between false', () => {
    render(<Row between={false}>Test Row</Row>);
    const row = screen.getByText('Test Row');
    expect(row).toHaveStyle('justify-content: center; margin-top: 0;');
  });

  it('renders the IconWrapper', () => {
    render(<IconWrapper>Test IconWrapper</IconWrapper>);
    const iconWrapper = screen.getByText('Test IconWrapper');
    expect(iconWrapper).toHaveStyle('display: flex; justify-content: center;');
  });

  it('renders the Named user true', () => {
    render(
      <Named theme={theme} user={true}>
        Test Named
      </Named>,
    );
    const named = screen.getByText('Test Named');
    expect(named).toHaveStyle('line-height: 100%; color: #333333;');
  });

  it('renders the Named user false', () => {
    render(
      <Named theme={theme} user={false}>
        Test Named
      </Named>,
    );
    const named = screen.getByText('Test Named');
    expect(named).toHaveStyle('line-height: 130%; color: #333333;');
  });

  it('renders the Wrapper', () => {
    render(<Wrapper>Test Wrapper</Wrapper>);
    const wrapper = screen.getByText('Test Wrapper');
    expect(wrapper).toHaveStyle('height: 100%;');
  });

  it('renders the ContentWrapper', () => {
    render(<ContentWrapper theme={theme}>Test ContentWrapper</ContentWrapper>);
    const contentWrapper = screen.getByText('Test ContentWrapper');
    expect(contentWrapper).toHaveStyle('margin: 0 auto;');
  });

  it('renders the Container isInApp true', () => {
    render(<Container isInApp={true}>Test Container</Container>);
    const container = screen.getByText('Test Container');
    expect(container).toBeInTheDocument();
  });

  it('renders the Container isInApp false', () => {
    render(<Container isInApp={false}>Test Container</Container>);
    const container = screen.getByText('Test Container');
    expect(container).toBeInTheDocument();
  });

  it('renders the BrandWrapper', () => {
    render(<BrandWrapper isInApp={false}>Test BrandWrapper</BrandWrapper>);
    const brandWrapper = screen.getByText('Test BrandWrapper');
    expect(brandWrapper).toHaveStyle('position: relative;');
  });

  it('renders the Title', () => {
    render(<Title theme={theme}>Test Title</Title>);
    const title = screen.getByText('Test Title');
    expect(title).toHaveStyle('color: #333333;');
  });

  it('renders the Desc', () => {
    render(<Desc>Test Desc</Desc>);
    const desc = screen.getByText('Test Desc');
    expect(desc).toHaveStyle('margin: 14px auto 0px auto;');
  });

  it('renders the RegisterBtn', () => {
    const { container } = render(<RegisterBtn theme={theme}>Test RegisterBtn</RegisterBtn>);
    expect(container).toBeInTheDocument();
  });

  it('renders the RewardsWrapper', () => {
    render(<RewardsWrapper>Test RewardsWrapper</RewardsWrapper>);
    const rewardsWrapper = screen.getByText('Test RewardsWrapper');
    expect(rewardsWrapper).toHaveStyle('border-top-left-radius: 135px;');
  });

  it('renders the RewardsContent', () => {
    render(<RewardsContent>Test RewardsContent</RewardsContent>);
    const rewardsContent = screen.getByText('Test RewardsContent');
    expect(rewardsContent).toHaveStyle('display: flex;');
  });

  it('renders the RewardsInfoWrapper isHidden true', () => {
    render(<RewardsInfoWrapper isHidden={true}>Test RewardsInfoWrapper</RewardsInfoWrapper>);
    const rewardsInfoWrapper = screen.getByText('Test RewardsInfoWrapper');
    expect(rewardsInfoWrapper).toHaveStyle('opacity: 0;');
  });

  it('renders the RewardsInfoWrapper isHidden false', () => {
    render(<RewardsInfoWrapper isHidden={false}>Test RewardsInfoWrapper</RewardsInfoWrapper>);
    const rewardsInfoWrapper = screen.getByText('Test RewardsInfoWrapper');
    expect(rewardsInfoWrapper).toHaveStyle('opacity: 1;');
  });

  it('renders the MainCouponCard', () => {
    render(<MainCouponCard>Test MainCouponCard</MainCouponCard>);
    const mainCouponCard = screen.getByText('Test MainCouponCard');
    expect(mainCouponCard).toHaveStyle('position: relative;');
  });

  it('renders the LotteryCouponCard', () => {
    render(<LotteryCouponCard>Test LotteryCouponCard</LotteryCouponCard>);
    const element = screen.getByText('Test LotteryCouponCard');
    expect(element).toHaveStyle('position: relative;');
  });

  it('renders the LotteryWrapper', () => {
    render(<LotteryWrapper>Test LotteryWrapper</LotteryWrapper>);
    const element = screen.getByText('Test LotteryWrapper');
    expect(element).toHaveStyle('margin-top: 22px;');
  });

  it('renders the Tag lottery true', () => {
    render(
      <Tag theme={theme} lottery={true}>
        Test Tag
      </Tag>,
    );
    const element = screen.getByText('Test Tag');
    expect(element).toHaveStyle('background: #2DE6BA; color: #333333;');
  });

  it('renders the Tag lottery false', () => {
    render(
      <Tag theme={theme} lottery={false}>
        Test Tag
      </Tag>,
    );
    const element = screen.getByText('Test Tag');
    expect(element).toHaveStyle('background: #FFE145; color: #333333;');
  });

  it('renders the SliderWrapper isLotteryEmpty true', () => {
    render(<SliderWrapper isLotteryEmpty={true}>Test SliderWrapper</SliderWrapper>);
    const element = screen.getByText('Test SliderWrapper');
    expect(element).toHaveStyle('display: inline-flex;');
  });

  it('renders the SliderWrapper isLotteryEmpty false', () => {
    render(<SliderWrapper isLotteryEmpty={false}>Test SliderWrapper</SliderWrapper>);
    const element = screen.getByText('Test SliderWrapper');
    expect(element).toHaveStyle('animation: moveAnimation 10s linear infinite;');
  });

  it('renders the CouponBox', () => {
    render(<CouponBox>Test CouponBox</CouponBox>);
    const element = screen.getByText('Test CouponBox');
    expect(element).toHaveStyle('margin: 0 30px;');
  });
});
