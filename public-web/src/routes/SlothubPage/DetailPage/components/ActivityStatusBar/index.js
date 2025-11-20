/*
 * @Date: 2024-05-27 18:13:13
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { ThemeProvider } from '@kux/mui';
import { memo } from 'react';
import Help from 'routes/SlothubPage/components/Help';
import { useDeviceHelper } from 'src/hooks/useDeviceHelper';
import { useSelector } from 'src/hooks/useSelector';
import NumberFormat from 'src/routes/SlothubPage/components/mui/NumberFormat';
import {
  BACKEND_PROJECT_STATUS_TYPE,
  PROJECT_ACTIVITY_STATUS,
} from 'src/routes/SlothubPage/constant';
import { _t } from 'src/tools/i18n';
import { useStore } from '../../store';
import {
  BottomWrap,
  Card,
  ColumnWrap,
  ContentWrap,
  PrimaryColorText,
  SecondaryText,
  StyledTimeCountDown,
  Text,
} from './styled';

const ActivityStatusBar = () => {
  const { isH5 } = useDeviceHelper();
  const { state } = useStore();
  const { projectDetail, activityStatus } = state;

  const { carvUpAmount, currency, endTime, status, totalPoints } = projectDetail || {};
  const categories = useSelector((state) => state.categories);
  const { currencyName = '' } = categories[currency] || {};

  return (
    <>
      <ThemeProvider theme="light">
        <Card>
          <ContentWrap>
            <ColumnWrap style={{ flex: 1 }}>
              <Text>
                <NumberFormat>{totalPoints}</NumberFormat>
              </Text>
              <SecondaryText>{_t('4c7c32028c514000a9d5', { coin: currencyName })} </SecondaryText>
            </ColumnWrap>

            <ColumnWrap style={{ flex: 1 }}>
              {status === BACKEND_PROJECT_STATUS_TYPE.ACTIVITY_RESULT_CALC && (
                <PrimaryColorText>{_t('00907928de3e4000a647')}</PrimaryColorText>
              )}

              {activityStatus === PROJECT_ACTIVITY_STATUS.activityOngoing ? (
                <Text>{_t('ae971caa54684000a581')}</Text>
              ) : (
                <Text className={carvUpAmount > 0 && 'highlight'}>
                  {!carvUpAmount ? `--` : <NumberFormat>{carvUpAmount}</NumberFormat>}
                </Text>
              )}

              <SecondaryText>
                {_t('f66b273f3b054000af2a')}
                <Help
                  dialogTitle={_t('f66b273f3b054000af2a')}
                  title={_t('d00ce1a968474000aaa6')}
                  containerProps={{
                    size: isH5 ? 12 : 16,
                  }}
                />
              </SecondaryText>
            </ColumnWrap>
          </ContentWrap>
          <BottomWrap>
            {activityStatus === PROJECT_ACTIVITY_STATUS.activityEnded ? (
              <span className="center">{_t('ed59eb6fc4014000a224')}</span>
            ) : (
              <>
                {_t('593d71b2d6494000afa3')}
                <StyledTimeCountDown
                  isH5={isH5}
                  intervalThemeConfig={{
                    gapWidth: 6,
                  }}
                  colorTheme="dark"
                  value={endTime}
                />
              </>
            )}
          </BottomWrap>
        </Card>
      </ThemeProvider>
    </>
  );
};

export default memo(ActivityStatusBar);
