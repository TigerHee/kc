import {useThrottleFn} from 'ahooks';
import React, {useEffect, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import {css} from '@emotion/native';

import Input from 'components/Common/Input';
import {SearchPageSearchIc} from 'components/Common/SvgIcon';
import FlatList from 'components/FlatList';
import {commonStyles} from 'constants/styles';
import useGoBack from 'hooks/useGoBack';
import useLang from 'hooks/useLang';
import {useMeasureElementTTI} from 'utils/performance';
import {Cancel, SearchIconWrap, SearchPage} from './styles';
import TraderOverviewItem from './TraderOverviewItem';
import {useDataSource} from './useDataSource';

const inputCustomStyles = {
  inputContainer: css`
    flex: 1;
  `,
  inputWrapper: css`
    border-radius: 24px;
  `,
  clearButton: css``,
};

const THROTTLE_INTERVAL = 500;

const TraderSearch = () => {
  const {handlePageRootLayout} = useMeasureElementTTI();

  const [inputVal, setInputVal] = useState('');
  const [triggerSearchContent, setTriggerSearchContent] = useState('');
  const {_t} = useLang();
  const textInputRef = useRef(null);

  const goBack = useGoBack();

  const {dataSource, isLoading} = useDataSource({
    nickNameSearch: triggerSearchContent,
  });

  const {run: debounceTriggerContent} = useThrottleFn(setTriggerSearchContent, {
    wait: THROTTLE_INTERVAL,
  });

  useEffect(() => {
    textInputRef.current?.focus?.();
  }, []);

  const onInput = text => {
    if (!text) {
      setInputVal('');
      setTriggerSearchContent('');
    }

    setInputVal(text);
    debounceTriggerContent(text);
  };

  return (
    <SearchPage>
      <View
        style={css`
          padding: 0 16px;
          flex: 1;
        `}
        onLayout={handlePageRootLayout}>
        <View style={commonStyles.flexRowCenter}>
          <Input
            originInputProps={{
              keyboardType: 'default',
              blurOnSubmit: true,
              autoFucus: true,
              ref: textInputRef,
            }}
            styles={inputCustomStyles}
            colorType="success"
            size="small"
            placeholder=""
            allowClear
            value={inputVal}
            onChange={onInput}
            prefix={
              <SearchIconWrap>
                <SearchPageSearchIc />
              </SearchIconWrap>
            }
          />
          <Pressable onPress={goBack}>
            <Cancel>{_t('67cf010eb33b4000a0d1')}</Cancel>
          </Pressable>
        </View>

        <FlatList
          style={{flex: 1}}
          initialNumToRender={5}
          scrollEventThrottle={200}
          showsVerticalScrollIndicator={false}
          // 测试环境有脏数据，重复nickName 此处加上leadConfigId和currentCopyUserCount做唯一 key
          keyExtractor={(item, index) =>
            `${item?.nickName}_${item?.leadConfigId}_${item?.currentCopyUserCount}` ||
            index
          }
          renderItem={({item, index}) => (
            <TraderOverviewItem info={item} index={index} />
          )}
          loading={triggerSearchContent && isLoading}
          data={dataSource}
          hiddenEmpty={!triggerSearchContent}
        />
      </View>
    </SearchPage>
  );
};

export default TraderSearch;
