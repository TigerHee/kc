/*
 * owner: Borden@kupotech.com
 */
import React, { useState, useEffect, useCallback, useMemo, useRef, Fragment } from 'react';
import { Layout, Model, Actions } from '@kc/flexlayout-react';
import { map, debounce, includes } from 'lodash';
import { useDispatch, useSelector } from 'dva';
import styled from '@emotion/styled';
import { ICTriangleBottomOutlined } from '@kux/icons';
import { useSnackbar } from '@kux/mui/hooks';
import { _t } from 'src/utils/lang';
import { updateQueryStringParameter } from 'src/utils/getMainsiteLink';
import InfoBar from '@/pages/InfoBar';
import voice from '@/utils/voice';
import { event } from '@/utils/event';
import useMemoizedFn from '@/hooks/common/useMemoizedFn';
import SvgComponent from '@/components/SvgComponent';
import TooltipWrapper from '@/components/TooltipWrapper';
import SideTool from './components/SideTool';
import Placeholder from './components/Placeholder';
import FlexLayoutStyle from './components/FlexLayoutStyle';
import useCreateModule from './hooks/useCreateModule';
import useInLayoutIdMap from './hooks/useInLayoutIdMap';
import { INIT_FLOAT_DIFF_POSITION, SPLITTER_SIZE } from './constants';
import { DEFAULT_LAYOUTS_MAP, LAYOUT_FOR_INSPECT } from './layout';
import { MODULES_MAP } from '../moduleConfig';
import { addModuleToLayout, adjustSelectedIndexAfterFloat } from './utils';
import { SET_STORAGE_INTERVAL, removeCreatedModuleId } from './storage';
import RecommendedBar from 'src/trade4.0/pages/RecommendedBar';
import RiskTip from '@/components/RiskTip';
import useInitGuideTooltip from '@/components/GuideTooltip/hooks/useInit';

const FloatWarpper = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutFloatWarpper' */ './components/FloatWarpper');
});

/** 样式开始 */
const ModuleContainer = styled.section``;

const ModuleRecommendedContainer = styled.section`
  border-top: 1px solid ${(props) => props.theme.colors.divider4};
  &.bottom {
    position: sticky;
    bottom: 0;
  }
`;
const LayoutBox = styled.div`
  flex: 1;
  margin-top: ${SPLITTER_SIZE}px;
  // 240(单个模块的最小高度) * 2(两层) + 10(buffer, 缝隙余量)
  min-height: ${240 * 2 + 10}px;
  position: relative;
`;
const Icon = styled(SvgComponent)`
  margin: 0 6px;
  cursor: pointer;
  display: inline-flex;
  fill: ${(props) => props.theme.colors[props.color || 'icon60']};
  &:hover {
    fill: ${(props) => props.theme.colors[props.activeColor || 'icon']};
  }
`;
const FloatContainer = styled.div`
  position: fixed;
  z-index: 9;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.text};
  border: 1px solid ${(props) => props.theme.colors.divider4};
  background-color: ${(props) => props.theme.colors.background};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.05);
`;
/** 样式结束 */

// 是否巡检环境
const isInspect = includes(navigator.userAgent, 'Test-Inspection');

