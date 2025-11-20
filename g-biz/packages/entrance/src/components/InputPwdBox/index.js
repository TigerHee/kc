/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { forEach } from 'lodash';
import { Input, styled } from '@kux/mui';

const IptPwdWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .ipt_pwd {
    width: 64px;
    height: 72px;
    padding: 0;
    text-align: center;
    .KuxInput-input {
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 1;
      font-size: 28px;
    }
    ${(props) => props.theme.breakpoints.down('sm')} {
      width: 48px;
      height: 54px;
      font-size: 24px;
    }
  }
`;

const noop = () => {};

class InputPwdBox extends React.Component {
  // static getDerivedStateFromProps(nextProps, preState) {
  //   // const val = Object.keys(preState.vals).map(v => preState.vals[v]).join('');
  //   const val = Object.values(preState.vals).join('');

  //   const nextVals = {};
  //   if (!nextProps.value && val === '') {
  //     return null;
  //   }
  //   if (!nextProps.value && val) {
  //     return {
  //       vals: {},
  //     };
  //   }
  //   nextProps.value.split('').forEach((v, idx) => {
  //     nextVals[idx] = v;
  //   });
  //   if (nextProps.value !== +val) {
  //     return { ...preState, vals: nextVals };
  //   }
  //   return null;
  // }

  constructor(props) {
    super(props);
    this.state = {
      // value: props.value,
      cur: 0,
      len: props.len,
      vals: {},
    };
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
      this.ipt_0.focus();
    }
  };

  /**
   * 处理输入框检测到的按键操作
   * @param e
   * @param nextIpt
   */
  next = (e, nextIpt = null) => {
    let isBack = false;
    const val = (e.target.value || '').replace(/[^\d]/g, '');
    if (e && e.persist) {
      e.preventDefault();
      e.stopPropagation();
      e.persist();
      if (e.keyCode === 8) {
        isBack = true;
      }
    }
    const nextCur = this.setCur(nextIpt, isBack);
    if (this[`ipt_${nextCur}`]) {
      this[`ipt_${nextCur}`].focus();
    }
    // 处理一次粘贴多个字符的focus表现s
    if (val.length > 1) {
      let _nextCur = val.length;
      _nextCur = _nextCur < 6 ? _nextCur : 5;
      if (this[`ipt_${_nextCur}`]) {
        this[`ipt_${_nextCur}`].focus();
      }
      this.setState({
        cur: _nextCur,
      });
    }
  };

  // 获取vals
  getVals = () => {
    return Object.values(this.state.vals).join('');
  };

  /**
   * 设置当前聚焦的输入框
   * @param cur
   * @param isBack
   * @returns {*}
   */
  setCur = (curIndex, isBack = false, noChange) => {
    if (noChange) {
      this.setState({
        cur: curIndex,
      });
      return curIndex;
    }
    const { len, cur } = this.state;
    const d = isBack ? -1 : 1;
    let _cur = curIndex || cur + d;
    if (_cur === len) {
      _cur = len - 1;
    }
    if (_cur < 0) {
      _cur = 0;
    }
    this.setState({
      cur: _cur,
    });
    return _cur;
  };

  /**
   * 寻找聚焦输入框
   * @param _index
   * @param _vals
   */
  findIndex = (_index, _vals) => {
    if (!_index || _vals[_index] || _vals[_index - 1]) {
      return _index;
    }
    return this.findIndex(_index - 1, _vals);
  };

  clickSetCur = (index) => {
    const { vals } = this.state;
    const cur = this.findIndex(index, vals);
    this.setCur(cur, false, true);
    this[`ipt_${cur}`].focus();
    this[`ipt_${cur}`].setSelectionRange(1, 1);
  };

  /**
   * 保存输入框的值
   * @param e
   * @param idx
   */
  setVal = (e, idx, goNext = true) => {
    const { vals } = this.state;
    const { onChange = noop } = this.props;
    const _val = (e.target.value || '').replace(/[^\d]/g, '');
    const numReg = /^[0-9]+(\.?[0-9]*)?$/;
    let val = _val;
    let newVals = {};
    if (_val && !numReg.test(_val)) {
      val = '';
      newVals = { ...vals };
    } else {
      if (val.length === 2 && vals[idx]) {
        val = val.replace(vals[idx], '');
      }
      newVals = { ...vals, [idx]: val };
    }

    // 处理一次粘贴多个字符的输入情况
    if (val.length > 1) {
      newVals = {};
      const valArr = val.split('');
      const limitNumber = 6;
      forEach(valArr, (item, index) => {
        if (index < limitNumber) {
          newVals[index] = item;
        }
      });
    }
    this.setState({
      vals: newVals,
    });
    // 将当前输入框的值返回给外部事件
    onChange(
      Object.keys(newVals)
        .map((k) => newVals[k])
        .join(''),
    );
    if (val && goNext) {
      this.next({ target: { value: val } });
    }
  };

  /**
   * 删除操作
   * @param e
   */
  back = (e, idx) => {
    const { vals } = this.state;
    if (e.keyCode === 8) {
      if (!vals[idx]) {
        const targetId = idx < 1 ? 0 : idx - 1;
        const newVals = { ...vals, [targetId]: '' };
        this.setState({
          vals: newVals,
          cur: targetId,
        });
        if (this[`ipt_${targetId}`]) {
          this[`ipt_${targetId}`].focus();
        }
      }
    }
  };

  stopOnBlur = (e) => {
    e.stopPropagation();
  };

  render() {
    const { len, vals } = this.state;
    // const { loading = false } = this.props;
    const { type } = this.props;
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
        const showValue = type === 'password' ? '*' : vals[idx];
        const ipt = (
          <Input
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            ref={(el) => {
              this[`ipt_${idx}`] = el;
            }}
            className="ipt_pwd"
            onKeyDown={(e) => this.back(e, idx)}
            onClick={() => this.clickSetCur(idx)}
            value={vals[idx] ? showValue : ''}
            cvalue={vals[idx]}
            onChange={(e) => this.setVal(e, idx)}
            type="text"
            autoComplete="off"
            inputProps={{
              pattern: '[0-9]*',
              autoFocus: idx === 0,
            }}
            {...otherProps}
          />
        );
        return ipt;
      });
    };
    return <IptPwdWrapper style={{ direction: 'ltr' }}>{createIpts(len)}</IptPwdWrapper>;
  }
}

InputPwdBox.defaultProps = {
  len: 6,
};

export default InputPwdBox;
