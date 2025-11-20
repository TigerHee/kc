/**
 * Owner: jessie@kupotech.com
 */
import { Carousel, styled, useResponsive } from '@kux/mui';
import { chunk } from 'components/RocketZone/utils';
import { memo, useMemo, useRef } from 'react';
import GemSlotItem from './Item';

const StyledCampaign = styled.div`
  margin-top: 24px;
  padding-bottom: 20px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-top: 24px;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 32px;
  }
`;

const StyledCarousel = styled(Carousel)`
  .kux-slick-track {
    transition: transform 0ms;
    will-change: transform, transition;

    .kux-slick-slide {
      direction: ltr;
    }
  }
  .kux-slick-arrow {
    display: none;
  }
  .kux-slick-dots {
    bottom: -16px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    ${(props) => props.theme.breakpoints.up('sm')} {
      bottom: -20px;
    }

    .kux-slick-item {
      width: 4px;
      height: 4px;
      &.kux-slick-active {
        ${(props) => props.theme.breakpoints.up('sm')} {
          width: 16px;
        }
      }
    }
  }

  .campaign-slide {
    display: flex;
    width: 100%;
  }
`;

const CampaignCarousel = memo(({ data }) => {
  const sliderRef = useRef();

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    //rtl: true,
  };

  return (
    <StyledCarousel {...settings}>
      {data.map((items, index) => (
        <div key={`campaign_${index}`}>
          <div className="campaign-slide">
            {items.map((item, _index) => {
              if (item) {
                return <GemSlotItem {...item} key={item.id} />;
              }
            })}
          </div>
        </div>
      ))}
    </StyledCarousel>
  );
});

function Campaign({ details }) {
  const { lg, sm } = useResponsive();

  const showItemCount = useMemo(() => {
    if (lg) {
      return 3;
    } else if (!sm) {
      return 1;
    } else {
      return 2;
    }
  }, [lg, sm]);

  const data = useMemo(() => {
    return chunk(details, showItemCount);
  }, [details, showItemCount]);

  return (
    <StyledCampaign>
      <CampaignCarousel data={data} />
    </StyledCampaign>
  );
}

export default memo(Campaign);
