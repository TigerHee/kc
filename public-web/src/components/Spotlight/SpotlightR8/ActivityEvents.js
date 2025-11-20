/**
 * Owner: gannicus.zhou@kupotech.com
 */
import { dateTimeFormat, styled, useResponsive } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'src/hooks/useSelector';

import { ReactComponent as DoubleUpIcon } from 'static/spotlight8/doubleUp.svg';
import { ReactComponent as GrayCircleIcon } from 'static/spotlight8/grayCircle.svg';
import { ReactComponent as GrayCircleLightIcon } from 'static/spotlight8/grayCircleLight.svg';
import { ReactComponent as PrimaryCircleOnIcon } from 'static/spotlight8/primaryCircleOn.svg';
import { ReactComponent as PrimaryCircleOnLightIcon } from 'static/spotlight8/primaryCircleOnLight.svg';
import successIconUrl from 'static/spotlight8/successFilled.svg';
import successIconLightUrl from 'static/spotlight8/successFilledLight.svg';

import { EVENT_STATUS } from './constants';

const Events = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid ${(props) => props.theme.colors.cover12};

  .event-item {
    position: relative;
    flex: 1;
    padding: 32px 8px 18px;
    text-align: center;
    border-radius: 8px;
  }

  .event-item h3 {
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
    font-size: 16px;
  }

  .circle-indicator {
    position: absolute;
    bottom: -10px;
    left: 50%;
    flex: 1;
    height: 20px;
    transform: translateX(-50%);
  }

  .circle-indicator-on {
    bottom: -12px;
    width: 24px;
    height: 24px;
  }

  .date-range {
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
  }

  .event-item-on {
    h3 {
      color: ${(props) => props.theme.colors.primary};
    }
    .date-range {
      color: ${(props) => props.theme.colors.primary};
    }
  }
`;

const EventsH5 = styled.div`
  display: flex;
  padding: 8px 12px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 12px;
  background: ${(props) => props.theme.colors.cover4};
  margin: 20px 16px 10px;
  gap: 10px;

  .event-item.active {
    .doubleUpIcon {
      transform: rotate(180deg);
    }
  }

  &.expand {
    .event-item {
      display: flex;

      .lineDashed {
        display: block;
      }

      .rightItem {
        display: none;
      }
    }
    &:has(.event-item.active) .event-item:last-child {
      .rightItem {
        display: flex;
        .doubleUpIcon {
          transform: rotate(0);
        }
      }
    }
  }

  .event-item {
    position: relative;
    display: none;
    flex: 1;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    &.active {
      display: flex;
    }

    &.active {
      .leftItem {
        color: #fff;
        background: ${(props) => props.theme.colors.primary};
      }
      .titleItem {
        color: ${(props) => props.theme.colors.primary} !important;
      }
      .dateItem {
        color: ${(props) => props.theme.colors.text60} !important;
      }

      & ~ .event-item {
        .leftItem {
          color: #fff;
          background: ${(props) => props.theme.colors.icon40};
        }
      }
    }

    .lineDashed {
      position: absolute;
      top: calc(50% + 10px);
      left: 10px;
      z-index: 3;
      display: none;
      width: 0px;
      height: calc(100% - 10px);
      border-left: 1px dashed ${(props) => props.theme.colors.divider8};
    }
    .content-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .leftItem {
      z-index: 4;
      display: flex;
      flex-direction: column;
      gap: 12.5px;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      padding: 0px 5px;
      color: transparent;
      font-size: 14px;
      background: url(${(props) => props.theme.currentTheme === 'dark' ? successIconUrl : successIconLightUrl}) no-repeat center;
      background-size: 100%;
      border-radius: 100px;

      .successIcon {
        position: absolute;
        z-index: 5;
        width: 22px;
        height: 22px;
      }
    }
    .midItem {
      display: flex;
      flex-direction: column;
      gap: 4px;
      align-items: flex-start;
      justify-content: center;
      .titleItem {
        color: ${(props) => props.theme.colors.text60};
        font-weight: 500;
        font-size: 14px;
        line-height: 130%; /* 18.2px */
      }
      .dateItem {
        color: ${(props) => props.theme.colors.text40};
        font-weight: 400;
        font-size: 12px;
        font-family: Roboto;
        font-style: normal;
        line-height: 130%;
      }
    }

    .rightItem {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
`;

const ActivityEvents = ({ steps, eventStatus, currentLang }) => {
  const { sm } = useResponsive();
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const [show, setShow] = useState(false); // 点击展开
  const lastStatus = useRef(eventStatus);

  useEffect(() => {
    // 没有活动状态或者活动已结束, 默认展示全部(没有激活的状态, 也就无法折叠展开)
    if (
      !eventStatus ||
      eventStatus < EVENT_STATUS.NOT_START ||
      eventStatus === EVENT_STATUS.ENDED
    ) {
      setShow(true);
      //  活动状态从结束(默认状态)切换到其他状态(正确获取到数据后), 将展开状态置为false
    } else if (lastStatus.current === EVENT_STATUS.ENDED && eventStatus) {
      setShow(false);
    }
    lastStatus.current = eventStatus;
  }, [eventStatus]);

  return !sm ? (
    <EventsH5 className={`${show ? 'expand' : ''}`}>
      {steps.map((step, index) => (
        <div
          className={`event-item ${eventStatus === step.status ? 'active' : ''}`}
          key={step.status}
        >
          {index !== 2 && <div className="lineDashed" />}
          <div className="content-item">
            <div className="leftItem">{index + 1}</div>
            <div className="midItem">
              <div className="titleItem">{step.title}</div>
              <div className="dateItem">
                {dateTimeFormat({
                  date: step.startDate,
                  lang: currentLang,
                  options: { timeZone: 'UTC' },
                })} ~{' '}
                {dateTimeFormat({
                  date: step.endDate,
                  lang: currentLang,
                  options: { timeZone: 'UTC' },
                })} (UTC)
              </div>
            </div>
          </div>
          <div className="rightItem" onClick={() => setShow(!show)}>
            <DoubleUpIcon className="doubleUpIcon" />
          </div>
        </div>
      ))}
    </EventsH5>
  ) : (
    <Events className="events">
      {steps.map((step) => (
        <div
          key={step.status}
          className={eventStatus === step.status ? 'event-item-on event-item' : 'event-item'}
        >
          <h3>{step.title}</h3>
          <div className="date-range">
            {dateTimeFormat({
              date: step.startDate,
              lang: currentLang,
              options: { timeZone: 'UTC' },
            })} ~{' '}
            {dateTimeFormat({
              date: step.endDate,
              lang: currentLang,
              options: { timeZone: 'UTC' },
            })} (UTC)
          </div>
          {currentTheme === 'light' ? (
            // Light theme icons
            eventStatus === step.status ? (
              <PrimaryCircleOnLightIcon className="circle-indicator-on circle-indicator" />
            ) : (
              <GrayCircleLightIcon className="circle-indicator" />
            )
          ) : // Dark theme icons
          eventStatus === step.status ? (
            <PrimaryCircleOnIcon className="circle-indicator-on circle-indicator" />
          ) : (
            <GrayCircleIcon className="circle-indicator" />
          )}
        </div>
      ))}
    </Events>
  );
};

export default ActivityEvents;
