/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { DateTimeFormat, styled } from '@kux/mui';
import map from 'lodash/map';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import sale from 'static/spotlight8/sale.svg';
import saleLight from 'static/spotlight8/saleLight.svg';
import { _t } from 'tools/i18n';
import Title from './Title';

const Wrapper = styled.section`
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const Items = styled.div``;

const Item = styled.div`
  border: 1px solid ${(props) => props.theme.colors.divider8};
  border-bottom: none;
  display: flex;
  align-items: stretch;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;

  &:first-of-type {
    border-radius: 12px 12px 0px 0px;
  }

  &:last-of-type {
    border-bottom: 1px solid ${(props) => props.theme.colors.divider8};
    border-radius: 0px 0px 12px 12px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    justify-content: space-between;
    font-size: 16px;
  }
`;

const ItemKey = styled.div`
  display: flex;
  align-items: center;
  padding: 18px 24px;
  min-height: 64px;
  color: ${(props) => props.theme.colors.text60};
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  border-right: 1px solid ${(props) => props.theme.colors.divider8};
  font-weight: 500;
  font-size: 16px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 170px;
    min-width: 170px;
    max-width: 170px;
    min-height: 42px;
    padding: 11px 15px;
    font-weight: 400;
    font-size: 14px;
  }
`;

const ItemValue = styled.div`
  padding: 18px 24px;
  min-height: 64px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.text};
  flex: 1;
  font-weight: 500;
  font-size: 16px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    min-height: 42px;
    padding: 11px 15px;
    font-size: 14px;
  }
`;

const TokenSale = () => {
  const { currentLang } = useLocale();
  const { salesProgressModule = [] } = useSelector(
    (state) => state.spotlight8.detailInfo,
    shallowEqual,
  );
  const currentTheme = useSelector((state) => state.setting.currentTheme);

  if (!salesProgressModule?.length) {
    return null;
  }

  return (
    <Wrapper>
      <Title
        title={_t('2TBMhZPjUSSFEpcz83Xbnq')}
        icon={currentTheme === 'dark' ? sale : saleLight}
      />
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
