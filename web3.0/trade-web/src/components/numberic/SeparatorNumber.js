/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import React from 'react';

export const checkNumber = (n) => {
  const exp = /^[0-9.]+$/;
  return exp.test(n);
};

export const separateNumber = (n) => {
  const num = `${n}`;
  let integer = num;
  let floater = '';
  if (num.indexOf('.') > -1) {
    const arr = num.split('.');
    integer = arr[0];
    floater = arr[1];
  }
  const len = integer.length;
  let count = 0;
  let parser = '';
  for (let i = len - 1; i >= 0; i -= 1) {
    parser = integer[i] + parser;
    count += 1;
    if (count % 3 === 0 && i > 0) {
      parser = `,${parser}`;
    }
  }
  if (floater !== '') {
    floater = `.${floater}`;
  }
  return `${parser}${floater}`;
};

export const separatePositions = (n) => {
  const num = `${n}`;
  const poss = [];
  for (let i = num.length; i >= 0; i -= 1) {
    if (num[i] === ',') {
      poss.push(i);
    }
  }
  return poss.reverse();
};

/**
 * @deprecated
 * 这个组件适用于给内容是数字的组件加千分位分隔符
 * <SeparatorNumber>100000</SeparatorNumber>
 * <SeparatorNumber>
 *   <span>100000</span>
 * </SeparatorNumber>
 * <SeparatorNumber>
 *   <span>
 *     <span>100</span>
 *     <span>0000</span>
 *     <span>09.3455</span>
 *   </span>
 * </SeparatorNumber>
 */
export default class SeparatorNumber extends React.Component {

  static defaultProps = {
    children: null,
  };

  render() {
    const { children } = this.props;

    if (typeof children === 'undefined' || !children) {
      return children;
    }

    if (!children.props) { // plaintext
      if (checkNumber(children)) {
        // 直接加千分位分隔符
        return (<span>{separateNumber(children)}</span>);
      } else {
        return children;
      }
    }

    if (children.length > 1) {
      return children;
    }

    const numberChildren = children.props.children;
    if (!numberChildren.length) { // plaintext
      if (checkNumber(numberChildren)) {
        // 直接加千分位分隔符
        return React.cloneElement(children, { children: separateNumber(numberChildren) });
      } else {
        return children;
      }
    }

    if (numberChildren.length > 1) {
      // 处理数字
      let number = '';
      const chunks = [];
      React.Children.forEach(numberChildren, (child) => {
        number = `${number}${child.props.children}`;
        chunks.push(child.props.children);
      });
      if (checkNumber(number)) {
        const spNum = separateNumber(number);
        const spPos = separatePositions(spNum);

        if (spPos.length) {
          const childEditMap = {};
          let redu = 0;
          _.each(chunks, (chunk, ci) => {
            redu += chunk.length;

            let originStr = numberChildren[ci].props.children;
            let found = 0;
            _.each(spPos, (pos) => {
              if (redu > pos) { // 找到了应该呆的地方
                found += 1;

                const subLen = redu - pos;
                const subPos = originStr.length - subLen;

                const sub1 = originStr.substring(0, subPos);
                const sub2 = originStr.substring(subPos);

                originStr = `${sub1},${sub2}`;
                redu += 1;
              }
            });
            for (let i = 0; i < found; i += 1) { // 处理过的就去掉了
              spPos.shift();
            }
            childEditMap[ci] = originStr;
          });

          const arrChildrens = React.Children.map(numberChildren, (child, i) => {
            if (childEditMap[i]) {
              return React.cloneElement(child, {
                children: childEditMap[i],
                key: i,
              });
            } else {
              return child;
            }
          });
          return React.cloneElement(children, {
            children: arrChildrens,
          });
        } else {
          return children;
        }
      } else {
        return children;
      }
    } else if (checkNumber(numberChildren.props.children)) {
      // 直接加千分位分隔符
      return React.cloneElement(children,
        { children: separateNumber(numberChildren.props.children) });
    } else {
      return children;
    }
  }
}
