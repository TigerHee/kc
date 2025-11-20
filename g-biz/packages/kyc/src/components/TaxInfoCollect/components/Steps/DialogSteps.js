/**
 * Owner: tiger@kupotech.com
 */
import { useMemo } from 'react';
import { styled, useResponsive } from '@kux/mui';
import { ICArrowRightOutlined, ICHookOutlined } from '@kux/icons';
import _ from 'lodash';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { VIEW_PAN_NUMBER, VIEW_PAN_PHOTO, VIEW_PAN_RESULT } from '../../config';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;
const Item = styled.div`
  display: flex;
  align-items: center;
`;
const ItemIndex = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  font-size: 14px;
  line-height: 22px;
  margin-right: 8px;
  color: ${({ theme }) => theme.colors.textEmphasis};
  background-color: ${({ active, completed, theme }) =>
    active || completed ? theme.colors.text : theme.colors.cover20};
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
    margin-right: 0;
    font-size: 12px;
  }
`;
const ItemTitle = styled.p`
  margin-bottom: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: ${({ active, completed, theme }) =>
    active || completed ? theme.colors.text : theme.colors.text40};
`;
const DivideIcon = styled(ICArrowRightOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text30};
  margin: 0 17px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin: 0 8px;
  }
`;
const CompletedIcon = styled(ICHookOutlined)`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textEmphasis};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 13px;
  }
`;

const Steps = ({ curView }) => {
  const { _t } = useLang();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  const list = [
    {
      title: _t('139aff2842e84000a29e'),
    },
    {
      title: _t('c7f2df9473fc4000a695'),
    },
  ];

  const current = useMemo(() => {
    if (curView === VIEW_PAN_NUMBER) {
      return 0;
    }
    if (curView === VIEW_PAN_PHOTO) {
      return 1;
    }
    if (curView === VIEW_PAN_RESULT) {
      return 2;
    }
    return 0;
  }, [curView]);

  return [VIEW_PAN_NUMBER, VIEW_PAN_PHOTO].includes(curView) ? (
    <Wrapper>
      {_.map(list, (item, index) => {
        const active = index === current;
        const completed = index < current;
        return (
          <>
            <Item key={item.title}>
              <ItemIndex active={active} completed={completed}>
                {completed ? <CompletedIcon /> : index + 1}
              </ItemIndex>
              {!isH5 ? (
                <ItemTitle active={active} completed={completed}>
                  {item.title}
                </ItemTitle>
              ) : null}
            </Item>
            {index === list.length - 1 ? null : <DivideIcon completed={completed} />}
          </>
        );
      })}
    </Wrapper>
  ) : null;
};

export default Steps;
