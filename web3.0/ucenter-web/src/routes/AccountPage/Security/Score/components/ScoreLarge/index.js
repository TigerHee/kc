import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRight2Outlined } from '@kux/icons';
import { Box, Button, useTheme } from '@kux/mui';
import LottieProvider from 'components/LottieProvider';
import { _t } from 'src/tools/i18n';
import multiArrowSrc from 'static/account/security/score/multi-arrow.svg';
import { ReactComponent as StarIcon } from 'static/account/security/score/star.svg';
import { ReactComponent as WarningIcon } from 'static/account/security/score/warning.svg';
import Buoy from '../Buoy';
import CountUp from '../CountUp';
import { Img, LevelSpan } from '../styled';
import {
  Back,
  Card,
  CardFooter,
  CardNum,
  CardRight,
  Container,
  Content,
  ContentFooter,
  ContentTitle,
  Desc,
  ExAntiBox,
  Item,
  ItemLabel,
  ItemStars,
  List,
  Title,
} from './styled';

export default function ScoreLarge({
  score,
  level,
  title,
  desc,
  list,
  lottieName,
  onSetUp,
  onBack,
}) {
  const theme = useTheme();
  const { isRTL } = useLocale();

  return (
    <Container style={{ marginBottom: list.length ? 100 : 80 }}>
      <Back onClick={onBack}>
        <ICArrowRight2Outlined size={16} style={{ transform: 'scaleX(-1)' }} />
        <span>{_t('back')}</span>
      </Back>
      <Box size={32} />
      <Card dir={list.length ? 'row' : 'column'} isDark={theme.currentTheme === 'dark'}>
        <ExAntiBox width={340} height={200}>
          <LottieProvider iconName={lottieName} />
          <CardNum>
            <LevelSpan level={level}>
              {score > 0 ? <CountUp target={score} /> : <span>--</span>}
            </LevelSpan>
          </CardNum>
        </ExAntiBox>
        <CardRight center={!list.length}>
          <Title>{title}</Title>
          <Desc>{desc}</Desc>
          {list.length ? (
            <>
              <Box size={20} />
              <Buoy level={level} />
            </>
          ) : (
            <>
              <Box size={100} />
              <CardFooter>{_t('securityGuard.footer')}</CardFooter>
            </>
          )}
        </CardRight>
      </Card>
      {list.length ? (
        <Content data-inspector="account_security_score_suggest">
          <ContentTitle>
            <Img src={multiArrowSrc} reflect={isRTL} />
            <span>{_t('securityGuard.suggest.title')}</span>
            <Img src={multiArrowSrc} reflect={!isRTL} />
          </ContentTitle>
          <List style={{ '--item-bg': theme.colors.background }}>
            {list.map((item) => {
              return (
                <Item
                  key={item.key}
                  data-inspector="account_security_score_suggest_item"
                  data-key={item.key}
                >
                  <ItemLabel>
                    <div>
                      {!item.isDeviceSupport ? (
                        <WarningIcon color={theme.colors.complementary} />
                      ) : null}
                      <span>{item.title}</span>
                    </div>
                    <div>{item.desc}</div>
                  </ItemLabel>
                  {item.isDeviceSupport ? (
                    <>
                      <ItemStars>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            color={item.weight > index ? theme.colors.icon : theme.colors.icon40}
                          />
                        ))}
                      </ItemStars>
                      <Button onClick={() => onSetUp(item)}>
                        <span>{_t('securityGuard.suggest.setUp')}</span>
                      </Button>
                    </>
                  ) : null}
                </Item>
              );
            })}
          </List>
          <ContentFooter>{_t('securityGuard.footer')}</ContentFooter>
        </Content>
      ) : null}
    </Container>
  );
}
