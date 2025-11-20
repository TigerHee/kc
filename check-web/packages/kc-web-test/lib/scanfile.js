const { paperwork } = require('precinct');
var cabinet = require('filing-cabinet');
const child_process = require('child_process');
const packageJson = require(`${process.env.PWD}/package`);
const fs = require('fs');
const path = require('path');
const { pathToRegexp } = require('path-to-regexp');
const { getConfig, getDefaultConfig } = require('./config');

const getRelativePath = (_p) => {
  return path.join(process.env.PWD, _p);
};

const config = getConfig();

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
  cwd = process.env.PWD
) => {
  // console.log('exec: ', _cmdLine, logLevel);
  return new Promise((resolve) => {
    const child = child_process.exec(
      _cmdLine,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          error: error,
          data: stdout,
        });
      }
    );
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
      return '-name ' + `"${v}"`;
    })
    .join(' -o ');

  let _cmdLine = `find ${_config.src.join(' ')} -type ${
    _config.type
  } ${filterByName}`;
  if (config.exclude.length) {
    _cmdLine += ` | egrep -v "(${_config.exclude
      .join('|')
      .replace(/\//g, '\\/')})"`;
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

function isStyleJS(_p) {
  return /style/i.test(_p);
}

function isJS(_p) {
  return /\.(js|ts|jsx|tsx)$/.test(_p);
}

function isWebpackAlias() {
  const checkerConfig = getDefaultConfig();
  return Object.keys(checkerConfig?.resolve?.alias || {}).length > 0;
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
  let csvContent = '\ufeff' + headers.join(',') + '\n';
  data.forEach((d) => {
    csvContent += d.join(',') + '\n';
  });

  await fs.promises.writeFile(
    `./download/${packageJson.name}-${filename}.csv`,
    csvContent
  );
  console.log(
    `file generated at:${path.join(
      process.env.PWD,
      `./download/${packageJson.name}-${filename}.csv`
    )}`
  );
}

function aliasResolve(dep) {
  if (/^\./.test(dep)) {
    return dep;
  }
  const _alias = Object.keys(config.alias).sort((a, b) => b.length - a.length);

  for (let _alia of _alias) {
    if (dep.indexOf(`${_alia}/`) === 0) {
      return dep.replace(_alia, config.alias[_alia]);
    }
  }
  return dep;
}

async function main(argsConfig = { genCSV: false }) {
  const shouldGenCSV = argsConfig.genCSV || config.genCSV;

  if (shouldGenCSV) {
    await exec(`mkdir -p ${getRelativePath('./download')}`);
    await exec(`rm -rf ${getRelativePath('./download/*')}`);
  }

  const componentsMap = {};
  const allFiles = await getAllFiles();
  for (let target of allFiles) {
    if (!target) continue;
    // 获取指定文件的依赖
    const deps = paperwork(target);
    for (let dep of deps) {
      // 获取文件的绝对路径
      const cabinetOptions = {
        partial: dep,
        directory: './src',
        filename: target,
        nodeModulesConfig: {
          entry: 'module',
        },
      };
      var _dep = cabinet(
        isWebpackAlias()
          ? {
              ...cabinetOptions,
              webpackConfig: `${process.env.PWD}/.kc-web-checker.js`,
            }
          : cabinetOptions
      );

      if (
        !!_dep &&
        !isNPM(_dep) &&
        isJS(_dep) &&
        !isExcluded(_dep) &&
        !isStyleJS(_dep)
      ) {
        let __dep = _dep.replace(process.env.PWD + '/', '');
        componentsMap[__dep] = (componentsMap[__dep] || 0) + 1;
      }
    }
  }
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
    }
  );
  if (shouldGenCSV) {
    await genCSVFile(
      ['文件', '复用次数'],
      Object.entries(sortable),
      '复用统计表'
    );
    await genCSVFile(
      ['层次', '数量'],
      Object.entries(sortableLevel),
      '层次统计表'
    );
  }

  return Object.keys(sortable).filter((v) => sortable[v] >= (config.min || 2));
  // return sortable;
}
module.exports = main;
