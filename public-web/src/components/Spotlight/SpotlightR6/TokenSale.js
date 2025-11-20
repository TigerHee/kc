/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import coin from 'static/spotlight6/coin.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const Wrapper = styled.div`
  width: 100%;
`;

const Items = styled.div`
  margin-bottom: 40px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 20px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
`;

const Item = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
    font-size: 14px;
    line-height: 18px;
  }
`;

const ItemKey = styled.div`
  color: rgba(225, 232, 245, 0.4);
  width: 160px;
  margin-right: 70px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 26px;
  }
`;

const ItemValue = styled.div`
  color: #e1e8f5;
  flex: 1;

  ${(props) => props.theme.breakpoints.down('sm')} {
    text-align: right;
  }
`;

const TokenSale = () => {
  const { currentLang } = useLocale();
  const { salesProgressModule = [] } = useSelector(
    (state) => state.spotlight.detailInfo,
    shallowEqual,
  );

  return !salesProgressModule?.length ? null : (
    <Wrapper>
      <Title title={_t('2TBMhZPjUSSFEpcz83Xbnq')} icon={coin} />
      <Items>
        {map(salesProgressModule, ({ title, content }, index) => {
          return (
            <Item key={`tokenSaleItem_${index}`}>
              <ItemKey>{title}</ItemKey>
              <ItemValue>
                {content?.endsWith('UTC') ? (
                  <DateTimeFormat lang={currentLang}>{content}</DateTimeFormat>
                ) : (
                  content
                )}
              </ItemValue>
            </Item>
          );
        })}
      </Items>
    </Wrapper>
  );
};

export default TokenSale;
