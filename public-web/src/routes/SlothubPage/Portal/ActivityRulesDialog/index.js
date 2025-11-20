/*
 * @Date: 2024-06-20 20:53:18
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-20 21:37:44
 */
/**
 * owner: larvide.peng@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { useSelector } from 'hooks/useSelector';
import { map } from 'lodash';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import ActivityRulesGuideTitle from './ActivityRulesGuideTitle';
import { ContentType, rulesConfig } from './config';
import MobileHeader from './MobileHeader';
import Step from './Step';
import { Content, H1, MuiDrawerStyle, Typography } from './styled';

const ActivityRuleDialog = () => {
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state.slothub?.activityRulesDialogConfig);

  const onCloseHandler = useCallback(() => {
    dispatch({
      type: 'slothub/updateRulesModalConfig',
      payload: {
        open: false,
      },
    });
  }, [dispatch]);

  return (
    <MuiDrawerStyle
      width="480px"
      height={!sm ? '541px' : '100%'}
      title={!sm ? <MobileHeader onCloseHandler={onCloseHandler} /> : _t('8f5d845156624000ad07')}
      closeX={false}
      back={false}
      footer={null}
      show={open}
      onClose={onCloseHandler}
      maskClosable={true}
    >
      <div className="KuxDrawer-HeaderBg" />
      <Content>
        {!sm ? null : <ActivityRulesGuideTitle onCloseHandler={onCloseHandler} />}
        {map(rulesConfig, (item, index) => {
          const { type, content } = item;
          switch (type) {
            case ContentType.Title:
              return <H1 key={index}>{_t(content)}</H1>;
            case ContentType.Text:
              return <Typography key={index}>{_t(content)}</Typography>;
            default:
              return <Step key={index} />;
          }
        })}
      </Content>
    </MuiDrawerStyle>
  );
};

export default ActivityRuleDialog;
