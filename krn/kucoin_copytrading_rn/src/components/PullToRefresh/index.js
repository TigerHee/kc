import React, {PureComponent} from 'react';
import {Animated, PanResponder, View} from 'react-native';
import {css} from '@emotion/native';

const applyDamping = moveY => {
  let newMoveY = 0;

  if (moveY <= 10) {
    newMoveY = moveY * 0.3;
  }

  if (moveY <= 100) {
    newMoveY = 3 + (moveY - 10) * 0.5;
  } else {
    newMoveY = 48 + (moveY - 100) * 0.4;
  }

  return newMoveY;
};

/**
 * 下拉手势容器
 * @desc 利用PanResponder响应
 */
export default class PullToRefresh extends PureComponent {
  constructor(props) {
    super(props);
    // 当前容器移动的距离
    this.containerTranslateY = 0;
    // 内部scroll容器顶部滚动的距离
    this.innerScrollTop = 0;
    // header 组件的引用
    this.headerRef = null;
    // inner scroll ref
    this.scrollRef = null;
    this.moveY = 0;
    this.updateInnerScrollRef = ref => {
      this.scrollRef = ref;
    };
    // 下拉容器的过程中，动态传递下拉的距离给 header 组件，直接调用方法，不走本组件的 setState，避免卡顿
    this.containerTopChange = ({value}) => {
      this.containerTranslateY = value;
      if (this.headerRef) {
        this.headerRef.setProgress({
          pullDistance: value,
          percent:
            value /
            (this.props.refreshTriggerHeight || this.props.headerHeight),
        });
      }
    };
    this.innerScrollCallback = event => {
      if (this.innerScrollTop === event.nativeEvent.contentOffset.y) {
        return;
      }

      this.innerScrollTop = event.nativeEvent.contentOffset.y;

      this.checkScroll();
    };
    this.checkScroll = () => {
      if (this.isInnerScrollTop()) {
        if (this.state.scrollEnabled) {
          this.setState({
            scrollEnabled: false,
          });
        }
      } else {
        if (!this.state.scrollEnabled) {
          this.setState({
            scrollEnabled: true,
          });
        }
      }
    };
    this.state = {
      // 容器偏离顶部的距离
      containerTop: new Animated.Value(0),
      // 是否允许内部scrollview滚动
      scrollEnabled: false,
    };
    this.state.containerTop.addListener(this.containerTopChange);
    // this.onStartShouldSetResponder = this.onStartShouldSetResponder.bind(this);
    this.onMoveShouldSetResponder = this.onMoveShouldSetResponder.bind(this);
    this.onResponderGrant = this.onResponderGrant.bind(this);
    this.onResponderReject = this.onResponderReject.bind(this);
    this.onPanResponderMove = this.onPanResponderMove.bind(this);
    this.onPanResponderRelease = this.onPanResponderRelease.bind(this);
    this.onPanResponderTerminate = this.onPanResponderTerminate.bind(this);
    this.onResponderTerminationRequest =
      this.onResponderTerminationRequest.bind(this);
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: this.onMoveShouldSetResponder,
      onPanResponderGrant: this.onResponderGrant,
      onPanResponderReject: this.onResponderReject,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminationRequest: this.onResponderTerminationRequest,
      onPanResponderTerminate: this.onPanResponderTerminate,
      onShouldBlockNativeResponder: (_event, _gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  onMoveShouldSetResponder(_event, gestureState) {
    // 手动判断是否需要将事件传递给子组件 fix 安卓端y 轴为 0 点击事件 偶现拦截无法触发问题
    if (Math.abs(gestureState.dx) < 1 && Math.abs(gestureState.dy) < 1) {
      // 如果位移较小，允许事件传递给子组件
      return false;
    }

    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
      return false;
    }
    if (this.props.refreshing) {
      // 正在刷新中，不接受再次下拉
      return false;
    }
    // return false;
    return !this.state.scrollEnabled;
  }
  onResponderGrant(_event, _gestureState) {
    // console.log(`====== grant`);
  }
  onResponderReject(_event) {
    // console.log(`====== reject`);
  }
  onPanResponderMove(_event, gestureState) {
    const DISTANCE_X_LIMIT = 50;
    // 处理手势冲突，如拉取 y 轴时同时误滑x 轴  忽略本次行为操作
    // 处理手势冲突，如拉取时 x轴大于 y 轴 忽略
    if (
      Math.abs(gestureState.dx) > DISTANCE_X_LIMIT ||
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
    ) {
      return;
    }
    if (this.moveY === gestureState.dy) {
      return;
    }

    this.moveY = gestureState.dy;
    // 增加滑动阻尼
    // const moveY =
    //   gestureState.dy > 60 ? (gestureState.dy - 60) / 3 + 60 : gestureState.dy;

    const moveY = applyDamping(this.moveY);

    if (moveY > 230) {
      return;
    }
    if (moveY >= 0) {
      // const dy = Math.max(0, gestureState.dy);
      this.state.containerTop.setValue(moveY);
    } else {
      this.state.containerTop.setValue(0);
      if (this.scrollRef) {
        if (typeof this.scrollRef.scrollToOffset === 'function') {
          // inner is FlatList
          this.scrollRef.scrollToOffset({
            offset: -gestureState.dy,
            animated: true,
          });
        } else if (typeof this.scrollRef.scrollTo === 'function') {
          // inner is ScrollView
          this.scrollRef.scrollTo({
            y: -gestureState.dy,
            animated: true,
          });
        }
      }
    }
  }
  onPanResponderRelease(evt, gestureState) {
    // 判断是否达到了触发刷新的条件
    const threshold =
      this.props.refreshTriggerHeight || this.props.headerHeight;
    if (this.containerTranslateY >= threshold) {
      // 触发刷新
      this.props.onRefresh();
    } else {
      // 没到刷新的位置，回退到顶部
      this._resetContainerPosition();
    }
    this.checkScroll();
  }
  onResponderTerminationRequest(_event) {
    return false;
  }
  onPanResponderTerminate() {
    this._resetContainerPosition();
    this.checkScroll();
  }
  _resetContainerPosition() {
    Animated.timing(this.state.containerTop, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }
  isInnerScrollTop() {
    return this.innerScrollTop <= this.props.topPullThreshold;
  }
  componentDidUpdate(prevProps, _prevState) {
    if (!prevProps.refreshing && this.props.refreshing) {
      // 从 未加载 变化到 加载中
      const holdHeight =
        this.props.refreshingHoldHeight || this.props.headerHeight;
      Animated.timing(this.state.containerTop, {
        toValue: holdHeight,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else if (prevProps.refreshing && !this.props.refreshing) {
      // 从 加载中 变化到 未加载
      Animated.timing(this.state.containerTop, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }
  componentWillUnmount() {
    this.state.containerTop.removeAllListeners();
  }
  renderHeader() {
    const style = {
      position: 'absolute',
      left: 0,
      zIndex: 1,
      width: '100%',
      top: -this.props.headerHeight,
      marginTop: 40,
      transform: [{translateY: this.state.containerTop}],
    };

    const Header = this.props.HeaderComponent;
    return (
      <Animated.View style={style}>
        <Header
          ref={c => {
            this.headerRef = c;
          }}
          refreshing={this.props.refreshing}
        />
      </Animated.View>
    );
  }
  render() {
    const child = React.cloneElement(this.props.children, {
      onScroll: this.innerScrollCallback,
      bounces: false,
      alwaysBounceVertical: false,

      scrollEnabled: this.state.scrollEnabled,
      ref: this.updateInnerScrollRef,
    });
    return (
      <View style={this.props.style} {...this._panResponder.panHandlers}>
        <Animated.View
          style={[
            {flex: 1, transform: [{translateY: this.state.containerTop}]},
          ]}>
          {child}
        </Animated.View>
        {this.renderHeader()}
      </View>
    );
  }
}

PullToRefresh.defaultProps = {
  style: css`
    flex: 1;
  `,
  refreshing: false,
  topPullThreshold: 20,
};
