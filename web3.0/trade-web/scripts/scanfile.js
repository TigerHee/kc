/* eslint-disable no-continue */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable import/no-dynamic-require */
/**
 * 扫描需要编写的单元测试
 * 会在 download 目录下生成两个文件
 */

const { paperwork } = require('precinct');
const cabinet = require('filing-cabinet');
const child_process = require('child_process');

const packageJson = require(`${process.env.PWD}/package`);
const fs = require('fs');
const path = require('path');
const { pathToRegexp } = require('path-to-regexp');

const getRelativePath = (_p) => {
  return path.join(process.env.PWD, _p);
};

const checkerConfig = require(`${process.env.PWD}/.kc-web-checker.js`);

const config = Object.assign(
  {},
  {
    src: ['./src'], // 文件目录， 如果是根目录，那么填写 ./
    exclude: ['node_modules', '.umi'], // 排除的目录
    name: '*.jsx|*.js', // 文件类型，多个类型以| 分割， 如 *.js|*.ts|*.tsx
    type: 'f', // 查找类型，f 代表file, 一般不用更改
    min: 2,
  },
  checkerConfig.test || {},
);

const srcRegs = config.src.map((v) => {
  return pathToRegexp(path.join(process.env.PWD, v), [], {
    end: false,
  });
});

const excludeRegs = config.exclude.map((v) => {
  return pathToRegexp(path.join(process.env.PWD, v), [], {
    end: false,
  });
});

const exec = async (
  _cmdLine,
  logLevel = 'silent',
  resolveLogFn = () => {},
  cwd = process.env.PWD,
) => {
  // console.log('exec: ', _cmdLine, logLevel);
  return new Promise((resolve) => {
    const child = child_process.exec(_cmdLine, { cwd }, (error, stdout, stderr) => {
      resolve({
        error,
        data: stdout,
      });
    });
    child.stdout.on('data', (...msg) => {
      if (logLevel !== 'silent') {
        console.info(...msg);
      }
      resolveLogFn('[stdout]:', ...msg);
    });
    child.stderr.on('data', (...msg) => {
      if (logLevel !== 'silent') {
        console.red(...msg);
      }
      resolveLogFn('[stderr]:', ...msg);
    });
  });
};

// 查询所有的文件
async function getAllFiles() {
  const _config = Object.assign({}, config);
  const filterByName = _config.name
    .split('|')
    .map((v) => {
      return `-name "${v}"`;
    })
    .join(' -o ');

  let _cmdLine = `find ${_config.src.join(' ')} -type ${_config.type} ${filterByName}`;
  if (config.exclude.length) {
    _cmdLine += ` | egrep -v "(${_config.exclude.join('|').replace(/\//g, '\\/')})"`;
  }
  const files = await exec(_cmdLine);
  return (files.data || '').split('\n');
}
// 检查是否是components 相关的
function isComponent(_p) {
  // if (/\.(less|css|png|jpg|jpeg|woff|tff|svg|gif)$/.test(_p)) {
  //     return false;
  // }
  if (!/\.(js|jsx|tsx)$/.test(_p)) {
    return;
  }
  return /src\/components/gi.test(_p) || /^components/.test(_p);
}
function isNPM(_p) {
  return /node_modules/.test(_p);
}

function isJS(_p) {
  return /\.jsx?$/.test(_p);
}

function isExcluded(_p) {
  return (
    !srcRegs.some((v) => {
      return v.test(_p);
    }) ||
    excludeRegs.some((v) => {
      return v.test(_p);
    })
  );
}

async function genCSVFile(headers, data, filename) {
  let csvContent = `\ufeff${headers.join(',')}\n`;
  data.forEach((d) => {
    csvContent += `${d.join(',')}\n`;
  });

  await fs.promises.writeFile(`./download/${packageJson.name}-${filename}.csv`, csvContent);
  console.log(
    `file generated at:${path.join(
      process.env.PWD,
      `./download/${packageJson.name}-${filename}.csv`,
    )}`,
  );
}

function aliasResolve(dep) {
  if (/^\./.test(dep)) {
    return dep;
  }
  const _alias = Object.keys(config.alias).sort((a, b) => b.length - a.length);

  for (const _alia of _alias) {
    if (dep.indexOf(`${_alia}/`) === 0) {
      return dep.replace(_alia, config.alias[_alia]);
    }
  }
  return dep;
}

async function main(argsConfig = { genCSV: true }) {
  const shouldGenCSV = argsConfig.genCSV || config.genCSV;

  if (shouldGenCSV) {
    await exec(`mkdir -p ${getRelativePath('./download')}`);
    await exec(`rm -rf ${getRelativePath('./download/*')}`);
  }

  const componentsMap = {};
  const allFiles = await getAllFiles();
  // console.log('allFiles --->', allFiles);
  for (const target of allFiles) {
    if (!target) continue;
    // 获取指定文件的依赖
    const deps = paperwork(target);
    for (const dep of deps) {
      // 获取文件的绝对路径
      const _dep = cabinet({
        partial: dep, // dependency
        directory: `${process.env.PWD}/src`, // root
        filename: target, // ast origin file
        // ast: {}, // an optional AST representation of `filename`
        nodeModulesConfig: {
          entry: 'module',
        },
        webpackConfig: `${process.env.PWD}/.kc-web-checker.js`,
      });

      if (!!_dep && !isNPM(_dep) && isJS(_dep) && !isExcluded(_dep)) {
        const __dep = _dep.replace(`${process.env.PWD}/`, '');
        componentsMap[__dep] = (componentsMap[__dep] || 0) + 1;
      }
    }
  }
  // console.log('componentsMap --->', componentsMap);
  // 排序
  const sortable = Object.entries(componentsMap)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  // console.log(sortable);
  const levels = {};
  let total = 0;
  Object.entries(componentsMap).forEach((v) => {
    const [key, val] = v;
    levels[val] = (levels[val] || 0) + 1;
    total += 1;
  });
  const sortableLevel = Object.entries(levels).reduce(
    (r, [ky, val]) => {
      return {
        ...r,
        counted: r.counted + val * 1,
        [`${ky}>=`]: total - r.counted,
      };
    },
    {
      counted: 0,
    },
  );
  if (shouldGenCSV) {
    await genCSVFile(['文件', '复用次数'], Object.entries(sortable), '复用统计表');
    await genCSVFile(['层次', '数量'], Object.entries(sortableLevel), '层次统计表');
  }

  return Object.keys(sortable).filter((v) => sortable[v] >= (config.min || 2));
  // return sortable;
}

main();

module.exports = main;
