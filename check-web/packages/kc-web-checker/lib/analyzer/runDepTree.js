const fs = require('fs')
const axios = require('axios')
const https = require('https')
const path = require('path')
const zlib = require('zlib')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const resolveSync = require('resolve/sync')
const { getDepConfig } = require('./config')
const { genInfoHTML } = require('../utils')

const MODULE_NOT_FOUND_CODE = 'MODULE_NOT_FOUND'

const runDepTree = async () => {
  const depConfig = getDepConfig()
  const { alias, projectRoot } = depConfig
  const options = {
    basedir: projectRoot,
    // 允许的文件扩展名
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
    // 模仿Webpack的 packageMains
    packageFilter (pkg) {
      if (pkg.module) pkg.main = pkg.module
      return pkg
    },
    // 模仿Webpack的基础目录解析
    paths: [projectRoot]
  }
  function formatAlias (value) {
    const ks = Object.keys(alias)
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i]
      let prefix = `${k}/`
      if (value.indexOf(prefix) === 0 || value === k) {
        let dep = value.replace(prefix, `${alias[k]}/`)
        if (value === k) {
          prefix = `${k}`
          dep = value.replace(prefix, `${alias[k]}`)
        }

        // console.log('---->', './' + path.relative(projectRoot, resolveSync(dep, options)));
        let resolvedSyncDepPath
        try {
          resolvedSyncDepPath = resolveSync(dep, options)
        } catch (e) {
          if (e.code === MODULE_NOT_FOUND_CODE) {
            return {
              value,
              code: e.code
            }
          }
        }
        return './' + path.relative(projectRoot, resolvedSyncDepPath)
      }
    }
    return value
  }

  async function getFilePaths (startPath, extensionRegex) {
    let results = []

    async function walkSync (currentPath) {
      const files = fs.readdirSync(currentPath)
      for (let i in files) {
        const currentFile = path.join(currentPath, files[i])
        const stat = fs.statSync(currentFile)

        if (stat.isDirectory()) {
          results = results.concat(
            await getFilePaths(currentFile, extensionRegex)
          )
        } else if (
          extensionRegex.test(currentFile) &&
          !/\.test\.(js|jsx|ts|tsx)$/.test(currentFile) &&
          !/\/test\//.test(currentFile)
        ) {
          results.push(currentFile)
        }
      }
    }
    await walkSync(startPath)
    return results
  }

  function parseDependencies (filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const ast = parser.parse(content, {
      sourceType: 'module',
      // plugins: ['jsx', 'dynamicImport', 'typescript'] // 支持JSX, 动态导入和TypeScript

      plugins: [
        'jsx',
        'dynamicImport',
        'typescript',
        ['decorators', { legacy: true }], // 启用装饰器旧版语法支持
        // 如果你需要启用新版装饰器，可以使用以下配置
        // ['decorators', { decoratorsBeforeExport: true }],
        'classProperties'
      ]
    })

    const dependencies = []

    const pushDeps = value => {
      if (dependencies.indexOf(value) == -1) {
        dependencies.push(value)
      }
    }

    traverse(ast, {
      enter (path) {
        if (path.isImportDeclaration() || path.isExportDeclaration()) {
          if (path.node.source) {
            pushDeps(path.node.source.value)
          }
        } else if (
          path.isCallExpression() &&
          ['require', 'import'].includes(path.node.callee.name)
        ) {
          const args = path.node.arguments
          if (args.length > 0 && args[0].type === 'StringLiteral') {
            pushDeps(args[0].value)
          }
        }
      },
      CallExpression (path) {
        // 检查是否是System.import调用
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.object.name === 'System' &&
          path.node.callee.property.name === 'import' &&
          path.node.arguments.length > 0
        ) {
          const importArgument = path.node.arguments[0]
          // 检查是否是字符串字面量
          if (importArgument.type === 'StringLiteral') {
            pushDeps(importArgument.value)
          }
        }
      },
      Import (path) {
        const parent = path.parentPath.node
        if (parent.arguments && parent.arguments.length > 0) {
          const importArgNode = parent.arguments[0]
          // if (importArgNode.leadingComments) {
          //     importArgNode.leadingComments.forEach(comment => {
          //         // 这里你可以获取webpackChunkName或其他webpack特有的注释
          //         console.log('Comment:', comment.value);
          //     });
          // }
          if (importArgNode.type === 'StringLiteral') {
            pushDeps(importArgNode.value)
          }
        }
      }
    })

    return dependencies
  }

  function formatDependencyPath (filePath, dependency) {
    if (dependency.startsWith('.')) {
      // console.log('---->', './' + path.relative(projectRoot, resolveSync(path.resolve(path.dirname(filePath), dependency), options)));
      return (
        './' +
        path.relative(
          projectRoot,
          resolveSync(path.resolve(path.dirname(filePath), dependency), options)
        )
      )
    }
    return formatAlias(dependency)
  }

  const files = await getFilePaths(projectRoot, /\.(js|jsx|ts|tsx)$/)

  const dependencyMap = {}

  files.forEach(file => {
    const relativeFilePath = './' + path.relative(projectRoot, file)
    const dependencies = parseDependencies(file).map(dep =>
      formatDependencyPath(file, dep)
    )

    dependencyMap[relativeFilePath] = dependencies
  })

  // console.log(JSON.stringify(dependencyMap, null, 2));

  return dependencyMap
}

