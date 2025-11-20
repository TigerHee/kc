/**
 * Owner: willen@kupotech.com
 */

import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/native';
import registerAPI from 'utils/registerAPI';
import API from 'components/Tabs/API';
import Tab from 'components/Tabs/Tab';
import { ScrollView } from 'react-native';

const TabsWrapper = styled.View`
  flex-direction: row;
  ${({ theme, variant }) => {
    if (variant === 'isolated') {
      return `
          background-color: ${theme.colorV2.cover4};
          border-radius: 8px;
          padding: 2px;
        `;
    } else if (variant === 'border') {
      return '';
    } else {
      return `
          border-bottom-color: ${theme.colorV2.divider8};
          border-bottom-width: 0.5px;
          border-bottom-style: solid;
        `;
    }
  }}
`;

const Tabs = ({ variant, size, style, children, value, onChange, autoCentered }) => {
  const [tabList, setTabList] = useState([]);
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const scrollerRef = useRef();
  const allTabRef = useRef([]);
  useEffect(() => {
    if (children?.length) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        // 判断是否传入了label和value参数
        if (!child.props.label || !child.props.value) {
          throw new Error('Tab的组件必须传入label和value参数');
        }
      }
      setTabList(children);
    }
  }, [children]);

  return (
    <TabsWrapper
      variant={variant}
      onLayout={(e) => setWrapperWidth(e?.nativeEvent?.layout?.width || 0)}
      style={style}
    >
      <ScrollView
        ref={scrollerRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{flexGrow: 1}}
      >
        {tabList.map((tab, index) => {
          const extendProp = {
            ...tab.props,
            // 子组件value与Tabs传入的value相同，子组件设置active为true
            size,
            variant,
            active: tab.props.value === value,
            key: tab.props.value,
            index,
            ...(autoCentered ? { tabRef: (ref) => (allTabRef.current[index] = ref) } : {}),
            onPress: () => {
              if (onChange) {
                if (allTabRef.current?.length) {
                  let width = 0;
                  const offset = variant === 'line' ? 24 : 0;
                  allTabRef.current.forEach((item, i) => {
                    item?.measure((frameX, frameY, frameWidth) => {
                      if (i === 0 && variant === 'line') width = width + 16;
                      if (i === index) {
                        scrollerRef.current.scrollTo({
                          x: width - wrapperWidth / 2 + frameWidth / 2,
                        });
                      } else {
                        width = width + frameWidth + offset;
                      }
                    });
                  });
                }
                onChange(tab.props.value, index, tab.props);
              }
            },
          };
          return React.cloneElement(tab, extendProp);
        })}
      </ScrollView>
    </TabsWrapper>
  );
};

registerAPI(Tabs, API);

Tabs.Tab = Tab;
export default Tabs;
