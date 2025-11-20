/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Spin, Input } from '@kufox/mui';

import PropTypes from 'prop-types';
import style from './style.less';

const noop = () => {};

class InputPwdBox extends React.Component {
  static getDerivedStateFromProps(nextProps, preState) {
    // const val = Object.keys(preState.vals).map(v => preState.vals[v]).join('');
    const val = Object.values(preState.vals).join('');

    const nextVals = {};
    if (!nextProps.value && val === '') {
      return null;
    }
    if (!nextProps.value && val) {
      return {
        vals: {},
      };
    }
    nextProps.value.split('').forEach((v, idx) => {
      nextVals[idx] = v;
    });

    if (nextProps.value !== +val) {
      return { ...preState, vals: nextVals };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      cur: 0,
      len: props.len,
      vals: {},
    };

    // this.next = this.next.bind(this);
  }

  reset = () => {
    this.setState({
      // cur: 0,
      vals: {},
      // len: 0,
      // value: '',
    });
    this.next(null, 0);
    if (this.ipt_0) {
      this.ipt_0?.focus?.();
    }
  };

  /**
   * 处理输入框检测到的按键操作
   * @param e
   * @param nextIpt
   */
  next = (e, nextIpt = null) => {
    const { cur } = this.state;
    let isBack = false;
    if (e && e.persist) {
      e.preventDefault();
      e.stopPropagation();
      e.persist();
      if (e.keyCode === 8) {
        isBack = true;
      }
    }

    //
    // if (cur === 5 && isBack) {
    //   return;
    // }
    let nextCur = this.setCur(nextIpt, isBack);
    if (nextCur === 6) {
      nextCur = 5;
    }
    if (nextCur !== null && (cur + 1 === nextCur || isBack)) {
      if (this[`ipt_${nextCur}`]) {
        this[`ipt_${nextCur}`]?.focus?.();
      }
      if (isBack) {
        this.setVal({ target: { value: undefined } }, nextCur);
      }
    }
  };

  // 获取vals
  getVals = () => {
    return Object.values(this.state.vals).join('');
  };

  /**
   * 设置当前聚焦的输入框
   * @param nextCur
   * @param isBack
   * @returns {*}
   */
  setCur = (nextCur, isBack = false) => {
    const { cur, len } = this.state;
    const d = isBack ? -1 : 1;
    const _cur = nextCur === undefined || nextCur === null ? cur + d : nextCur;
    if (_cur < len + 1 && _cur > -1) {
      this.setState({
        cur: _cur,
      });
      return _cur;
    }
    return null;
  };

  clickSetCur = () => {
    // const { len } = this.state;
    const v = this.getVals();
    let cur = v.length;
    if (cur === 6) {
      cur = 5;
    }
    this.setCur(cur);
    if (this[`ipt_${cur}`]) {
      this[`ipt_${cur}`]?.focus?.();
    }
    // this.next(null, v.length);
  };

  /**
   * 保存输入框的值
   * @param e
   * @param idx
   */
  setVal = (e, idx, goNext = true) => {
    const { vals } = this.state;
    const { onChange = noop } = this.props;
    const val = (e.target.value || '').replace(/[^\d]/g, '');
    if (val.length > 1 && goNext) {
      this.next(e);
      return;
    }
    const newVals = { ...vals, [idx]: val };

    this.setState({
      vals: newVals,
    });
    // 将当前输入框的值返回给外部事件
    onChange(
      Object.keys(newVals)
        .map((k) => newVals[k])
        .join(''),
    );

    if (val.length === 0) {
      // this.next(e, true);
    } else if (goNext) {
      this.next(e);
    }
  };

  /**
   * 删除操作
   * @param e
   */
  back = (e) => {
    if (e.keyCode === 8) {
      this.next(e);
    }
  };

  stopOnBlur = (e) => {
    e.stopPropagation();
  };

  render() {
    const { len, vals } = this.state;
    const { loading = false, onChange = noop } = this.props;
    // const { type } = this.props;
    /**
     * 生成指定数目的输入框
     * @param _len
     * @returns {any[]}
     */
    const createIpts = (_len) => {
      return new Array(_len).fill(1).map((key, idx) => {
        const otherProps = {};
        if (idx !== _len - 1) {
          otherProps.onBlur = this.stopOnBlur;
        }
        const ipt = (
          <Input
            key={idx}
            ref={(el) => {
              this[`ipt_${idx}`] = el;
            }}
            className={`${style.ipt_pwd} ipt_pwd`}
            onKeyUp={this.back}
            onClick={() => this.clickSetCur(idx)}
            value={vals[idx] ? '*' : undefined}
            cvalue={vals[idx]}
            onChange={(e) => this.setVal(e, idx)}
            type="text"
            autoComplete="off"
            onPaste={(e) => {
              e.preventDefault();
              const text = (e.clipboardData || window.clipboardData)?.getData('text');
              if (text) {
                const textArr = text?.split('').filter((v) => /\d/.test(v)) || [];
                const nextVals = textArr.reduce((prev, curr, key) => {
                  prev[key + idx] = curr;
                  return prev;
                }, vals);
                this.setState(
                  {
                    cur: idx + textArr.length,
                    vals: nextVals,
                  },
                  () => {
                    onChange(
                      Object.keys(vals)
                        .map((k) => vals[k])
                        .join(''),
                    );
                  },
                );
                this[`ipt_${idx}`]?.blur();
              }
            }}
            {...otherProps}
          />
        );
        return ipt;
      });
    };

    return (
      <Spin spinning={loading}>
        <div className={style.ipt_pwd_wrapper}>{createIpts(len)}</div>
      </Spin>
    );
  }
}

InputPwdBox.defaultProps = {
  len: 6,
};

InputPwdBox.propTypes = {
  len: PropTypes.number.isRequired, // 输入框个数
};

export default InputPwdBox;
