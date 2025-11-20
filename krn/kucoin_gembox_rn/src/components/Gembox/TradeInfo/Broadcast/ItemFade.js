/**
 * Owner: roger.chen@kupotech.com
 */
import React from 'react';
import {Animated, View, Easing} from 'react-native';
/**
 *   duration, // 动画执行时间
 *   delay,   // 动画间隔时间
 *   easing: Easing.linear,    // 缓动函数
 *   startOpacity: 0,       // 动画初始透明度
 *   endOpacity: 1,     // 动画结束透明度
 *   startScale,       // 动画初始放大比例
 *   endScale: 1,    // 动画结束放大比例
 *   list  数据列表
 */
class ItemFade extends React.Component {
  constructor(props) {
    super(props);
    let list = this.props.list;
    let row = list.length;
    this.state = {
      // 第一个index
      zindex: new Animated.Value(row),
    };
    this.duration = this.props.duration || 1400;
    this.delay = this.props.delay || 0;
    this.easing = this.props.easing || Easing.linear;
    this.startOpacity = this.props.startOpacity || 0;
    this.endOpacity = this.props.startOpacity || 1;
    this.startScale = this.props.startScale || 1;
    this.endScale = this.props.endScale || 1;
  }
  UNSAFE_componentWillMount() {
    let list = this.props.list;
    let row = list.length;
    for (let index = 1; index <= row; index++) {
      let key = `opacity${index}`;
      this.setState({
        [key]: new Animated.Value(index === 1 ? 1 : 0),
      });
    }
  }

  startAnimated = () => {
    const {list} = this.props;
    let row = list.length;
    let sequence = [];
    for (let i = 1; i <= row; i++) {
      sequence.push(
        // 第x张显示
        Animated.timing(this.state[`opacity${i}`], {
          toValue: 1,
          duration: this.duration,
          delay: 0,
          easing: this.easing, // 缓动函数
          useNativeDriver: true,
        }),
      );
      sequence.push(
        // 第x张隐藏
        Animated.timing(this.state[`opacity${i}`], {
          toValue: 0,
          duration: this.duration,
          delay: this.delay,
          easing: this.easing, // 缓动函数
          useNativeDriver: true,
        }),
      );
    }
    const animation = Animated.sequence(sequence);
    // 必须大于1才启动动画
    row > 1 &&
      Animated.loop(animation, {
        useNativeDriver: true,
      }).start();
  };

  render() {
    const imageAddStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
    return (
      <View style={this.props.style}>
        {this.props.list.map((v, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                {
                  // 索引
                  zIndex:
                    index === 0
                      ? this.state.zindex
                      : this.props.list.length - index,
                  opacity: this.state[`opacity${index + 1}`],
                  // transform: [
                  //   {
                  //     scale: this.state[`opacity${index + 1}`].interpolate({
                  //       inputRange: [0, 1],
                  //       outputRange: [this.startScale, this.endScale],
                  //     }),
                  //   },
                  // ],
                },
                imageAddStyle,
              ]}>
              {v}
            </Animated.View>
          );
        })}
      </View>
    );
  }

  componentDidMount() {
    this.startAnimated();
  }
}

export default ItemFade;
