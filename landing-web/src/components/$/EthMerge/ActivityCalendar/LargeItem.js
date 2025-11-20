/**
 * Owner: jesse.shao@kupotech.com
 */
import PropTypes from 'prop-types';
import moment from 'moment';

import { LargeCalendarItem, HighLightDiv, MonthDiv, Entrance, Title, Icon } from './StyledComps';
import { getMonthText } from './config';

const Index = ({ data, onClick }) => {
  const month = getMonthText(data);
  return (
    <LargeCalendarItem onClick={() => onClick(data)}>
      <MonthDiv>{month}</MonthDiv>
      <HighLightDiv>
        <span>{moment(data.startTime).format('DD')}</span>~
        <span>{moment(data.endTime).format('DD')}</span>
      </HighLightDiv>
      <Entrance>
        <Title>{data.title}</Title>
        <Icon />
      </Entrance>
    </LargeCalendarItem>
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
