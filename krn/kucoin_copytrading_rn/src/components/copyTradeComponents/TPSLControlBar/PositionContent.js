import {useToggle} from 'ahooks';
import {noop} from 'lodash';
import React, {useMemo} from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@emotion/react';

import {DownArrow, UpArrow} from 'components/Common/SvgIcon';
import useLang from 'hooks/useLang';
import {safeArray} from 'utils/helper';
import {CopyPositionControlItem} from './ControlItem';
import {CollapseBar, CollapseText} from './styles';

export const PositionContent = ({
  stopTakeOrderInfos = [],
  positionInfo,
  subUid,
  isLeadPosition,
}) => {
  const {_t} = useLang();
  const [isCollapsed, {toggle}] = useToggle(true);
  const {colorV2} = useTheme();
  const {positionForceShowList, positionCollapseList} = useMemo(() => {
    const originList = [...safeArray(stopTakeOrderInfos)];
    const positionForceShowList = originList?.splice(0, 2) || [];
    return {
      positionForceShowList,
      positionCollapseList: originList,
    };
  }, [stopTakeOrderInfos]);

  if (!stopTakeOrderInfos?.length) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={noop}>
      <View
        style={css`
          flex: 1;
        `}>
        {positionForceShowList?.map((config, idx) => (
          <CopyPositionControlItem
            positionInfo={positionInfo}
            config={config}
            subUid={subUid}
            isLeadPosition={isLeadPosition}
            key={config?.orderId || `positionForceShowList_${idx}`}
          />
        ))}
        {positionCollapseList?.length > 0 && (
          <View>
            {!isCollapsed && (
              <View>
                {positionCollapseList.map((config, idx) => (
                  <CopyPositionControlItem
                    positionInfo={positionInfo}
                    config={config}
                    subUid={subUid}
                    isLeadPosition={isLeadPosition}
                    key={config?.orderId || `positionCollapseList_${idx}`}
                  />
                ))}
              </View>
            )}
            <TouchableWithoutFeedback onPress={toggle}>
              <CollapseBar>
                <CollapseText>
                  {_t(
                    isCollapsed
                      ? 'af8001c1fa7d4000aae7'
                      : 'b1634e16db524000a950',
                  )}
                </CollapseText>
                {isCollapsed ? (
                  <DownArrow sizeNumber={12} color={colorV2.text40} />
                ) : (
                  <UpArrow sizeNumber={12} color={colorV2.text40} />
                )}
              </CollapseBar>
            </TouchableWithoutFeedback>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
