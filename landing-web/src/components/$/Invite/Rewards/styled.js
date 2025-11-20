/**
 * Owner: terry@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';


export const CouponWrapper = styled.div`
  margin-top: ${({ topMargin }) => topMargin ? '22px' : 0};
  display: flex;
  flex-direction: column;
  align-items: center;
  &:not(:first-of-type) {
    margin-left: ${({ main }) => main ? 0 : '8px'};
  }
  .title {
    width: 110px;
    height: 54px;
    margin-bottom: 0;
    background: ${({ main }) => {
      if (main) return 'linear-gradient(180deg, #FFFFFF 0%, #FBF8E7 100%)';
      return 'linear-gradient(180deg, #FFFFFF 0%, #D2F1F3 100%)';
    }};
    border-radius: 4.55704px;
    border-radius: 4.5px;
    position: relative;
    &::before,&::after{
        position: absolute;
        content: ' ';
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${({ main }) => {
          if (main) return '#F1E290';
          return '#B7E1E3';
        }};
      }
      &::before {
        left: 8.5px;
        top: 20px;
      }
      &::after {
        right: 8.5px;
        top: 20px;
      }
    .content {
      display: flex;
      justify-content: center;
      margin-bottom: 0;
      text-align: center;
      position: relative;
      text-align: center;
      align-items: center;
      min-height: 40px;
      > span {
        font-family: 'Roboto';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 100%;
        word-break: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        color: ${props => props.theme.colors.text};
        max-width: 80%;
      }
    }
  }

  .flag {
    position: relative;
    width: 92.5px;
    height: 44.5px;
    margin: 0 auto;
    margin-top: -14px;
  }
  .shape {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: -34px;
    width: 118px;
    height: 117px;
    z-index: 1;
    background-image: ${props => `url(${props.shape})`};
  }
  .btn {
    position: relative;
    margin-top: -30px;
    width: 124px;
    height: 65px;
    background-image: ${props => `url(${props.btn})`};
  }
  .btn-title {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    > span {
      text-align: center;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      /* autoprefixer: off */
      -webkit-line-clamp: 2;
      font-family: 'Roboto';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 130%;
      color: ${props => props.theme.colors.text};
    }
  }
  .left {
    width: 34px;
    height: 34px;
    position: absolute;
    top: 21px;
    left: 6px;
    object-fit: none;
  }
  .right {
    width: 75px;
    height: 75px;
    position: absolute;
    right: -17px;
    top: 43px;
    object-fit: none;
  }
  .main {
    width: 76px;
    height: 76px;
    object-fit: contain;
    border-radius: 50%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${({ topMargin }) => topMargin ? '12px' : 0};
  }
`;

export const GoBtn = styled.div`
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(96, 197, 161, 0.32);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: ${({ isNext }) => isNext ? '10px' : 0};
  margin-right: ${({ isNext }) => isNext ? '0' : '10px'};
  ${props => !props.isNext && `
    transform: rotate(180deg);
  `}
  &:hover {
    background: rgba(96, 197, 161, 0.5);
  }
  > svg {
    width: 24px;
    height: 24px;
    opacity: ${({ disabled }) => disabled ? '.3' : '1'};
  }
`;



export const MarqueeWrapper = styled.section`
  display: block;
  white-space: nowrap;
  width: fit-content;
  height: 100%;
  position: absolute;
  .highlight1, strong {
    color: rgba(0, 13, 29, 0.68);
    font-weight: 500;
  }
  strong + span {
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
  }
  opacity: ${({ scrollX }) => scrollX === -1 ? 0 : 1};
  ${props => props.scrollX > 0 && `
    animation: ${Math.floor(props.scrollX*1000/60)}ms move linear infinite normal;
    animation-delay: 1s;
    backface-visibility: hidden;
    animation-play-state: running;
  `}
  &:hover {
    animation-play-state: paused;
  }
  [dir='rtl'] & {
    ${props => props.scrollX > 0 && `
      animation: ${Math.floor(props.scrollX*1000/60)}ms move2 linear infinite normal;
    `}
  }
  @keyframes move {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(-50%, 0, 0);
    }
  }
  @keyframes move2 {
    0% {
      transform: translate3d(0, 0, 0);
    }
    100% {
      transform: translate3d(50%, 0, 0);
    }
  }
`;

export const MarqueeItem = styled.span`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 36px;
  color: ${props => props.theme.colors.text40};
  margin-right: 40px;
  padding-left: ${props => props.first ? '12px' : 0};
`;
