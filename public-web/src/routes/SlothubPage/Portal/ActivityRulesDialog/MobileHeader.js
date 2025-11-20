/**
 * owner: larvide.peng@kupotech.com
 */
import { styled } from '@kux/mui';
import { _t } from 'tools/i18n';
import ActivityRulesGuideTitle from './ActivityRulesGuideTitle';

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
`;

const MobileHeader = ({ onCloseHandler }) => {
  return (
    <FlexBox>
      <Title>{_t('8f5d845156624000ad07')}</Title>
      <ActivityRulesGuideTitle onCloseHandler={onCloseHandler} />
    </FlexBox>
  );
};
export default MobileHeader;
