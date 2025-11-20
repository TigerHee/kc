/**
 * Owner: jessie@kupotech.com
 */
import { Button, styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import star from 'static/spotlight6/star.svg';
import { _t } from 'tools/i18n';
import { useDeposit } from './hooks';
import Title from './Title';

const Wrapper = styled.div`
  width: 100%;
`;

const Items = styled.div`
  padding-top: 10px;
  margin-bottom: 0;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 0;
  }
`;

const Item = styled.div`
  background: rgba(225, 232, 245, 0.02);
  border-radius: 8px;
  margin-bottom: 20px;
  padding: 38px 30px 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;

  div {
    width: 100%;
  }

  button {
    margin-left: 70px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: flex-end;
    padding: 30px 16px;

    button {
      margin-top: 10px;
    }
  }
`;

const ItemKey = styled.div`
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  color: #e1e8f5;
  margin-bottom: 6px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
    line-height: 21px;
  }
`;

const ItemValue = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: rgba(225, 232, 245, 0.4);

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
    line-height: 21px;
  }
`;

const LotteryTickets = () => {
  const { lotteryTicketsModule = [] } = useSelector(
    (state) => state.spotlight.detailInfo,
    shallowEqual,
  );
  const { handleDeposit } = useDeposit();

  return !lotteryTicketsModule?.length ? null : (
    <Wrapper>
      <Title title={_t('gRYF8Kw698M5Qfb5qhitXz')} icon={star} />
      <Items>
        {map(lotteryTicketsModule, ({ title, content }, index) => {
          return (
            <Item key={`lotteryItem_${index}`}>
              <div>
                <ItemKey>{title}</ItemKey>
                <ItemValue>{content}</ItemValue>
              </div>
              <Button onClick={handleDeposit}>{_t('kcAdhXHDUz13LQv89N7XiH')}</Button>
            </Item>
          );
        })}
      </Items>
    </Wrapper>
  );
};

export default LotteryTickets;