const XlLayout = React.memo(() => {
  const floatIds = useRef({});
  const layoutRef = useRef(null);
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const { inLayoutIdMap, preInLayoutIdMap, initiInLayoutIdMap, updateInLayoutIdMap } =
    useInLayoutIdMap();

  const isLogin = useSelector((state) => !!state.user.isLogin);
  const layouts = useSelector((state) => state.setting.layouts);
  const currentLayout = useSelector((state) => state.setting.currentLayout);
  const recommendbarPosition = useSelector((state) => state.setting.recommendbarPosition);

  useInitGuideTooltip();

  const { layoutConfig } = isInspect
    ? { layoutConfig: LAYOUT_FOR_INSPECT }
    : layouts?.[currentLayout] || {};

  const model = useMemo(() => {
    let result;
    try {
      result = layoutConfig ? Model.fromJson(layoutConfig) : null;
      initiInLayoutIdMap(result);
    } catch (error) {
      console.error(error);
    }
    return result;
  }, [layoutConfig]);
  // 新模块注入，用户的整个使用周期，同一个模块只会注入一次
  useCreateModule(model);

  const [floatList, setFloatList] = useState([]);
  const [floatInfo, setFloatInfo] = useState(null);

  useEffect(() => {
    event.on('module.change', onEvent);
    return () => {
      event.off('module.change');
    };
  }, []);

  useEffect(() => {
    if (isLogin) {
      event.on('layout.create', createLayout);
    }
    return () => {
      if (isLogin) {
        event.off('layout.create');
      }
    };
  }, [isLogin]);

  /**
   * 由于flexlayout-react内部对于TabButton的点击时间和鼠标按下事件都进行了处理
   * 无法从外部处理TabButton的点击监听。所以这里采用数据变更判断逻辑来判断是否点击，
   * 在inLayoutIdMap发生变更，且所有变更项都是从0 -> 1或者1 -> 0 (0是隐，1是显)，
   * 则认为是点击了TabButton
   */
  useEffect(() => {
    if (preInLayoutIdMap && inLayoutIdMap && preInLayoutIdMap !== inLayoutIdMap) {
      let isChange = false; // 是否存在变更项
      const isClickTabButton = Object.keys(inLayoutIdMap).every((key) => {
        const value = inLayoutIdMap[key];
        const preValue = preInLayoutIdMap[key];
        const isClickChange =
          preValue !== value && [preValue, value].every((v) => [0, 1].includes(v));
        if (!isChange && isClickChange) {
          isChange = true;
        }
        return preValue === value || isClickChange;
      });
      if (isChange && isClickTabButton) {
        voice.notify('click_event');
      }
    }
  }, [inLayoutIdMap]);

  // useEffect(() => {
  //   const displayInLayoutIdMap = {};
  //   for (let k in inLayoutIdMap) {
  //     const v = inLayoutIdMap[k];
  //     const name = MODULES_MAP[k].renderName();
  //     displayInLayoutIdMap[typeof name === 'string' ? name : '当前委托'] =
  //       v === undefined ? '没在布局中' : v === 0 ? '隐藏中' : '显示中';
  //   }
  //   console.log(
  //     `///////inLayoutIdMap`,
  //     inLayoutIdMap ? displayInLayoutIdMap : inLayoutIdMap,
  //   );
  // }, [inLayoutIdMap]);

  const createLayout = useMemoizedFn(({ name, template, cb }) => {
    const _layoutConfig =
      template === 'current' ? model.toJson() : DEFAULT_LAYOUTS_MAP[template].defaultLayout;

    dispatch({
      type: 'setting/addLayout',
      payload: {
        name,
        layoutConfig: JSON.stringify(_layoutConfig),
      },
    }).then((res) => {
      if (res.success) {
        // 添加到布局中
        dispatch({
          type: 'setting/updateLayouts',
          payload: {
            ...res.data,
            layoutConfig: _layoutConfig,
          },
        });
        // 切换布局为新加的布局
        dispatch({
          type: 'setting/updateLayout',
          payload: {
            currentLayout: res.data.code,
          },
        });
        message.success(_t('operation.succeed'));
        if (cb) cb();
      }
    });
  });

  const onEvent = useMemoizedFn(({ id, checked }) => {
    if (!model) return;
    const { current: _layoutRef } = layoutRef;
    if (checked) {
      addModuleToLayout({ model, id });
    } else if (checked === false) {
      // false代表需要手动移除模块
      // 兼容sentry报错场景：https://k-devdoc.atlassian.net/browse/KCMG-15000
      if (floatIds.current[id]) removeFloat({ id });
      model.doAction(Actions.deleteTab(id));
    }
    updateInLayoutIdMap({ [id]: checked ? 1 : undefined });
  });

  const createFloat = (node) => {
    const selectedNode = node.getSelectedNode();
    const id = selectedNode.getId();
    const component = selectedNode.getComponent();
    const name = MODULES_MAP[id]?.renderName() || selectedNode.getName();
    const rect = node.getRect();
    // 偏移一点，来错开原模块，让用户识别悬浮模块
    rect.x += INIT_FLOAT_DIFF_POSITION;
    rect.y -= INIT_FLOAT_DIFF_POSITION;
    // 边界判断
    try {
      // 获取边界宽度
      const boundsWidth = document.getElementsByTagName('body')[0].getBoundingClientRect().width;
      // 因为工具栏可能隐藏，此时新打开的浮动模块可能会有部分展示在边界外，所以横向需要矫正
      if (rect.x + rect.width > boundsWidth) {
        rect.x = boundsWidth - rect.width;
      }
    } catch (e) {
      console.log(e);
    }

    // 先加入队列在删除tab，防止触发close事件
    floatIds.current[id] = true;
    // 从新切换活动tab
    adjustSelectedIndexAfterFloat(node, floatIds.current);

    model.doAction(
      Actions.updateNodeAttributes(id, {
        enableDrag: false,
        className: 'flexlayout__tab_custom_disabled',
      }),
    );
    setFloatInfo((pre) => ({ ...pre, focusFloatId: id }));
    setFloatList((pre) => [...pre, { id, name, rect, component }]);
  };

  const removeFloat = ({ id }) => {
    delete floatIds.current[id];
    setFloatList((pre) => pre.filter((v) => v.id !== id));
    model.doAction(Actions.selectTab(id));
    model.doAction(
      Actions.updateNodeAttributes(id, {
        className: '',
        enableDrag: true,
      }),
    );
  };

  const onFloatInfoChange = (id, options) => {
    setFloatInfo((pre) => {
      if (options.pin) {
        const isCancelPin = pre.pinFloatId === id;
        return {
          ...pre,
          ...(pre.pinFloatId && !isCancelPin ? { focusFloatId: pre.pinFloatId } : {}),
          pinFloatId: isCancelPin ? undefined : id,
        };
      }
      if (options.focus && pre.focusFloatId !== id) {
        return { ...pre, focusFloatId: id };
      }
      return pre;
    });
  };
  // 单开
  const openSinglePage = (id) => {
    const newWindow = window.open(updateQueryStringParameter(window.location.href, 'module', id));
    newWindow.opener = null;
  };

  const onModelChange = useCallback(
    debounce((nextModel, action) => {
      if (!['FlexLayout_SetActiveTabset'].includes(action?.type)) {
        const modelJson = nextModel.toJson();
        dispatch({
          type: 'setting/editLayout',
          payload: {
            code: currentLayout,
            layoutConfig: modelJson,
          },
        });
      }
    }, SET_STORAGE_INTERVAL),
    [currentLayout],
  );

  const factory = (node) => {
    const id = node.getId();
    const isVisible = node.isVisible();

    // 未显示的组件，直接销毁，以确保业务组件内的生命周期完整走通
    if (!isVisible) {
      return null;
    }

    if (floatIds.current[id]) {
      return <Placeholder iconId="float" describe={_t('2XpiUpemy8qMqeUqazho3D')} />;
    }
    const { getComponent, ...otherConfig } = MODULES_MAP[id] || {};
    if (getComponent) {
      return getComponent(otherConfig);
    }
    return null;
  };

  // 根据id自定义title
  const titleFactory = (node) => {
    const id = node.getId();
    if (MODULES_MAP[id]?.renderName) {
      return {
        titleContent: MODULES_MAP[id]?.renderName(),
      };
    }
  };

  const onRenderTab = (node, renderValues) => {
    const id = node.getId();
    // 兼容模块下掉布局中还存在的情景
    if (!MODULES_MAP[id]) {
      model.doAction(Actions.deleteTab(id));
      removeCreatedModuleId(id);
      return;
    }
    // 校正node的悬浮属性，防止模块悬浮后直接刷新引发属性不对应的问题
    if (
      !floatIds.current[id] &&
      includes(node._attributes.className, 'flexlayout__tab_custom_disabled')
    ) {
      model.doAction(
        Actions.updateNodeAttributes(id, {
          className: '',
          enableDrag: true,
        }),
      );
    }
    if (!node._parent?.getLocation) {
      // 关闭Tab在任务栏回收
      node.setEventListener('close', () => onEvent({ id }));
    } else {
      const { renderSideTool = (v) => v } = MODULES_MAP[id] || {};
      // 渲染工具栏tab
      renderValues.content = renderSideTool(<SideTool isActive={node._visible} id={id} />);
    }
  };

  const onRenderTabSet = (node, renderValues) => {
    const id = node.getId();
    const selectNode = node.getSelectedNode();
    const selectId = selectNode?.getId();
    // 添加操作图标
    if (MODULES_MAP[selectId] && node?.getTabLocation) {
      const isMaximized = node.isMaximized();
      const { actions, extraActions } = MODULES_MAP[selectId];
      const actionButtons = [
        ...(extraActions ? extraActions() : []),
        ...map(actions, (v) => {
          switch (v) {
            case 'popout':
              return (
                <TooltipWrapper key="popout" title={_t('bcmAefu9GjBJ5kxAjywsuw')}>
                  <Icon type="popout" onClick={() => openSinglePage(selectId)} />
                </TooltipWrapper>
              );
            case 'float':
              return isMaximized || floatIds.current[selectId] ? null : (
                <TooltipWrapper key="float" title={_t('hFR4vLcY2meP4NPJGtA2Vn')}>
                  <Icon type="float" onClick={() => createFloat(node)} />
                </TooltipWrapper>
              );
            case 'maximize':
              return (
                <TooltipWrapper
                  key="maximize"
                  title={isMaximized ? _t('5Cnajt18xemxFx8yW68zSH') : _t('2x3vFpNixPCAQBijZFMVfV')}
                >
                  <Icon
                    type={isMaximized ? 'restore' : 'maximize'}
                    onClick={() => model.doAction(Actions.maximizeToggle(id))}
                  />
                </TooltipWrapper>
              );
            default:
              return null;
          }
        }),
      ].filter(Boolean);
      if (actionButtons.length) {
        renderValues.buttons.push(...actionButtons);
      }
    }
  };

  return (
    <Fragment>
      <RiskTip />
      <ModuleContainer>
        <InfoBar />
      </ModuleContainer>
      {recommendbarPosition === 'top' && (
        <ModuleRecommendedContainer>
          <RecommendedBar />
        </ModuleRecommendedContainer>
      )}
      <LayoutBox>
        <FlexLayoutStyle />
        {floatList.map((item) => {
          const { id, rect, component, ...other } = item;
          const { getComponent, ...otherConfig } = MODULES_MAP[id] || {};
          // const { minWidth, minHeight } = otherConfig;
          return (
            <React.Suspense key={id} fallback={<FloatContainer />}>
              {/* 浮动模块 */}
              <FloatWarpper
                initRect={rect}
                minWidth={280}
                minHeight={240}
                count={floatList.length}
                onClose={() => removeFloat({ id })}
                isPin={id === floatInfo?.pinFloatId}
                isFocus={id === floatInfo?.focusFloatId}
                onInfoChange={(v) => onFloatInfoChange(id, v)}
                {...other}
              >
                {getComponent ? getComponent({ ...otherConfig, isFloat: true }) : null}
              </FloatWarpper>
            </React.Suspense>
          );
        })}
        {Boolean(model) && (
          <Layout
            model={model}
            ref={layoutRef}
            factory={factory}
            onRenderTab={onRenderTab}
            titleFactory={titleFactory}
            onModelChange={onModelChange}
            onRenderTabSet={onRenderTabSet}
            icons={{
              close: () => <Icon type="layout-close" activeColor="text" style={{ margin: 0 }} />,
              more: <ICTriangleBottomOutlined size={10} />,
            }}
          />
        )}
      </LayoutBox>
      {recommendbarPosition === 'bottom' && (
        <ModuleRecommendedContainer className="bottom">
          <RecommendedBar />
        </ModuleRecommendedContainer>
      )}
    </Fragment>
  );
});

export default XlLayout;
