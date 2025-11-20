/**
 * Owner: chris@kupotech.com
 */

import { styled } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
// import { CurveLine } from './Slide';

const CurveLine = ({ className = '', width }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="21"
      viewBox={`0 0 ${width} 21`}
      fill="none"
    >
      <path
        opacity="0.2"
        d={`M${width} 19.2176C${(333 * width) / 375} 8.18823 ${(264 * width) / 375} 1 ${
          (187 * width) / 375
        } 1C${(110 * width) / 375} 1 ${(42 * width) / 375} 8.07488 0.199219 18.9564`}
        stroke="url(#paint0_linear_1805_8650)"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1805_8650"
          x1="4.79687"
          y1="19"
          x2="375.797"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1B1B1B" />
          <stop offset="0.51" stopColor="#363636" />
          <stop offset="1" stopColor="#1B1B1B" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Container = styled.div`
  position: fixed;
  background: #121212;
  width: 100vw;
  top: 0px;
  padding-top: calc(44px + env(safe-area-inset-top, 0px));
  .g-skeleton-item {
    width: 100%;
    background-color: ${({ theme }) => theme.colors.cover4};
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;
  }

  .levelHeader {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: center;
    height: 6.53333vw;
    height: 21px;
    margin-top: 26px;
  }
  .levelCon {
    position: absolute;
    bottom: 0px;
    left: 42%;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    width: 84.8vw;
  }

  .textSquare {
    width: 75px;
    height: 20px;
    margin-bottom: 5px;
    background: ${({ theme }) => theme.colors.cover4};
    border-radius: 4px;
  }

  .slidePointer,
  .slidePointer2,
  .slidePointer3 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 20%;
    padding-bottom: 14px;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.3;
    .point {
      width: 12px;
      height: 12px;
      margin-top: 4px;
      background: #1b1b1b;
      border-radius: 50%;
    }
    .square {
      width: 20px;
      height: 20px;
      background: ${({ theme }) => theme.colors.cover4};
      border-radius: 4px;
    }
  }
  .slidePointer2 {
    .square {
      width: 16px;
      height: 16px;
    }
    padding-bottom: 12px;
  }
  .slidePointer3 {
    .square {
      width: 16px;
      height: 16px;
    }
    padding-bottom: 6px;
  }

  .pic {
    width: 160px;
    height: 170px;
    margin: 24px auto 20px;
  }
  .title {
    width: 120px;
    height: 30px;
    margin: 20px auto 12px;
  }
  .desc {
    width: 236px;
    height: 16px;
    margin: 0px auto 24px;
  }
  .button {
    width: calc(100% - 32px);
    height: 48px;
    margin: 0px auto 16px;
    border-radius: 24px;
  }
  .divider {
    margin: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.cover8};
  }

  .assets {
    width: calc(100% - 32px);
    height: 14px;
    margin: 0px auto 6px;
    border-radius: 4px;
  }
  .tip {
    width: 78px;
    height: 14px;
    margin-right: 16px;
    margin-left: auto;
    border-radius: 4px;
  }

  .products {
    margin-top: 24px;
    padding: 24px 16px 40px;
    background: ${({ theme }) => theme.colors.cover2};
    border-radius: 20px 20px 0px 0px;
  }
  .prodtitle {
    width: 100px;
    height: 22px;
    margin: 0px auto 16px;
    border-radius: 4px;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding: 16px;
    border: 1px solid ${({ theme }) => theme.colors.cover8};
    border-radius: 12px;
    .right,
    .leftTop,
    .leftBottom {
      width: 120px;
      height: 20px;
      background: ${({ theme }) => theme.colors.cover4};
      border-radius: 4px;
    }
    .leftBottom {
      width: 42px;
      height: 28px;
      margin-top: 8px;
    }
    .right {
      width: 62px;
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
`;

function SketchLoading(props) {
  const conRef = useRef(null);
  const [width, setWidth] = useState(375);
  useEffect(() => {
    setWidth(conRef.current.clientWidth);
  }, []);
  return (
    <Container ref={conRef}>
      <div className="levelHeader">
        <div className="levelCon">
          <div className="slidePointer">
            <div className="textSquare g-skeleton-item" />
            <div className="square g-skeleton-item" />
            <div className="point g-skeleton-item" />
          </div>
          <div className="slidePointer2">
            <div className="square g-skeleton-item" />
            <div className="point g-skeleton-item" />
          </div>
          <div className="slidePointer3">
            <div className="square g-skeleton-item" />
            <div className="point g-skeleton-item" />
          </div>
        </div>
        <CurveLine width={width} className="line" />
      </div>
      <div className="pic g-skeleton-item" />
      <div className="title g-skeleton-item" />
      <div className="desc g-skeleton-item" />
      <div className="button g-skeleton-item" />
      <div className="divider" />
      <div className="assets g-skeleton-item" />
      <div className="assets g-skeleton-item" />
      <div className="tip g-skeleton-item" />
      <div className="products">
        <div className="prodtitle g-skeleton-item" />
        <div className="card">
          <div>
            <div className="leftTop g-skeleton-item" />
            <div className="leftBottom g-skeleton-item" />
          </div>
          <div className="right g-skeleton-item" />
        </div>
        <div className="card">
          <div>
            <div className="leftTop g-skeleton-item" />
            <div className="leftBottom g-skeleton-item" />
          </div>
          <div className="right g-skeleton-item" />
        </div>
        <div className="card">
          <div>
            <div className="leftTop g-skeleton-item" />
            <div className="leftBottom g-skeleton-item" />
          </div>
          <div className="right g-skeleton-item" />
        </div>
      </div>
    </Container>
  );
}

export default SketchLoading;
