/**
 * Owner: larvide.peng@kupotech.com
 */
import { useRef, useEffect, useState } from 'react';
import { useTheme, useMediaQuery, Tooltip, styled } from '@kux/mui';
import { ICArrowRightOutlined, ICArrowRight2Outlined } from '@kux/icons';
import { _t, addLangToPath } from 'tools/i18n';
import { map } from 'lodash';
import useIntersectionObserver from 'hooks/useIntersectionObserver';
import CustomButton from './CustomButton';

// 文字超过两行，显示 tooltip
const LabelDeal = ({ children }) => {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const labelRef = useRef(null);
  const [isNeedTooltip, setNeedTooltip] = useState(false);
  useEffect(() => {
    if (labelRef.current) {
      const { height } = labelRef.current.getBoundingClientRect();
      setNeedTooltip(height >= 60);
    }
  }, []);

  return isNeedTooltip && !isSm ? (
    <Tooltip title={children} placement="top">
      <div className="content-item-desc content-item-desc-ellipsis" ref={labelRef}>
        {children}
      </div>
    </Tooltip>
  ) : (
    <div className="content-item-desc" ref={labelRef}>
      {children}
    </div>
  );
};

const AnimationWrapper = styled.div`
  width: 100%;
  transform: translateY(120px);
  @keyframes into {
    0% {
      transform: translateY(120px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  ${({ nodeEntry, delay = 0 }) => {
    if (nodeEntry) {
      return `animation: into 0.5s ease-out forwards; animation-delay: ${delay}s`;
    }
  }}
`;
const ICArrowRight2OutlinedWrapper = styled(ICArrowRight2Outlined)`
  [dir='rtl'] & {
    transform: rotate(-180deg);
  }
`;

/** section 最大显示数 */
const MAX_SECTION = 6;
const Section = ({ item, index }) => {
  const theme = useTheme();
  const { ref, nodeEntry } = useIntersectionObserver({
    threshold: 0.3,
    root: null,
    rootMargin: '0px',
    freezeOnceVisible: true,
  });
  const isLightMode = (theme.currentTheme || 'light') === 'light';

  return (
    <div
      ref={ref}
      key={index}
      className={`content-item ${item.mode === 'right' ? 'content-item-reverse' : ''}`}
    >
      <div className="content-item-left">
        <img src={isLightMode ? item.coverLight : item.coverDark} alt="intro" />
      </div>
      <div className="content-item-right">
        <AnimationWrapper className="content-item-title" nodeEntry={nodeEntry?.isIntersecting}>
          {_t(item.title)}
        </AnimationWrapper>
        <AnimationWrapper nodeEntry={nodeEntry?.isIntersecting} delay={0.05}>
          <LabelDeal>{_t(item.desc)}</LabelDeal>
        </AnimationWrapper>
        <AnimationWrapper nodeEntry={nodeEntry?.isIntersecting} delay={0.1}>
          <div className="content-item-btns">
            {map(item.children, (subItem, subIndex) => {
              if (subIndex > MAX_SECTION) return null;
              return (
                <div className="content-item-btn" key={subIndex}>
                  <CustomButton href={subItem.path}>{_t(subItem.title)}</CustomButton>
                </div>
              );
            })}
            {!!item.more && (
              <a
                href={item.more.href}
                target="_self"
                className="content-item-btn content-item-more"
              >
                <span>{_t('eecbdda6cd7d4000a806')}</span>
                <ICArrowRightOutlined />
              </a>
            )}
          </div>
          {!!item.otherLink && (
            <>
              <div className="content-divier" />
              <a href={addLangToPath(item.otherLink.to)} className="content-href">
                <img
                  src={isLightMode ? item.otherLink.iconLight : item.otherLink.iconDark}
                  alt={_t(item.otherLink.title)}
                />
                <span>{_t(item.otherLink.title)}</span>

                <div className="a-arrow">
                  <ICArrowRight2OutlinedWrapper />
                </div>
              </a>
            </>
          )}
        </AnimationWrapper>
      </div>
    </div>
  );
};

export default Section;
