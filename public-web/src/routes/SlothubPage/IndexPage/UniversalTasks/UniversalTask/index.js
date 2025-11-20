/*
 * owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICArrowRightOutlined } from '@kux/icons';
import { Spin, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { useSelector } from 'hooks/useSelector';
import { isEmpty, map } from 'lodash';
import React, { useCallback, useState } from 'react';
import { SENSORS } from 'routes/SlothubPage/constant';
import withAuth from 'routes/SlothubPage/hocs/withAuth';
import useCanAttendActivity from 'routes/SlothubPage/hooks/useCanAttendActivity';
import { formatLocalLangNumber } from 'src/helper';
import { _t, _tHTML } from 'src/tools/i18n';
import mockData from '../mockData';
import { Balance, Content, Header, TaskList, Title } from '../style';
import { KycTask, TradeTask } from './TaskTemplate';
const Help = loadable(() =>
  import('routes/SlothubPage/components/Help').then((module) => module.default),
);
const HelpContainer = loadable(() =>
  import('routes/SlothubPage/components/Help').then((module) => module.HelpContainer),
);
const HelpContent = loadable(() =>
  import('routes/SlothubPage/components/Help').then((module) => module.HelpContent),
);
const HelpTitle = loadable(() =>
  import('routes/SlothubPage/components/Help').then((module) => module.HelpTitle),
);

const HistoryDialog = loadable(() => import('src/routes/SlothubPage/Portal/History/HistoryDialog'));
const AuthBalance = withAuth((props) => <Balance {...props} />);

const UniversalTask = ({ className, guidePoints }) => {
  const { sm } = useResponsive();
  const { currentLang } = useLocale();
  const canAttendActivity = useCanAttendActivity();
  const loading = useSelector((state) => state.loading.effects['slothub/pullBasicTasksInfo']);
  const basicTasksInfo = useSelector((state) =>
    guidePoints ? mockData : state.slothub.basicTasksInfo,
  );
  const userSummary = useSelector((state) =>
    guidePoints ? { remainingPoints: 430 } : state.slothub.userSummary,
  );

  const [historyVisible, setHistoryVisible] = useState(false);

  const { remainingPoints = '--' } = userSummary || {};
  const isSSG = navigator.userAgent.indexOf('SSG_ENV') !== -1;

  const openHistoryDialogHandler = useCallback(() => {
    SENSORS.history();
    setHistoryVisible(true);
  }, []);

  const closeHistoryDialogHandler = useCallback(() => {
    setHistoryVisible(false);
  }, []);

  return (
    <>
      <Content className={className}>
        <Header>
          <Title>
            {_t('f12d16038f454000a2e6')}
            <Help
              isUseH5
              dialogTitle={sm ? _t('hmMdg7DMuLwHvqys1H1QpT') : ''}
              title={
                <HelpContainer>
                  {!sm && <HelpTitle>{_t('hmMdg7DMuLwHvqys1H1QpT')}</HelpTitle>}
                  <div>
                    <HelpContent>{_t('ef8cf562cbdf4000a831')}</HelpContent>
                    <HelpContent>{_t('21b961bf972b4000a9ba')}</HelpContent>
                    <HelpContent>{_t('80619aee24a64000a265')}</HelpContent>
                  </div>
                </HelpContainer>
              }
              containerProps={{
                size: sm ? 18 : 14,
                style: { transform: 'translateY(1px)' },
              }}
            />
          </Title>
          <AuthBalance onClick={openHistoryDialogHandler}>
            {_tHTML('2739401bd9a64000afd5', {
              balance: isFinite(remainingPoints)
                ? formatLocalLangNumber({ data: remainingPoints || 0, lang: currentLang })
                : '--',
            })}
            <ICArrowRightOutlined
              size={12}
              className={`ml-${sm ? 6 : 4} horizontal-flip-in-arabic`}
            />
          </AuthBalance>
        </Header>
        <Spin
          size="xsmall"
          spinning={(!guidePoints && isEmpty(basicTasksInfo) && loading) || isSSG}
        >
          <TaskList>
            {map(isSSG ? [] : basicTasksInfo.tasks, (item) => {
              const commonProps = {
                guidePoints,
                key: item.id,
                projectId: basicTasksInfo.id,
                ...item,
              };
              return item.taskType === 1 ? (
                <KycTask {...commonProps} />
              ) : (
                <TradeTask {...commonProps} />
              );
            })}
          </TaskList>
        </Spin>
      </Content>
      {canAttendActivity && (
        <HistoryDialog
          show={historyVisible}
          onClose={closeHistoryDialogHandler}
          onOpen={openHistoryDialogHandler}
        />
      )}
    </>
  );
};

export default React.memo(UniversalTask);
