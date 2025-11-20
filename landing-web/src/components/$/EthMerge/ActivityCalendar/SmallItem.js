/**
 * Owner: jesse.shao@kupotech.com
 */
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  SmallCalendarItem,
  HighLightDiv,
  MonthDiv,
  Entrance,
  Title,
  Icon,
  ActivityWrapper,
  ActivityItem,
  ActivityList,
  Des,
} from './StyledComps';
import { getMonthText } from './config';

const Index = ({ data, onClick }) => {
  const month = getMonthText(data);
  return (
    <SmallCalendarItem onClick={() => onClick(data)}>
      <Entrance>
        <MonthDiv>{month}</MonthDiv>
        <Icon />
      </Entrance>
      <Title style={{ marginTop: '4px' }}>{data?.title}</Title>
      <HighLightDiv>{data?.prize}</HighLightDiv>
      <ActivityWrapper>
        <ActivityList>
          {data?.activities?.map((i, idx) => (
            <ActivityItem key={`${data?.startTime}-${idx}`}>
              <div>
                <span>{`${idx + 1}. `}</span>
                <span>{i.content}</span>
              </div>
              <>{i.des ? <Des>{i.des}</Des> : ''}</>
            </ActivityItem>
          ))}
        </ActivityList>
      </ActivityWrapper>
    </SmallCalendarItem>
  );
};

Index.propTypes = {
  data: PropTypes.object.isRequired, // 显示数据
  onClick: PropTypes.func.isRequired, // 点击后的跳转
};

Index.defaultProps = {
  data: {},
  onClick: () => {},
};

export default Index;
