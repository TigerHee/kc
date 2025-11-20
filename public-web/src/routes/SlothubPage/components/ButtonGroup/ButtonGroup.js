/*
 * owner: borden@kupotech.com
 */
import { ICNoviceGuideOutlined, ICShareOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import React from 'react';
import Button from 'routes/SlothubPage/components/mui/Button';
import { _t } from 'src/tools/i18n';
import useActivityRules from '../AppHeader/useActivityRules';
import useActivityShare from '../AppHeader/useActivityShare';

const Container = styled.div`
  display: flex;
  button {
    background-color: ${(props) => props.theme.colors.cover8};
  }
`;

const ButtonGroup = ({ style }) => {
  const activityRulesProps = useActivityRules();
  const activityShareProps = useActivityShare();

  return (
    <Container data-testid="ButtonGroup" style={style}>
      <Button
        type="default"
        startIcon={<ICNoviceGuideOutlined size={16} />}
        {...activityRulesProps}
      >
        {_t('8f5d845156624000ad07')}
      </Button>
      <Button
        type="default"
        className="ml-16"
        startIcon={<ICShareOutlined size={16} />}
        {...activityShareProps}
      >
        {_t('5d420a2591a54000ae9f')}
      </Button>
    </Container>
  );
};

export default React.memo(ButtonGroup);
