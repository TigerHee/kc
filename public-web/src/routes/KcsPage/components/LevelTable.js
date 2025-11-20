/**
 * Owner: chris@kupotech.com
 */
import { ResizeObserver, styled } from '@kux/mui';
import clsx from 'clsx';
import { divide } from 'helper';
import { throttle } from 'lodash';
import { useLayoutEffect, useRef, useState } from 'react';
import { _t } from 'src/tools/i18n';
import { levels } from '../config';
import { numberFormat, percentFormat } from '../utils';

const getAmount = (minAmount, maxAmount) => {
  const _maxAmount = numberFormat(maxAmount);
  const _minAmount = numberFormat(minAmount);
  if (maxAmount && minAmount) {
    return `${_minAmount} ≤ x < ${_maxAmount}`;
  } else if (maxAmount) {
    return `x < ${_maxAmount}`;
  } else {
    return `x ≥ ${_minAmount}`;
  }
};

const getPercent = (minPercent, maxPercent) => {
  const _minPercent = percentFormat(divide(minPercent, 100));
  const _maxPercent = percentFormat(divide(maxPercent, 100));
  if (minPercent && maxPercent) {
    return `${_minPercent} < y ≤ ${_maxPercent}`;
  } else if (maxPercent) {
    return `y ≤ ${_maxPercent}`;
  } else if (minPercent) {
    return `y > ${_minPercent}`;
  } else {
    return '--';
  }
};

const levelsWithK0 = [
  {
    level: 0,
    maxAmount: 1,
  },
  ...levels,
];
const datas = levelsWithK0.map((level) => {
  const { minAmount, maxAmount, maxPercent, minPercent, level: grade } = level;
  const kcs = getAmount(minAmount, maxAmount);
  const percent = getPercent(minPercent, maxPercent);
  const condition = grade === 0 ? '--' : _t('9ac3358f1d204000a3d3');
  return {
    // ...level,
    level: `K${grade}`,
    kcs,
    percent,
    condition,
  };
});

const Container = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.text};
  border: 0.5px solid ${({ theme }) => theme.colors.cover12};
  border-radius: 12px;
  overflow-x: auto; /* 启用横向滚动 */
  white-space: nowrap;
  overscroll-behavior-x: none;
  &::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    border-radius: 2px;
  }

  /* 定义滚动条轨道的样式 */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 定义滚动条的样式 */
  &::-webkit-scrollbar-thumb {
    background: #626263;
    border-radius: 12px;
  }

  /* 当鼠标悬停在滚动条上时，定义滚动条的样式 */
  &::-webkit-scrollbar-thumb:hover {
    // background: #555;
  }
  .shadow {
    position: absolute;
    left: -2px;
    width: 20px;
    height: 100%;
    background: linear-gradient(
      90deg,
      ${({ fromModal }) => (fromModal ? '#222223' : '#121212')} 0%,
      ${({ fromModal }) => (fromModal ? '#22222300' : '#12121200')} 100%
    );
  }
  .gridTitle {
    height: 40px;
    padding: 0px 20px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 12px;
    line-height: 40px;
    text-align: center;
    border-right: 0.5px solid ${({ theme }) => theme.colors.cover12};
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.cover12};
  }
  .gridColumn {
    flex: 1;
    & > div:nth-child(2n + 1) {
      background: ${({ theme }) => theme.colors.cover2};
      box-shadow: 0px -0.5px 0px 0px #2d2d2d inset;
    }
    & > div:last-child {
      border-bottom: none;
    }
  }
  .fisrtColumn {
    position: sticky;
    left: -1px;
    z-index: 1;
    flex: none;
    background: ${({ theme, fromModal }) =>
      fromModal ? theme.colors.layer : theme.colors.overlay};
    border-radius: 12px 0px 0px 12px;
  }
  .valueColumn {
    height: 48px;
    line-height: 48px;
    text-align: center;
    border-right: 0.5px solid ${({ theme }) => theme.colors.cover12};
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.cover12};
  }
  .lastColumn {
    & > div {
      border-right: none;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

function LevelTable({ source }) {
  const scrollRef = useRef(null);
  const fixedRef = useRef(null);
  const [left, setLeft] = useState(0);
  const [height, setHeight] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const columns = [
    {
      title: _t('40c706b1fa8a4000a643'),
      width: 100,
      dataIndex: 'level',
      key: 'level',
      fixed: 'left',
    },
    {
      title: _t('105ce019b80c4000a7f2'),
      width: 300,
      dataIndex: 'kcs',
      key: 'kcs',
      fixed: 'left',
    },
    {
      title: _t('e64c344ba35b4000a374'),
      width: 100,
      dataIndex: 'condition',
      key: 'condition',
    },
    {
      title: _t('4080433e31084000ae75'),
      width: 100,
      dataIndex: 'percent',
      key: 'percent',
    },
  ];

  useLayoutEffect(() => {
    const left = fixedRef.current.clientWidth;
    setLeft(left - 2);
    setHeight(scrollRef.current.clientHeight);
    const listener = throttle((event) => {
      const scrollLeft = scrollRef.current.scrollLeft;
      setIsScroll(scrollLeft > 10);
    }, 10);
    scrollRef.current.addEventListener('scroll', listener);
    return () => {
      scrollRef.current.removeEventListener('scroll', listener);
    };
  }, []);

  const onResize = () => {
    setLeft((n) => n);
  };

  const fromModal = source === 'modal';

  return (
    <ResizeObserver onResize={onResize}>
      <div style={{ positive: 'relative' }}>
        <Container ref={scrollRef} fromModal={fromModal}>
          {isScroll && <div className="shadow" style={{ left, height }} />}
          {columns.map(({ title, key }, idx) => {
            const props = idx === 0 ? { ref: fixedRef } : {};
            return (
              <div
                {...props}
                key={key}
                className={clsx('gridColumn', {
                  ['fisrtColumn']: idx === 0,
                  ['lastColumn']: idx === columns.length - 1,
                })}
              >
                <div className="gridTitle">{title}</div>
                {datas.map((d, idx) => {
                  return (
                    <div key={idx} className="valueColumn">
                      {d[key]}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Container>
      </div>
    </ResizeObserver>
  );
}
export default LevelTable;
