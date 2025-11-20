import React, {memo, useMemo} from 'react';
import {View} from 'react-native';
import Dash from 'react-native-dash';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import useLayout from 'hooks/useLayout';
import {convertPxToReal} from 'utils/computedPx';
import TipTrigger from '../TipTrigger';
import {Label, LabelWrap, RowWrap, ValueText} from './styles';

const Item = memo(props => {
  const {item, isLast, styles} = props;
  const {wrap, label: labelStyle} = styles || {};
  const {tip, children, label, key} = item;
  const EnhanceTipWrap = tip ? TipTrigger : View;
  const [descTextLayout, handleDescLayout] = useLayout();
  const theme = useTheme();

  const isInnerText = useMemo(
    () => ['number', 'string'].includes(typeof children),
    [children],
  );

  return (
    <RowWrap
      key={key}
      style={[
        wrap,
        isLast &&
          css`
            margin-bottom: 0;
          `,
      ]}>
      <LabelWrap>
        <EnhanceTipWrap
          showUnderLine={false}
          showIcon={false}
          text={label}
          message={tip}>
          <View>
            <Label style={labelStyle} onLayout={handleDescLayout}>
              {label}
            </Label>
            {tip && !!descTextLayout?.width ? (
              <Dash
                style={{
                  width: descTextLayout.width,
                  height: convertPxToReal(1, false),
                }}
                dashThickness={1}
                dashLength={2.5}
                dashGap={4}
                dashColor={theme.colorV2.text40}
              />
            ) : null}
          </View>
        </EnhanceTipWrap>
      </LabelWrap>
      {isInnerText && <ValueText>{children}</ValueText>}
      {!isInnerText && children ? children : null}
    </RowWrap>
  );
});

const Descriptions = props => {
  const {items = [], styles} = props;
  const {itemStyles, card} = styles || {};

  return (
    <View style={card}>
      {items?.map((item, idx) => {
        return (
          <Item
            key={item.key || idx}
            item={item}
            isLast={idx === items.length - 1}
            styles={itemStyles}
          />
        );
      })}
    </View>
  );
};

export default Descriptions;
