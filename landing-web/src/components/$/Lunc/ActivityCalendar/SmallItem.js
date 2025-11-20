/**
 * Owner: jesse.shao@kupotech.com
 */
import PropTypes from 'prop-types';
import {
  SmallCalendarItem,
  HighLightDiv,
  MonthDiv,
  Entrance,
  Title,
  Icon,
} from './StyledComps';
import { _t } from 'src/utils/lang';

const Index = ({ data, onClick }) => {
  return (
    <SmallCalendarItem onClick={() => onClick(data)}>
      <Entrance>
        <MonthDiv>Sep.14</MonthDiv>
        <Icon />
      </Entrance>
      <Title style={{ marginTop: '4px' }}>{_t('kXrNXsdvEXaYvBiKtxwx8J')}</Title>
      <HighLightDiv>——{_t('nA7FUsGoUthByuU6nXcukv')}</HighLightDiv>
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