const renderDepTree = async deps => {
  const combos = [
    {
      id: 'C1',
      label: '@kc',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    },
    {
      id: 'C2',
      label: '@kucoin-base',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    },
    {
      id: 'C3',
      label: '@kucoin-biz',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    },
    {
      id: 'C4',
      label: '@kux',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    },
    {
      id: 'C5',
      label: 'vendor',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    },
    {
      id: 'C6',
      label: 'biz',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2'
      }
    }
  ]

  const data = {
    nodes: [
      // {
      //     id: '0',
      //     label: 'PROJECT_ROOT'
      // }
    ],
    edges: [],
    combos
  }

  const files = Object.keys(deps)
  const nodeIdMap = {}
  const nodeIdFileMap = {}
  let nodeIdx = 0
  for (let i = 0; i < files.length; i++) {
    const addNode = _file => {
      let _isRealFound = true
      if (typeof _file === 'object' && _file.code === MODULE_NOT_FOUND_CODE) {
        _file = _file.value
        _isRealFound = false
      }

      if (nodeIdMap[_file]) {
        return nodeIdMap[_file]
      }
      nodeIdx += 1

      let comboId
      if (_file.indexOf('@kc/') === 0) {
        comboId = 'C1'
      } else if (_file.indexOf('@kucoin-base/') === 0) {
        comboId = 'C2'
      } else if (_file.indexOf('@kucoin-biz/') === 0) {
        comboId = 'C3'
      } else if (_file.indexOf('@kux/') === 0) {
        comboId = 'C4'
      } else if (_file.indexOf('./') === 0) {
        comboId = 'C6'
      } else {
        comboId = 'C5'
      }

      const nodeId = `${nodeIdx}`
      nodeIdMap[_file] = nodeId
      nodeIdFileMap[nodeId] = _file

      data.nodes.push({
        id: nodeId,
        label: `${_file}`,
        comboId,
        style: !_isRealFound
          ? {
              fill: 'rgb(255, 0, 0)',
              stroke: 'rgb(255, 0, 0)'
            }
          : undefined
      })
      // data.edges.push({
      //     source: '0',
      //     target: nodeId,
      // });

      return nodeId
    }

    const file = files[i]
    const nid = addNode(file)

    const relate = deps[file]
    if (relate && relate.length > 0) {
      for (let j = 0; j < relate.length; j++) {
        const toFile = relate[j]
        const toNodeId = addNode(toFile)

        data.edges.push({
          source: nid,
          target: toNodeId
        })
      }
    }
  }

  return data
}

// const projectRoot = path.join(
//   path.resolve(__dirname),
//   "../workspace/kuc___cashback-referral-web/src"
// ); // 适配你项目的根目录路径
// // const projectRoot = path.join(path.resolve(__dirname), '../workspace/kuc___brisk-web/src'); // 适配你项目的根目录路径

// 规范平台 上传 DepTree
const postDepTreeToInsight = async (dep_tree, isDev) => {
  let host = 'https://insight.kcprd.com/api'
  if (isDev) {
    host = 'http://localhost:3030'
  }
  const { project_key, commit_id, build_link, build_user, branch, repo } =
    process.env.CI ? JSON.parse(process.env.CI) : {}
  // 如果不是测试环境，那么不进行 上传
  if (!branch || /^feature/.test(branch)) {
    return
  }
  try {
    await axios.post(
      `${host}/stats`,
      {
        dep_tree,
        repo,
        branch,
        project_key,
        commit_id,
        build_link,
        build_user
      },
      {
        timeout: 15000,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
    console.log('DepTree to insight successfully!')
  } catch (error) {
    console.error('Error depTree to insight:', error.message)
    return
  }
}
module.exports = async () => {
  try {
    const deps = await runDepTree()
    const depTree = await renderDepTree(deps)
    const depTreeGzip = zlib.gzipSync(JSON.stringify(depTree))
    await postDepTreeToInsight(depTreeGzip)
    return {
      code: 0,
      msg: genInfoHTML('depAnalyzer', 'PASS')
    }
  } catch (error) {
    return {
      code: 1,
      msg: genInfoHTML('depAnalyzer', 'FAIL', `(${e.message || 'scan failed'})`)
    }
  }
}
