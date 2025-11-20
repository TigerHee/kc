/**
 * Owner: victor.ren@kupotech.com
 */
/**
 *  生成svg对应的组件
 */
const fs = require('fs');
const path = require('path');

const resolvePath = (url) => path.resolve(__dirname, url);

function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
// 清空components目录
delDir(resolvePath('../src/components'));

const readDir = fs.readdirSync(resolvePath('../src/icons'));

// 生成组件文件
readDir.forEach((item) => {
  const fileName = item.replace('.svg', '');

  // 有-filled则是Filled图标
  const suffix = fileName.includes('-filled') ? 'Filled' : 'Outlined';
  const componentName = `${fileName.slice(0, 1).toLocaleUpperCase()}${fileName.slice(
    1,
  )}${suffix}`.replace('-filled', '');

  // 如果没有components就创建
  if (!fs.existsSync(resolvePath('../src/components'))) {
    fs.mkdir(resolvePath('../src/components'), (err) => {
      if (err) {
        console.log('err === ', err);
      }
    });
  }
  console.log('----', resolvePath(`../src/components/${componentName}.js`))
  fs.writeFileSync(
    `${resolvePath(`../src/components/${componentName}.js`)}`,
    `import React from 'react';
import Icon from '../hoc/Icon';
import { ReactComponent } from '../icons/${item}';

const ForwardIcon = React.forwardRef((props, ref) => {
  return <ReactComponent {...props} ref={ref} />;
});

const KuFoxIcons = Icon(ForwardIcon);
KuFoxIcons.displayName = '${componentName}';
export default KuFoxIcons;
`,
    'utf-8',
    (err) => {
      err && console.log('err === ', err);
    },
  );
});

/**
 *  components注入到index.js
 */

const componentsDir = fs.readdirSync(resolvePath('../src/components'));

const exportArr = componentsDir.map((item) => {
  const fileName = item.replace('.js', '');
  return `export { default as ${fileName} } from './components/${fileName}';`;
});

fs.writeFileSync(
  resolvePath('../src/index.js'),
  `${exportArr.join('\n')}
`,
  'utf-8',
  (err) => {
    err && console.log('err === ', err);
  },
);

console.log('icon组件加载成功');
