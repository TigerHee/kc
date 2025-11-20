import {useMemoizedFn} from 'ahooks';
import React, {memo} from 'react';
import {css} from '@emotion/native';

import Collapse from 'components/Common/Collapse';
import {FormField} from 'components/Common/Form';
import Form from 'components/Common/Form/Form';
import Radio from 'components/Common/Radio';
import Switch from 'components/Common/Switch';
import {RowWrap} from 'constants/styles';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';
import AdvanceLabel from './components/AdvanceLabel';
import {
  CopyMaxAmount,
  FOLLOW_SETTING_EDIT_MODE,
} from './components/CopyMaxAmount';
import ReadOnlyCopyModeDesc from './components/ReadOnlyCopyModeDesc';
import TipBanner from './components/TipBanner';
import {PositionTPSL} from './components/TPSLFields/PositionTPSL';
import {ProjectTPSL} from './components/TPSLFields/ProjectTPSL';
import {useGetLeverageConfig} from './hooks/useGetLeverageConfig';
import {CopyModePayloadType, LeveragePatternType} from './constant';
import {
  FormContent,
  GrayCard,
  PromiseModeSection,
  RadioText,
  StyledAdjustLeverageSelect,
  SwitchText,
} from './styles';

const CollapseStyles = {
  root: css`
    margin-top: 32px;
  `,
  itemWrap: css`
    margin-bottom: 16px;
  `,
};

const FixedRateFormContent = ({readonly = false, status, formMethods}) => {
  const {copyMaxLeverage = 10} = useGetLeverageConfig();

  const {onClickTrack} = useTracker();

  const disabled = readonly;
  const {_t} = useLang();

  const onCollapsedChange = useMemoizedFn(() => {
    onClickTrack({
      blockId: 'ratio',
      locationId: 'advanced',
    });
  });

  const editMode = readonly
    ? FOLLOW_SETTING_EDIT_MODE.Edit
    : FOLLOW_SETTING_EDIT_MODE.Create;

  return (
    <Form
      formMethods={formMethods}
      style={css`
        flex: 1;
      `}>
      <FormContent>
        <ReadOnlyCopyModeDesc
          readonly={readonly}
          copyMode={CopyModePayloadType.fixedRate}
        />
        <TipBanner content={_t('f0ca7d623a764000acd1')} />
        <CopyMaxAmount status={status} editMode={editMode} />

        <Collapse
          isCollapsed
          onCollapsedChange={onCollapsedChange}
          label={_t('960753da2e7d4000af2a')}
          styles={CollapseStyles}>
          <ProjectTPSL />
          <PositionTPSL />

          <PromiseModeSection>
            <AdvanceLabel
              text={_t('457aff95989c4000adf9')}
              message={_t('3a53ffc49a224000a41a')}
            />
            <GrayCard>
              <FormField name={'leveragePattern'} label={null}>
                {({...register}) => (
                  <Radio.Group disabled={disabled} {...register}>
                    <Radio
                      disabled={disabled}
                      value={LeveragePatternType.FOLLOW}>
                      {_t('0985a78dd54b4000af6d')}
                    </Radio>

                    <Radio
                      disabled={disabled}
                      style={css`
                        margin-top: 16px;
                      `}
                      value={LeveragePatternType.FIX}>
                      <RowWrap
                        style={css`
                          flex-wrap: wrap;
                          flex: 1;
                        `}>
                        <RadioText>{_t('ce8781acd6d84000aa2c')}</RadioText>
                        <FormField name="leverage" label={null}>
                          {({...register}) => (
                            <StyledAdjustLeverageSelect
                              disabled={disabled}
                              step={1}
                              min={1}
                              max={copyMaxLeverage}
                              editMode={editMode}
                              {...register}
                            />
                          )}
                        </FormField>
                      </RowWrap>
                    </Radio>
                  </Radio.Group>
                )}
              </FormField>
            </GrayCard>
            <AdvanceLabel
              text={_t('8b1715b33a294000a95e')}
              message={_t('29842e2f9b524000a038')}
            />

            <GrayCard>
              <RowWrap>
                <FormField name={'copyLeadAddMargin'} label={null}>
                  {({value, ...others}) => (
                    <RowWrap>
                      <Switch disabled={disabled} checked={value} {...others} />
                      <SwitchText>
                        {value
                          ? _t('639683f559604000a7f4')
                          : _t('c890c6e24d494000ae71')}
                      </SwitchText>
                    </RowWrap>
                  )}
                </FormField>
              </RowWrap>
            </GrayCard>
          </PromiseModeSection>
        </Collapse>
      </FormContent>
    </Form>
  );
};

export default memo(FixedRateFormContent);
