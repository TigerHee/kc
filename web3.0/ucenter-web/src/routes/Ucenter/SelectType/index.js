/**
 * Owner: willen@kupotech.com
 */
import history from '@kucoin-base/history';
import { ICSmallHookOutlined } from '@kux/icons';
import { Button, useSnackbar, useTheme } from '@kux/mui';
import { map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import PageHeader from './PageHeader';
import {
  Circle,
  ContentTitle,
  Des,
  fullBtn,
  SelectItem,
  SelectItemActive,
  SelectItemWrapper,
  UcenterPage,
  UcenterPageBody,
  UcenterPageContent,
} from './styled';

const SelectType = (props) => {
  const theme = useTheme();
  const { onSubmit, renderOptions, pageTitle, prompt, blockId } = props;
  const [value, setValue] = useState();
  const { message } = useSnackbar();

  // 确保进入的埋点只埋一次
  useEffect(() => {
    if (blockId) {
      trackClick([blockId, '1']);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    const selectData = renderOptions.find((o) => o.key === value) || {};
    if (!value) {
      message.info(_t('selfService2.selectType.tip'));
    }
    if (onSubmit && value) {
      trackClick([selectData.blockId, '1']);
      onSubmit(selectData.formatedTypes || value);
    }
  }, [onSubmit, value, renderOptions]);

  const handleClick = useCallback(
    (key) => {
      setValue(key === value ? '' : key);
    },
    [value],
  );

  return (
    <UcenterPage>
      <UcenterPageBody>
        <UcenterPageContent>
          <PageHeader title={pageTitle} onClick={() => history.goBack()} />
          <ContentTitle>{_t('selfService2.selectType.title')}</ContentTitle>
          {prompt}
          <SelectItemWrapper>
            {map(renderOptions, (option) => {
              const isSelected = option.key === value;
              const Item = isSelected ? SelectItemActive : SelectItem;
              return (
                <Item
                  key={option.key}
                  data-inspector={`select_type_${option.key}`}
                  onClick={() => handleClick(option.key)}
                >
                  <div>
                    {map(option?.preImgs, (src, i) => (
                      <img alt="type-icon" key={`${option.key}-${i}`} src={src} />
                    ))}
                  </div>
                  <Des>{option?.label()}</Des>
                  <Circle isSelected={isSelected}>
                    {isSelected && <ICSmallHookOutlined size="16px" color={theme.colors.primary} />}
                  </Circle>
                </Item>
              );
            })}
          </SelectItemWrapper>
          <Button size="large" onClick={handleSubmit} css={fullBtn} fullWidth>
            {_t('next')}
          </Button>
        </UcenterPageContent>
      </UcenterPageBody>
    </UcenterPage>
  );
};

export default React.memo(SelectType);
