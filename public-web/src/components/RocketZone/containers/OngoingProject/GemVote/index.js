/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, Divider, useResponsive } from '@kux/mui';
import { useCountDown } from 'ahooks';
import classNames from 'classnames';
import { useStatus } from 'components/RocketZone/hooks';
import { chunk } from 'components/RocketZone/utils';
import { memo, useMemo, useRef } from 'react';
import { _t } from 'tools/i18n';
import { transformTimeStr } from 'TradeActivity/utils';
import StatusComp from '../StatusComp';
import { StyledCarousel } from '../styledComponents';
import Item from './Item';
import { CountdownWrapper, HeaderWrapper, StyledProjectItem, WinWarpper } from './style';

const emptyArr = [];

const Coutdwon = memo(({ date, status }) => {
  const [__, formattedRes] = useCountDown({
    targetDate: date,
    interval: 1000,
  });

  const { days, hours, minutes, seconds } = formattedRes;

  return (
    <CountdownWrapper>
      {status === 1 ? _t('9daa36bfc6ce4000ace0') : _t('8583a5a3d34b4000acd8')}
      <span className="timeCounter">
        {!!days && (
          <>
            <span className="item">{transformTimeStr(days)}</span>
            <span className="split">:</span>
          </>
        )}
        <span className="item">{transformTimeStr(hours)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(minutes)}</span>
        <span className="split">:</span>
        <span className="item">{transformTimeStr(seconds)}</span>
      </span>
    </CountdownWrapper>
  );
});

const CountDownComp = memo(({ voteEndAt, voteStartAt, status }) => {
  const { currentLang } = useLocale();
  // 不显示倒计时
  // 这里应该显示胜出时间winAt,后端没有返回，让前端取voteEndAt时间
  if (status === 2) {
    if (voteEndAt) {
      return (
        <WinWarpper>
          <div className="label">{`${_t('psc7EyANJ1tUGmT32dzsbn')}: `}</div>
          <div className="value">
            <DateTimeFormat
              date={voteEndAt}
              lang={currentLang}
              options={{ hour: undefined, minute: undefined, second: undefined }}
            >
              {voteEndAt}
            </DateTimeFormat>
          </div>
        </WinWarpper>
      );
    } else {
      return null;
    }
  }

  return <Coutdwon status={status} date={status === 0 ? voteStartAt : voteEndAt} />;
});

const CampaignCarousel = memo(({ data, status, url }) => {
  const sliderRef = useRef();

  const settings = {
    ref: sliderRef,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    //rtl: true,
  };

  return (
    <StyledCarousel {...settings}>
      {data.map((items, index) => (
        <div key={`campaign_${index}`}>
          <div className="campaign-slide">
            {items.map((item, _index) => {
              if (item) {
                return <Item {...item} key={item.id} status={status} url={url} />;
              }
            })}
          </div>
        </div>
      ))}
    </StyledCarousel>
  );
});

function GemVote(item) {
  const { lg, sm } = useResponsive();

  // startActivity, // 活动开始时间，gemvote特殊返回投票开始时间
  // endActivity, // 活动结束时间，gemvote特殊返回投票结束时间
  const { voteEndAt, voteStartAt, title, projects, url } = item || {};

  const showItemCount = useMemo(() => {
    if (lg) {
      return 3;
    } else if (!sm) {
      return 1;
    } else {
      return 2;
    }
  }, [lg, sm]);

  const status = useStatus({ startDate: voteStartAt, endDate: voteEndAt });

  const sortList = useMemo(() => {
    if (projects?.length) {
      // 排序并排名
      let _projects = projects;
      if (status === 1) {
        // 进行中根据投票数量排序
        _projects = projects?.sort((a, b) => +b?.voteNumber - +a?.voteNumber);
      } else if (status === 2) {
        // 已结束成功在前，失败在后
        // 投票结果：-1 初始值 0 未胜出 1 胜出 2 投票中
        _projects = projects?.sort((a, b) => +b?.voteResult - +a?.voteResult);
      }

      // 是否显示rank的规则
      const showRank = status === 1 && _projects[0]?.voteNumber;
      if (showRank) {
        _projects = _projects?.map((item, index) => {
          if (item) {
            return {
              rank: index < 3 ? index + 1 : 0,
              ...item,
            };
          }
        });
      }
      return _projects;
    }
    return emptyArr;
  }, [status, projects]);

  const data = useMemo(() => {
    return chunk(sortList, showItemCount);
  }, [sortList, showItemCount]);

  return (
    <StyledProjectItem
      className={classNames('projectCard', {
        ['complementary']: status === 0,
        ['primary']: status === 1,
        ['grey']: status === 2,
      })}
    >
      {sm && <div className="bg" />}
      {sm && <StatusComp status={status} typeName="gemVote" />}

      <div className="content">
        <HeaderWrapper>
          {title}
          {sm && <Divider type="vertical" />}
          <div className="dateWraper">
            {!sm && <StatusComp status={status} typeName="gemVote" />}
            <CountDownComp voteEndAt={voteEndAt} voteStartAt={voteStartAt} status={status} />
          </div>
        </HeaderWrapper>
        <CampaignCarousel data={data} status={status} url={url} />
      </div>
    </StyledProjectItem>
  );
}

export default memo(GemVote);
