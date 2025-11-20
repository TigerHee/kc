import { styled } from '@kux/mui/emotion';
import bannerPcImg from 'assets/communityCollect/banner/banner-1680-x2.png';
import bannerH5Img from 'assets/communityCollect/banner/banner-375-x3.png';
import bannerHintPadImg from 'assets/communityCollect/banner/banner-hint-768-x3.png';
import bannerHintH5Img from 'assets/communityCollect/banner/banner-hint-375-x3.png';
import { useKuxMediaQuery, useRTL } from 'src/hooks';
import { useEffect } from 'react';
import { trackConfig, useCommunityTrack } from 'components/$/CommunityCollect/hooks/useCommunityTrack';

/**
 * Owner: lucas.l.lu@kupotech.com
 */
export const StyledBanner = styled.div`
  & {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: ${({ theme }) => theme.colors.cover};
    background-size: cover;
    background-image: url(${bannerPcImg});

    &.rtl {
      .hint {
        left: 50px;
        right: auto;
      }
    }

    .main {
      position: relative;
      width: 1200px;
      margin: 0 auto;
      transition: all 0.3s ease;
    }

    .main-content {
      max-width: 70%;
    }

    .title {
      max-width: 100%;
      word-break: break-word;
      color: ${({ theme }) => theme.colors.textEmphasis};
      font-size: 36px;
      font-weight: 600;
      margin: 0 0 8px;
      line-height: 130%;

      .green {
        color: ${({ theme }) => theme.colors.textPrimary};
      }
    }

    .subtitle {
      margin: 0;
      color: ${({ theme }) => theme.colors.textEmphasis};
      opacity: 0.4;
      font-size: 16px;
      font-weight: 400;
      line-height: 130%;
    }

    .hint {
      position: absolute;
      top: 50%;
      right: 50px;
      transform: translate3d(0, -50%, 0);
    }

    .hint-img {
      max-width: 132px;
      height: auto;
      vertical-align: middle;
      transition: all 0.3s ease;
    }
  }

  ${(props) => props.theme.breakpoints.down('xl')} {
    & {
      .main {
        padding: 0 32px;
      }
    }
  }

  ${({ theme }) => theme.breakpoints.down('lg')} {
    & {
      .main {
        max-width: 100%;
        transition: all 0.3s ease;
      }
      .hint-img {
        max-width: 152px;
        transition: all 0.3s ease;
      }
    }
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    & {
      padding: 24px 0 44px;
      background-image: url(${bannerH5Img});

      .main {
        padding: 0 16px;
        transition: all 0.3s ease;
      }

      .title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }

      .hint {
        top: 50%;
        right: 16px;
      }

      &.rtl {
        .hint {
          left: 16px;
          right: auto;
        }
      }

      .hint-img {
        max-width: 110px;
        transition: all 0.3s ease;
      }
    }
  }
`;

function useBannerHintImage() {
  const { downSm } = useKuxMediaQuery();

  if (downSm) {
    return bannerHintH5Img;
  }

  return bannerHintPadImg;
}

export function Banner(props) {
  const { title, subtitle } = props;
  const isRTL = useRTL();
  const hintImage = useBannerHintImage();
  const { trackExpose } = useCommunityTrack();

  useEffect(() => {
    trackExpose({
      blockId: trackConfig.exposeKeys.banner,
    });
  }, []);

  return (
    <StyledBanner className={`${isRTL ? 'rtl' : ''}`}>
      <div className="main">
        <div className="main-content">
          <h2 className="title" inspector="title">{title}</h2>
          <h3 className="subtitle" inspector="sub_title">{subtitle}</h3>
        </div>
        <div className="hint">
          <img className="hint-img" src={hintImage} alt="图片" />
        </div>
      </div>
    </StyledBanner>
  );
}
