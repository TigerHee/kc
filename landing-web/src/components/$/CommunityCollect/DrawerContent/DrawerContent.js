/**
 * Owner: lucas.l.lu@kupotech.com
 */
import BetterScroll from '@better-scroll/core';
import { useCallback, useEffect, useRef } from 'react';
import { Button } from '@kux/mui';
import { _t } from 'utils/lang';
import { styled } from '@kufox/mui/emotion';

/**
 * @param props {{ value, onChange, onCancel }}
 * value-onChange 表单字段方式
 */
export function DrawerContent(props) {
  const { className, onChange, value, dataSource, onCancel } = props;
  const scrollRef = useRef({
    betterScroll: null,
  });

  useEffect(() => {
    if (!scrollRef.current.scroll) {
      scrollRef.current.betterScroll = new BetterScroll(scrollRef.current, {
        scrollY: true,
        click: true,
        useTransition: false,
      });
    }

    scrollRef.current.betterScroll?.refresh?.();
  }, [props.value]);

  const handleItemClick = useCallback((value) => {
    if (onChange) {
      onChange(value);
    }
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, []);

  return (
    <div className={className}>
      <div
        ref={scrollRef}
        className="list"
      >
        {dataSource.map((item, index) => {
          const active = item.language === value?.language;

          return (
            <div
              key={`${item}-${index}`}
              className={`item ${active ? 'active' : ''}`}
              onClick={() => handleItemClick(item)}>
              <span>{item.nativeName}</span>
              {active && (
                <span className="item-choose-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd"
                          clipRule="evenodd"
                          d="M18.5073 3.99549C18.832 4.32171 18.8307 4.84934 18.5045 5.174L7.61909 16.0073C7.29398 16.3309 6.76853 16.3309 6.44341 16.0073L1.4955 11.0832C1.16928 10.7585 1.16801 10.2309 1.49266 9.90466C1.81731 9.57844 2.34495 9.57717 2.67117 9.90183L7.03125 14.241L17.3288 3.99267C17.655 3.66801 18.1827 3.66928 18.5073 3.99549Z"
                          fill="#01BC8D" />
                  </svg>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="footer">
        <Button
          variant="contained"
          type="default"
          size="large"
          style={{
            width: '100%',
          }}
          onClick={handleCancel}>
          {_t('easter.cancel')}
        </Button>
      </div>
    </div>
  );
}

export const StyledDrawerContent = styled(DrawerContent)`
  & {
    .list {
      padding-bottom: 70px;
    }

    .item {
      position: relative;
      padding: 14px 16px 13px;
      background-color: transparent;
      transition: .2s linear;

      &.active {
        background-color: ${({ theme }) => theme.colors.mode === 'light' ? theme.colors.cover2 : '#121212'};
        transition: .2s linear;
      }
    }

    .item-choose-icon {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translate3d(0, -50%, 0);
    }

    .footer {
      // 46 = 12 + 34(ios safe)
      padding: 12px 16px 46px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: ${({ theme }) => theme.colors.mode === 'light' ? theme.colors.backgroundMajor : '#121212'};
    }
  }
`;
