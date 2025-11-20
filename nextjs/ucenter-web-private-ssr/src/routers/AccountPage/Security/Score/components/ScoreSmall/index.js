import JsBridge from 'gbiz-next/bridge';
import { useLocale } from 'hooks/useLocale';
import { Button, useTheme } from '@kux/mui';
import LottieProvider from 'components/LottieProvider';
import { _t } from 'src/tools/i18n';
import lineSrc from 'static/account/security/score/line.svg';
import multiArrowSrc from 'static/account/security/score/multi-arrow.svg';
import { ReactComponent as StarIcon } from 'static/account/security/score/star.svg';
import { ReactComponent as WarningIcon } from 'static/account/security/score/warning.svg';
import Buoy from '../Buoy';
import CountUp from '../CountUp';
import { Img, LevelSpan } from '../styled';
import {
  Back,
  Container,
  ExAntiBox,
  Header,
  NoSuggestBox,
  ScoreBox,
  ScoreBrow,
  ScoreTitle,
  SuggestBox,
  SuggestFooter,
  SuggestItem,
  SuggestItemLeft,
  SuggestList,
  SuggestTitle,
  ValueBox,
} from './styled';

const IS_IN_APP = JsBridge.isApp();

export default function ScoreSmall({
  score,
  level,
  title,
  desc,
  list,
  lottieName,
  style,
  headerHidden,
  onSetUp,
  onBack,
}) {
  const theme = useTheme();
  const { isRTL } = useLocale();

  return (
    <Container style={style}>
      {headerHidden ? null : (
        <Header>
          <Back size={20} onClick={onBack} />
          <span>{_t('securityGuard')}</span>
        </Header>
      )}
      <ScoreBox headerHidden={headerHidden} noSuggest={!list.length}>
        <ScoreBrow>
          <Img src={lineSrc} reflect={isRTL} />
          <span>{_t('securityGuard.score.title')}</span>
          <Img src={lineSrc} reflect={!isRTL} />
        </ScoreBrow>
        <ExAntiBox width={375} height={240}>
          <LottieProvider iconName={lottieName} />
          <ValueBox>
            <LevelSpan level={level}>
              {score > 0 ? <CountUp target={score} /> : <span>--</span>}
            </LevelSpan>
          </ValueBox>
        </ExAntiBox>
        <ScoreTitle>
          <div>{title}</div>
          <div style={{ textAlign: 'center' }}>{desc}</div>
          {list.length ? <Buoy level={level} /> : null}
        </ScoreTitle>
      </ScoreBox>
      {list.length ? (
        <SuggestBox
          isDark={theme.currentTheme === 'dark'}
          data-inspector="account_security_score_suggest"
        >
          <SuggestList style={{ '--item-bg': theme.colors.layer }}>
            <SuggestTitle>
              <Img className="left-wing" src={multiArrowSrc} reflect={isRTL} />
              <span>{_t('securityGuard.suggest.title')}</span>
              <Img className="right-wing" src={multiArrowSrc} reflect={!isRTL} />
            </SuggestTitle>
            {list.map((item) => {
              return (
                <SuggestItem
                  key={item.key}
                  data-inspector="account_security_score_suggest_item"
                  data-key={item.key}
                >
                  <SuggestItemLeft>
                    <div>
                      {!item.isDeviceSupport ? (
                        <WarningIcon color={theme.colors.complementary} />
                      ) : null}
                      <span>{item.title}</span>
                    </div>
                    <div>{item.desc}</div>
                    {item.isDeviceSupport ? (
                      <div>
                        {Array.from({ length: 3 }).map((_, index) => (
                          <StarIcon
                            key={index}
                            width={12}
                            height={12}
                            color={item.weight > index ? theme.colors.icon : theme.colors.icon40}
                          />
                        ))}
                      </div>
                    ) : null}
                  </SuggestItemLeft>
                  {item.isDeviceSupport ? (
                    <Button size="small" onClick={() => onSetUp(item)}>
                      <span>{_t('securityGuard.suggest.setUp')}</span>
                    </Button>
                  ) : null}
                </SuggestItem>
              );
            })}
          </SuggestList>
          <SuggestFooter isInApp={IS_IN_APP}>
            <span>{_t('securityGuard.footer')}</span>
          </SuggestFooter>
        </SuggestBox>
      ) : (
        <NoSuggestBox>
          <span>{_t('securityGuard.footer')}</span>
        </NoSuggestBox>
      )}
    </Container>
  );
}
