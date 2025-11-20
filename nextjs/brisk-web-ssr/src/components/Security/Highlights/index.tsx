import clsx from 'clsx';
import { useResponsive } from '@kux/design';
import useTheme from '@/hooks/useTheme';
import { useRef, useState, useEffect } from 'react';
import { throttle, uniqueId } from 'lodash-es';
import Pagination from '@/components/CommonComponents/Pagination';
import useRTL from '@/hooks/useRTL';
import Card from './Card';
import styles from './styles.module.scss';

const Highlights = () => {
  const rs = useResponsive();
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useTheme();
  const isRTL = useRTL();

  const isDark = theme === 'dark';
  const isLg = rs === 'md';

  // 颜色变量
  const COLORS = {
    BLACK: isDark ? 'black' : 'white',
    WHITE: isDark ? 'white' : 'black',
    WHITE_TRANSPARENT: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
  };

  const [forceUpdate, setForceUpdate] = useState('');
  // 圆弧长度
  const [pathLength, setPathLength] = useState(0);
  // 模块 index
  const [step, setStep] = useState(0);
  // 圆点滚动中
  const [isAnimating, setIsAnimating] = useState(false);
  // 是否可以展示安全介绍明细卡片
  const [isShowCard, setIsShowCard] = useState(false);
  // 卡片定位
  const [position, setPosition] = useState<{ circleX: number; circleY: number } | null>(null);

  // 初始化获取弧线长度
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // 监听窗口大小变化，重新计算位置
  useEffect(() => {
    const handleResize = throttle(() => {
      // 延迟执行以确保DOM更新完成后再重新计算位置
      setTimeout(() => {
        if (pathRef.current) {
          setForceUpdate(uniqueId());
          setPathLength(pathRef.current.getTotalLength());
        }
      }, 10);
    }, 50);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    if (svgRef.current) {
      if (window.IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(e => {
              if (e.intersectionRatio > 0) {
                if (!isShowCard) {
                  setIsShowCard(true);
                }
              }
            });
          },
          { threshold: [0.1] }
        );

        observer.observe(svgRef.current);
      } else {
        setIsShowCard(true);
      }
    }

    return () => {
      observer && observer?.disconnect?.();
    };
  }, [isShowCard]);

  // 弧线分成 3 份放置点，根据step调整位置
  const getPoints = () => {
    const baseRate = isLg ? 0.7 : 0.75;
    const offsetUnit = isLg ? 0.06 : 0.08;
    const basePoints = [baseRate, baseRate + offsetUnit, baseRate + offsetUnit * 2];
    const offset = step * offsetUnit; // 每次移动 offset 的距离

    return basePoints.map(p => {
      const newPos = p - offset;
      // 如果位置小于0.1则隐藏（给一个小的缓冲区域）
      return newPos >= 0.1 ? newPos : null;
    });
  };

  // 计算点坐标
  const getPoint = (progress: number) => {
    if (!pathRef.current || pathLength === 0) return { x: 0, y: 0 };
    // 根据进度计算在路径上的位置
    const length = progress * pathLength;
    const pt = pathRef.current.getPointAtLength(length);
    return { x: pt.x, y: pt.y };
  };

  // 处理旋转动画
  const handleRotate = (direction: 'left' | 'right') => {
    if (isAnimating) return; // 防止动画期间重复点击
    setIsAnimating(true);
    if (direction === 'left') {
      setStep(s => Math.min(s + 1, 2));
    } else {
      setStep(s => Math.max(s - 1, 0));
    }
    // 动画完成后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // 300ms动画时长
  };

  // 获取当前活跃点的位置
  const getActivePointPosition = () => {
    const activePoint = getPoints()[step];
    if (activePoint === null) return null;
    return getPoint(activePoint);
  };

  // 计算描述框位置 - 直接基于当前活跃圆点的位置
  const getDescriptionPosition = () => {
    const activePos = getActivePointPosition();
    if (!activePos || !svgRef.current) return null;

    const svgRect = svgRef.current.getBoundingClientRect();
    const viewBoxWidth = 1273;

    // 计算圆点在页面中的实际位置
    // 使用SVG的实际尺寸而不是硬编码的尺寸
    const circleX = (activePos.x / viewBoxWidth) * svgRect.width - 5;
    const circleY = svgRect.height;

    return { circleX, circleY };
  };

  // 根据step生成不同的渐变值
  const getGradientByStep = (step: number) => {
    switch (step) {
      case 0:
        return `conic-gradient(from 90deg, ${COLORS.WHITE_TRANSPARENT} 0deg, transparent 38.0769deg, transparent 254.423deg, ${COLORS.WHITE} 270deg, ${COLORS.WHITE_TRANSPARENT} 360deg)`;
      case 1:
        return `conic-gradient(from 90deg, transparent 0deg, transparent 114.231deg, ${COLORS.WHITE} 218.077deg, transparent 360deg)`;
      case 2:
        return `conic-gradient(from 90deg, transparent 0deg, transparent 91.7308deg, ${COLORS.WHITE_TRANSPARENT} 152.308deg, transparent 360deg)`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const position = getDescriptionPosition();
    setPosition(position);
  }, [step, pathLength, forceUpdate]);

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        width="100%"
        // height="auto"
        viewBox="0 0 1273 275"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        overflow="visible"
        className={clsx({
          [styles.svg]: true,
          [styles.svgRTL]: isRTL,
        })}
      >
        <defs>
          {/* 定义mask，用于创建圆弧形状 */}
          <mask
            id="path-1-outside-1"
            maskUnits="userSpaceOnUse"
            x="-713"
            y="0"
            width="1986"
            height="343"
            fill={COLORS.BLACK}
          >
            <rect fill={COLORS.WHITE} x="-713" width="1986" height="343" />
            <path d="M1270 171.5C1270 264.56 826.762 340 280 340C-266.762 340 -710 264.56 -710 171.5C-710 78.44 -266.762 3 280 3C826.762 3 1270 78.44 1270 171.5Z" />
          </mask>

          {/* 定义clipPath，用于裁剪渐变区域 */}
          <clipPath id="paint0_angular_clip_path">
            <path d="M1270 171.5H1267C1267 181.849 1260.84 192.443 1247.97 203.152C1235.12 213.836 1216 224.278 1191.08 234.305C1141.28 254.346 1069.03 272.458 979.532 287.69C800.589 318.146 553.266 337 280 337V340V343C553.496 343 801.172 324.134 980.539 293.605C1070.2 278.345 1142.93 260.147 1193.32 239.871C1218.5 229.738 1238.27 219.019 1251.81 207.765C1265.3 196.537 1273 184.416 1273 171.5H1270ZM280 340V337C6.73419 337 -240.589 318.146 -419.532 287.69C-509.028 272.458 -581.276 254.346 -631.081 234.305C-655.998 224.278 -675.123 213.836 -687.968 203.152C-700.844 192.443 -707 181.849 -707 171.5H-710H-713C-713 184.416 -705.305 196.537 -691.805 207.765C-678.275 219.019 -658.501 229.738 -633.321 239.871C-582.932 260.147 -510.198 278.345 -420.539 293.605C-241.172 324.134 6.50391 343 280 343V340ZM-710 171.5H-707C-707 161.151 -700.844 150.557 -687.968 139.848C-675.123 129.164 -655.998 118.722 -631.081 108.695C-581.276 88.6536 -509.028 70.5423 -419.532 55.31C-240.589 24.8535 6.73419 6 280 6V3V0C6.50391 0 -241.172 18.8665 -420.539 49.395C-510.198 64.6552 -582.932 82.8526 -633.321 103.129C-658.501 113.262 -678.275 123.981 -691.805 135.235C-705.305 146.463 -713 158.584 -713 171.5H-710ZM280 3V6C553.266 6 800.589 24.8535 979.532 55.31C1069.03 70.5423 1141.28 88.6536 1191.08 108.695C1216 118.722 1235.12 129.164 1247.97 139.848C1260.84 150.557 1267 161.151 1267 171.5H1270H1273C1273 158.584 1265.3 146.463 1251.81 135.235C1238.27 123.981 1218.5 113.262 1193.32 103.129C1142.93 82.8526 1070.2 64.6552 980.539 49.395C801.172 18.8665 553.496 0 280 0V3Z" />
          </clipPath>
        </defs>

        {/* 使用mask和渐变创建圆弧效果 */}
        <g clipPath="url(#paint0_angular_clip_path)" mask="url(#path-1-outside-1)">
          <g transform="matrix(0.99 0 0 0.1685 280 171.5)">
            <foreignObject x="-1017.8" y="-1017.8" width="2035.61" height="2035.61">
              <div
                className={styles.svgGradient}
                style={{
                  background: getGradientByStep(step),
                }}
              ></div>
            </foreignObject>
          </g>
        </g>

        {/* 主路径 - 用于计算点的位置 */}
        <path
          ref={pathRef}
          d="M1270 171.5C1270 264.56 826.762 340 280 340C-266.762 340 -710 264.56 -710 171.5C-710 78.44 -266.762 3 280 3C826.762 3 1270 78.44 1270 171.5Z"
          stroke="transparent"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {getPoints().map((p, i) => {
          // 如果位置为null，说明该点被隐藏
          if (p === null) return null;

          const { x, y } = getPoint(p);

          // 计算透明度，当接近隐藏边界时逐渐变透明
          // 当p接近0.1时开始变透明，当p为0.1时完全透明
          const opacity = p <= 0.15 ? Math.max(0, (p - 0.1) * 20) : 1;

          return (
            <g key={i}>
              {/* 透明外层 - 2px透明层 */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={COLORS.BLACK}
                opacity={opacity}
                style={{
                  transition: 'all 0.3s ease-in-out',
                  transform: `scale(${opacity})`,
                }}
              />
              {/* 白色内层 */}
              <circle
                cx={x}
                cy={y}
                r="5"
                fill={COLORS.WHITE}
                opacity={opacity}
                style={{
                  transition: 'all 0.3s ease-in-out',
                  transform: `scale(${opacity})`,
                }}
              />
            </g>
          );
        })}
      </svg>

      {isShowCard && position ? (
        <div
          style={{
            [isRTL ? 'right' : 'left']: `${position.circleX}px`,
            bottom: `${position.circleY}px`,
            position: 'absolute',
          }}
        >
          <Card key={step} step={step} />
        </div>
      ) : null}

      <div className={styles.buttonContainer}>
        <Pagination
          onLeft={() => handleRotate('right')}
          onRight={() => handleRotate('left')}
          leftDisabled={step === 0}
          rightDisabled={step === 2}
        />
      </div>
    </div>
  );
};

export default Highlights;
