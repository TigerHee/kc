# kufox-mui

基于 mui 使用 emotion 的 mui 组件库。

## 快速开始

### 安装依赖

```
yarn add @kux/mui@next
```

### 开始使用

```javascript
import { ThemeProvider, Button } from '@kux/mui';

const Renderer = () => {
  return (
    <ThemeProvider theme="light">
      <Button>Demo</Button>
    </ThemeProvider>
  );
};
```

## JsDoc 开发和使用指南

使用 JsDoc 的目的是为了让开发者和使用者更了解组件拥有的 props。

### function 组件

以下是一个代码片段：

```javascript
/**
 * 表单项组件，用于渲染表单的某个输入框和Label内容
 * @typedef {object} IProps
 * @property {React.ReactChildren} children
 * @property {React.ReactNode=} label

 * @param {IProps} props
 * @returns {React.ReactNode}
 */
export function FunctionDemo(props) {
  return <div>FunctionDemo</div>;
}
```

### class 组件

以下是一个代码片段：

```javascript
/**
 * @typedef {object} Props
 * @property {string} className
 * @property {number} numberProp 描述
 * @property {'1' | '2'=} testProp 描述，可能的值为1或2
 *
 * @extends {React.Component<Props>}
 */
class DemoComponent extends React.Component {}
```

可以通过`@typedef`定义一个类型，`@property`定义这个 object 中的属性，`@property {'1' | '2'=} testProp`中的`=`代表是可选值。
