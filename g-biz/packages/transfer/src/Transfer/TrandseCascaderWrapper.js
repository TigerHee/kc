/**
 * Owner: solar@kupotech.com
 */
import { styled } from '@kux/mui';
import { useEffect, useImperativeHandle, useRef, forwardRef, useCallback } from 'react';

// 不含动画的原逻辑, 回滚只需把这个放开导出即可
// export default ({ children }) => {
//   return <div className="trandseCascader">{children}</div>;
// };

function noTransparentCover2(props) {
  const { theme } = props;
  return theme.currentTheme === 'light' ? '#fbfbfb' : '#262627';
}
function noTransparentColor(props) {
  const { theme } = props;
  return theme.currentTheme === 'light' ? '#1d1d1d' : '#f3f3f3';
}

const StyledWrapper = styled.div`
  position: relative;
  .clone-node-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    width: 300px;
    height: 40px;
    padding-left: 16px;
    background-color: ${noTransparentCover2};
    border-top: 1px solid ${noTransparentCover2};
    border-bottom: 1px solid ${noTransparentCover2};
    opacity: 0;
    transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
    transition-duration: 0.28s;
    transition-property: transform;
    pointer-events: none;
  }
  .clone-node {
    color: ${noTransparentColor};
    font-weight: 600;
    line-height: 100%;
    > svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
    &.ISOLATED {
      display: flex;
      align-items: center;
      & > svg {
        margin-right: 16px;
      }
      & > div {
        > .symbol {
          margin-top: 2px;
          color: ${(props) => props.theme.colors.text30};
          font-weight: 500;
          ${(props) => props.theme.fonts.size.lg}
          line-height: 16px;
        }
      }
    }
  }
`;

export default forwardRef(
  ({ children, visible, from = [], to = [], formOptions, toOptions }, ref) => {
    // 舞台ref
    const stageRef = useRef();
    // 交换位置的两个account的影子dom的句柄
    const shadowRefs = useRef([]);
    // 原两个account的句柄
    const originRefs = useRef([]);

    // y轴上偏移的距离
    const translateY = useRef(0);
    const initAnimation = useCallback(() => {
      // 恢复原dom节点的颜色。
      originRefs.current.forEach((_item) => {
        _item.style.opacity = 1;
      });
      // 如果有影子dom，先清理再生成。
      while (shadowRefs.current.length) {
        const _item = shadowRefs.current.shift();
        if (stageRef.current) {
          stageRef.current.removeChild(_item);
        }
      }
      const stage = stageRef.current;
      const { top: stageTop, left: stageLeft } = stage?.getBoundingClientRect?.() || {
        top: 0,
        left: 0,
      };
      // 获取两个要交换的node，然后clone
      const sides = stage?.querySelectorAll?.('.pickerLabel > div > div') || [];
      const sidesWrapper = stage?.querySelectorAll?.('.pickerLabel') || [];
      originRefs.current = sides;
      let _translateY = 0;
      const _shadowRefs = [];
      for (let i = 0; i < sides.length && i < sidesWrapper.length; i++) {
        const side = sides[i];
        const sideWrapper = sidesWrapper[i];
        const { top: sideTop, left: sideLeft } = sideWrapper.getBoundingClientRect();
        if (i === 0) {
          _translateY -= sideTop;
        } else if (i === 1) {
          _translateY += sideTop;
        }
        const shadowSide = side.cloneNode(true);
        shadowSide.classList.add('clone-node');
        for (let j = 0, account = i === 0 ? from : to; j < account.length; j++) {
          account[j] && shadowSide.classList.add(account[j]);
        }
        const shadowSideWrapper = document.createElement('div');
        shadowSideWrapper.classList.add('clone-node-wrapper');
        shadowSideWrapper.appendChild(shadowSide);

        shadowSideWrapper.style.left = `${sideLeft - stageLeft}px`;
        shadowSideWrapper.style.top = `${sideTop - stageTop}px`;
        _shadowRefs.push(stage.appendChild(shadowSideWrapper));
      }
      translateY.current = _translateY;
      shadowRefs.current = _shadowRefs;
    }, [from, to]);

    useEffect(() => {
      if (visible) {
        setTimeout(() => {
          // 优化动画初始化，在这些选项变化时去重新init
          initAnimation();
        });
      }
    }, [from[0], from[1], to[0], to[1], visible, formOptions, toOptions]);

    useImperativeHandle(
      ref,
      () => {
        return {
          exchange() {
            return new Promise((resolve) => {
              const y = translateY.current;
              for (
                let idx = 0;
                idx < shadowRefs.current.length && idx < originRefs.current.length;
                idx++
              ) {
                const originItem = originRefs.current[idx];
                const shadowItem = shadowRefs.current[idx];
                shadowItem.style.opacity = 1;
                originItem.style.opacity = 0;
                if (idx === 0) {
                  shadowItem.style.transform = `translateY(${y}px)`;
                } else {
                  shadowItem.style.transform = `translateY(-${y}px)`;
                  const transitionEnd = () => {
                    // 解绑事件
                    shadowItem.removeEventListener('transitionend', transitionEnd, false);
                    shadowItem.removeEventListener('webkitTransitionEnd', transitionEnd, false);
                    shadowItem.removeEventListener('oTransitionEnd', transitionEnd, false);
                    shadowItem.removeEventListener('otransitionend', transitionEnd, false);
                    resolve();
                  };
                  shadowItem.addEventListener('transitionend', transitionEnd, false);
                  shadowItem.addEventListener('webkitTransitionEnd', transitionEnd, false);
                  shadowItem.addEventListener('oTransitionEnd', transitionEnd, false);
                  shadowItem.addEventListener('otransitionend', transitionEnd, false);
                }
              }
              // 为了有浏览器一旦不支持transitionEnd，还是加一个兜底resolve逻辑，以免阻塞划转
              setTimeout(() => {
                resolve();
              }, 400);
            });
          },
        };
      },
      [],
    );
    return (
      <StyledWrapper className="trandseCascader" ref={stageRef}>
        {children}
      </StyledWrapper>
    );
  },
);
