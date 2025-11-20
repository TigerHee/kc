/**
 * Owner: vijay@kupotech.com
 */
import { useRef } from 'react';
import { Avatar, Divider, styled, useResponsive, isPropValid, Carousel, Tooltip } from '@kux/mui';
import { useLang } from '../../hookTool';
import { getUserFlag, getUserNickname } from '../../common/tools';

const Container = styled.div`
  padding: ${({ isH5 }) => (isH5 ? '16px' : '32px 24px 36px')};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: ${({ isH5 }) => (isH5 ? '40px' : '48px')};

  & .KuxAvatar-root {
    background-color: #d9d9d9;
    border: none;
  }
`;

const LayoutTop = styled.div`
  display: flex;
  gap: ${({ isH5 }) => (isH5 ? '0 12px' : '0 24px')};
`;

const UserFlag = styled('span', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme, isH5 }) => {
  return {
    width: isH5 ? '41px' : '80px',
    height: isH5 ? '41px' : '80px',
    borderRadius: '50%',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: isH5 ? '16px' : '32px',
    lineHeight: '130%',
    flexShrink: 0,
    color: theme.colors.text,
    border: `2px solid ${theme.colors.cover16}`,
  };
});

const LayoutRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ isH5 }) => (isH5 ? '2px' : '10px')} 0;
  justify-content: center;
  flex: 1;
`;
const Nickname = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ isH5 }) => (isH5 ? '14px' : '24px')};
  font-weight: 500;
  line-height: 140%;
`;
const RCode = styled.div`
  margin-top: ${({ isH5 }) => (isH5 ? '2px' : '4px')};
  color: ${({ theme }) => theme.colors.text60};
  font-size: ${({ isH5 }) => (isH5 ? '12px' : '14px')};
  font-weight: 400;
  line-height: 140%;
`;
const Message = styled.div`
  margin-top: 10px;
  margin-bottom: 32px;
  width: 380px;
  word-wrap: break-word;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.cover4};
  padding: 15px 16px;

  /* Shadows/light */
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 0 1px 0 rgba(0, 0, 0, 0.04);

  color: ${({ theme }) => theme.colors.text60};
  /* KuFox Sans/16px/Regular */
  font-family: 'KuFox Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
`;
const H5Message = styled(Message)`
  width: 100%;
  font-size: 12px;
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 8px;
`;

const DividerLine = styled(Divider)`
  margin: 0;
`;

const LayoutBottom = styled.div`
  margin-top: 24px;
  .campaigns-title {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
    font-weight: 700;
    line-height: 140%;
  }
  .campaigns-list {
    display: flex;
    flex-direction: column;
  }
  .campaigns-item {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin-top: 24px;

    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 19.6px */

    &-icon {
      color: ${({ theme }) => theme.colors.text};
      margin-right: 8px;
      height: 16px;
      display: flex;
      padding: 1px 4px;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      border-radius: 8px 8px 8px 0;
      background: linear-gradient(276deg, #7ffca7 0.89%, #aaff8d 97.34%);
      font-size: 10px;
      font-weight: 700;
    }

    &-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 380px;
      word-wrap: break-word;
    }

    &-title {
      color: ${({ theme }) => theme.colors.text};
      font-size: 16px;
    }

    &-desc {
      color: ${({ theme }) => theme.colors.text40};
      font-size: 14px;
    }
  }

  ${(props) =>
    props.isH5 &&
    `
      margin-top: 12px;
      .campaigns-title {
        color: ${props.theme.colors.text40};
        font-size: 12px;
        font-weight: 400;
        line-height: 140%;
      }
      .campaigns-list {
        padding-bottom: 12px;
        .kux-slick-dots {
          bottom: -16px;

          .kux-slick-item {
            width: 4px;
            height: 4px;
            border-radius: 50%;
          }

          .kux-slick-active {
            background: ${props.theme.colors.text};
          }
        }
      }

      .campaigns-item {
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        margin-top: 12px;

        &-icon {
          align-self: flex-start;
        }

        &-content {
          width: 100%;
          margin-top: 6px;
        }

        &-title, &-desc {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-style: normal;
          font-weight: 400;
          line-height: 140%;
        }
        &-title {
          font-size: 14px;
        }
        &-desc {
          height: 17px;
          font-size: 12px;
        }
      }
    `}
`;

const Tag = styled.div`
  padding: 5px 12px;
  border-radius: 0 12px 0 12px;
  border-radius: 0px 12px;
  background: linear-gradient(103deg, #48d800 1.93%, #00b98a 98.71%);
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.textEmphasis};
  font-size: 11px;
  font-weight: 500;
  line-height: 130%;
`;

function Campaign({ campaign, _t, isH5 }) {
  return (
    <div className="campaigns-item">
      <div className="campaigns-item-icon">{_t('d7f73574d8024000a5bf')}</div>
      <div className="campaigns-item-content">
        {isH5 ? (
          <>
            <Tooltip trigger="click" title={campaign.title} placement="top">
              <div className="campaigns-item-title">{campaign.title}</div>
            </Tooltip>
            <Tooltip trigger="click" title={campaign.desc} placement="top">
              <div className="campaigns-item-desc">{campaign.desc}</div>
            </Tooltip>
          </>
        ) : (
          <>
            <div className="campaigns-item-title">{campaign.title}</div>
            <div className="campaigns-item-desc">{campaign.desc}</div>
          </>
        )}
      </div>
    </div>
  );
}

export function InviterCard({ inviterInfo }) {
  const { t: _t } = useLang();
  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const sliderRef = useRef();

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false, // 切换箭头
    vertical: false, // 垂直切换
    adaptiveHeight: true, // 自适应高度
  };

  return inviterInfo ? (
    <Container isH5={isH5}>
      <LayoutTop isH5={isH5}>
        <div>
          {inviterInfo.avatar ? (
            <Avatar src={inviterInfo.avatar} size={isH5 ? 41 : 80} />
          ) : (
            <UserFlag isH5={isH5}>{getUserFlag(inviterInfo)}</UserFlag>
          )}
        </div>
        <LayoutRight isH5={isH5}>
          <Nickname isH5={isH5}>{getUserNickname(inviterInfo)}</Nickname>
          <RCode isH5={isH5}>
            {_t('b92d97fd317c4000afe2')}&nbsp;
            {inviterInfo.rcode}
          </RCode>
          {isH5 ? null : <Message>{inviterInfo.message}</Message>}
        </LayoutRight>
      </LayoutTop>
      {isH5 && <H5Message>{inviterInfo.message}</H5Message>}
      <DividerLine />
      {inviterInfo.campaigns ? (
        <LayoutBottom isH5={isH5}>
          <div className="campaigns-title">
            {_t('2a73b72f3e914800a6bc', { nickName: getUserNickname(inviterInfo) })}
          </div>
          <div className="campaigns-list">
            {isH5 ? (
              <Carousel {...settings}>
                {inviterInfo.campaigns.map((campaign) => (
                  <Campaign isH5={isH5} key={campaign.id} campaign={campaign} _t={_t} />
                ))}
              </Carousel>
            ) : (
              inviterInfo.campaigns.map((campaign) => (
                <Campaign isH5={isH5} key={campaign.id} campaign={campaign} _t={_t} />
              ))
            )}
          </div>
        </LayoutBottom>
      ) : null}
      {inviterInfo.cashbackRatio ? <Tag>{inviterInfo.cashbackRatioText}</Tag> : null}
    </Container>
  ) : null;
}
