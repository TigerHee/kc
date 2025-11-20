/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kufox/mui';
import _ from 'lodash';
import { useCallback } from 'react';
import { Link } from 'src/components/Router';
import { _t } from 'src/tools/i18n';
import arrow from 'static/root/deposit/arrow.svg';
import buy from 'static/root/deposit/buy.svg';
import cash from 'static/root/deposit/cash.svg';
import coin from 'static/root/deposit/coin.svg';
import { trackClick } from 'utils/ga';

const Wrapper = styled.div`
  & > a:last-of-type {
    margin-bottom: 0;
  }
`;

const Item = styled(Link)`
  display: flex;
  padding: 16px;
  background: ${({ theme }) => theme.colors.cover4};
  border-radius: 12px;
  margin-bottom: 12px;
  &:active {
    background: rgba(45, 189, 150, 0.08);
  }
`;

const Left = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Content = styled.div`
  flex-grow: 1;
  margin: 0 12px;
`;

const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
`;

const Desc = styled.div`
  font-size: 12px;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
`;

const Right = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Arrow = styled.img`
  width: 16px;
  height: 16px;
`;

export default ({ inDrawer, onCloseDrawer }) => {
  const blockId = inDrawer ? 'depositGuideChoose' : 'depositGuide';
  const list = [
    {
      icon: coin,
      title: 'cpugkEWmvRR6xYbS5rccuF',
      desc: '36EpCLX3Xfc5E5wHqq21BF',
      url: '/assets/coin/USDT',
      track: 'crypto',
    },
    {
      icon: cash,
      title: 'jcSNZaWn1ZjCWDq1nTT48C',
      desc: 'k3415jxh9ZhAXAhyXJdf68',
      url: '/assets/fiat-currency/recharge',
      track: 'fiat',
    },
    inDrawer
      ? null
      : {
          icon: buy,
          title: 'hvEftTRoeReURjuutHWF3J',
          desc: 'cqratq4AV4CNwRbRuC5zbJ',
          url: '/express',
          track: 'buyCrypto',
        },
  ];

  const onClick = useCallback(
    (clickPosition) => {
      try {
        onCloseDrawer && onCloseDrawer(1);
        trackClick([blockId, '1'], {
          clickPosition,
        });
      } catch (error) {}
    },
    [blockId, onCloseDrawer],
  );

  return (
    <Wrapper>
      {_.map(
        list.filter((i) => i),
        (item, index) => (
          <Item key={index} href={item.url} onClick={() => onClick(item.track)}>
            <Left>
              <Icon src={item.icon} />
            </Left>
            <Content>
              <Title>{_t(item.title)}</Title>
              <Desc>{_t(item.desc)}</Desc>
            </Content>
            <Right>
              <Arrow src={arrow} />
            </Right>
          </Item>
        ),
      )}
    </Wrapper>
  );
};
