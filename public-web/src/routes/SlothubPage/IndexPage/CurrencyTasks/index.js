/*
 * owner: borden@kupotech.com
 */
import { ICSearchOutlined } from '@kux/icons';
import { Tab, useColor, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import { usePrevious } from 'ahooks';
import classNames from 'classnames';
import { useSelector } from 'hooks/useSelector';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { _t } from 'tools/i18n';
import { LIST_TYPES, LIST_TYPES_MAP } from './config';
import { Container, InputFormWrap, StyledInput, StyledTabs, TabBar, Title } from './style';
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

const CurrencyTasks = ({ guidePoints, className, ...otherProps }) => {
  const colors = useColor();
  const { sm } = useResponsive();
  const dispatch = useDispatch();
  const listStatistics = useSelector((state) => state.slothub.listStatistics);
  const prevCount = usePrevious(listStatistics);

  const [searchText, setSearchText] = useState();
  const [value, setValue] = useState(LIST_TYPES[0].value);

  useEffect(() => {
    dispatch({ type: 'slothub/pullStatistics' });
  }, []);

  const handleChange = useCallback((e, v) => {
    setValue(v);
  }, []);

  const handleSearch = useCallback(
    debounce((e) => {
      setSearchText(e?.target?.value);
    }, 500),
    [],
  );

  useEffect(() => {
    /**
     * 优化需求
     * @see https://k-devdoc.atlassian.net/browse/TOBC-9945
     */
    if (JSON.stringify(prevCount) === '{}') {
      const { completedCount, ongoingCount, upcomingCount } = listStatistics;
      if (ongoingCount > 0) {
        setValue(LIST_TYPES[0].value);
      } else if (upcomingCount > 0) {
        setValue(LIST_TYPES[1].value);
      } else if (completedCount > 0) {
        setValue(LIST_TYPES[2].value);
      } else {
        setValue(LIST_TYPES[0].value);
      }
    }
  }, [listStatistics, prevCount]);

  return (
    <Container className={classNames(className, 'container')} {...otherProps}>
      <Title>
        {_t('d6e98258470b4000a1dd')}
        <Help
          isUseH5
          dialogTitle={sm ? _t('hmMdg7DMuLwHvqys1H1QpT') : ''}
          title={
            <HelpContainer>
              {!sm && <HelpTitle>{_t('hmMdg7DMuLwHvqys1H1QpT')}</HelpTitle>}
              <div>
                <HelpContent>{_t('01a2cd3b7e954000af29')}</HelpContent>
                <HelpContent>{_t('d0adc44705934000ace7')}</HelpContent>
                <HelpContent>{_t('4539df3aba9b4000aeac')}</HelpContent>
              </div>
            </HelpContainer>
          }
          containerProps={{
            size: sm ? 20 : 14,
          }}
        />
      </Title>
      <TabBar>
        <StyledTabs
          size="medium"
          value={value}
          centeredActive
          activeType="primary"
          onChange={handleChange}
          showScrollButtons={false}
          variant={sm ? 'line' : 'bordered'}
          {...(!sm ? { type: 'text' } : null)}
        >
          {LIST_TYPES.map(({ value, label }) => {
            return (
              <Tab
                key={value}
                value={value}
                label={label(guidePoints ? { upcomingCount: sm ? 3 : 1 } : listStatistics)}
                data-inspector={`slothub_tab_${value}`}
              />
            );
          })}
        </StyledTabs>
        {Boolean(LIST_TYPES_MAP[value]?.showFilter) && (
          <InputFormWrap action="#">
            <StyledInput
              allowClear
              size="xsmall"
              type="search"
              onChange={handleSearch}
              placeholder={_t('search')}
              addonBefore={<ICSearchOutlined size={12} color={colors.icon60} />}
            />
          </InputFormWrap>
        )}
      </TabBar>
      {LIST_TYPES_MAP[value]?.component({ searchText, guidePoints }) || null}
    </Container>
  );
};

export default React.memo(CurrencyTasks);
