/**
 * Owner: jessie@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import LazyImg from 'src/components/common/LazyImg';
import { _t } from 'src/tools/i18n';
import FireIcon from 'static/rocket_zone/fire.gif';

const StyledCoinInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    flex-direction: row;
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CoinWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 40px;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    img {
      width: 56px;
      height: 56px;
      border-radius: 56px;
    }
  }

  ${(props) => props.theme.breakpoints.up('lg')} {
    img {
      width: 64px;
      height: 64px;
      border-radius: 64px;
    }
  }
`;

const IntroWrapper = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  margin-left: 40px;
  flex: 1;
  color: ${(props) => props.theme.colors.text40};
  word-break: break-all;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  ${(props) => props.theme.breakpoints.up('lg')} {
    margin-top: 12px;
    margin-left: 0px;
  }
`;

const NameInfoWrapper = styled.div`
  margin-left: 12px;
  .nameWrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    .name {
      color: ${(props) => props.theme.colors.text};
      font-weight: 600;
      font-size: 16px;
      font-style: normal;
      line-height: 130%;
    }
    .mark {
      margin-left: 4px;
    }
    .fireIcon {
      width: 20px;
      height: 20px;
    }
    .newIcon {
      padding: 2px 4px;
      color: ${(props) => props.theme.colors.primary};
      font-weight: 500;
      font-size: 12px;
      font-style: normal;
      line-height: 130%;
      background: ${(props) => props.theme.colors.primary8};
      border-radius: 4px;
    }
  }
  .fullName {
    margin-left: 4px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    margin-left: 20px;
    .nameWrapper {
      .name {
        font-weight: 700;
        font-size: 24px;
      }

      .mark {
        margin-left: 2px;
      }
      .fireIcon {
        width: 24px;
        height: 24px;
      }
    }
    .fullName {
      margin-top: 2px;
      margin-left: 0;
      font-size: 14px;
    }
  }
`;

const TABICONS = {
  New: <span className="newIcon">{_t('09e3bc749d994000a222')}</span>,
  Hot: <LazyImg src={FireIcon} alt="fire" className="fireIcon" />,
};

export default function CoinInfo({ logo, fullName, shortName, introDetail, displayLabel }) {
  const { sm } = useResponsive();

  return (
    <StyledCoinInfo>
      <CoinWrapper>
        <LazyImg src={`${logo}?d=160x160`} alt="logo" />
        <NameInfoWrapper>
          <div className="nameWrapper">
            <span className="name">{shortName}</span>
            {!sm && <span className="fullName">{fullName}</span>}
            {displayLabel && TABICONS[displayLabel] && (
              <span className="mark">{TABICONS[displayLabel]}</span>
            )}
          </div>
          {sm && <div className="fullName">{fullName}</div>}
        </NameInfoWrapper>
      </CoinWrapper>
      {sm && introDetail && <IntroWrapper>{introDetail}</IntroWrapper>}
    </StyledCoinInfo>
  );
}
