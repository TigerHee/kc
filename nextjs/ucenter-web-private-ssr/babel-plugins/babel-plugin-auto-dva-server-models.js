/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * babel-plugin-auto-dva-server-models.js
 *
 * 功能：
 * - 在服务端编译时，自动扫描 src/__models/** 下的所有 model 文件
 * - 将所有 model 自动注入到 src/tools/dva/server.ts 的 initModels 函数中
 * - 替换 // BABEL_INSERT_MODELS 注释为实际的 model 注册代码
 *
 * 注入效果：
 * - 生成 import 语句导入所有 model
 * - 在 initModels 中调用 app.model() 注册每个 model
 */
const fs = require('fs');
const path = require('path');

module.exports = function (babel) {
  const t = babel.types;

  return {
    name: 'auto-dva-server-models',
    visitor: {
      Program(pathNode, state) {
        const filename = (state.file && state.file.opts && state.file.opts.filename) || '';

        // 只处理 src/tools/dva/server.ts 文件
        if (!filename.includes('src/tools/dva/server')) return;

        // ===============================
        // 1) 扫描 src/__models 下的所有 model 文件
        // ===============================
        const modelFiles = [];
        const rootDir = path.resolve(process.cwd(), 'src/__models');

        if (!fs.existsSync(rootDir)) {
          console.warn('[auto-dva-server-models] 未找到 src/__models 目录');
          return;
        }

        // 递归扫描函数
        (function scan(dir) {
          const entries = fs.readdirSync(dir);
          for (const entry of entries) {
            const full = path.join(dir, entry);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
              scan(full);
            } else if (/\.(t|j)sx?$/.test(entry)) {
              // 计算相对路径并标准化为 POSIX 风格（使用正斜杠）
              let rel = path.relative(rootDir, full).replace(/\\/g, '/');
              // 去掉扩展名
              rel = rel.replace(/\.(t|j)sx?$/, '');
              // 去掉尾部的 /index，index.ts -> /dirname
              rel = rel.replace(/\/index$/, '');
              
              // 生成导入路径和变量名
              const importPath = `@/__models/${rel}`;
              // 变量名：将路径转换为合法的标识符，如 finance/currency -> financeCurrency
              const varName = rel
                .split('/')
                .map((part, idx) => {
                  // 首字母处理：第一个部分小写，其他部分首字母大写
                  if (idx === 0) return part;
                  return part.charAt(0).toUpperCase() + part.slice(1);
                })
                .join('');
              
              modelFiles.push({ importPath, varName, namespace: rel.split('/').pop() });
            }
          }
        })(rootDir);

        if (modelFiles.length === 0) {
          console.warn('[auto-dva-server-models] src/__models 下没有发现任何 model 文件');
          return;
        }

        console.log(`[auto-dva-server-models] 发现 ${modelFiles.length} 个 model 文件`);

        // ===============================
        // 2) 生成 import 语句
        // ===============================
        const importStatements = modelFiles.map(({ importPath, varName }) => {
          return t.importDeclaration(
            [t.importDefaultSpecifier(t.identifier(varName))],
            t.stringLiteral(importPath),
          );
        });

        // ===============================
        // 3) 找到 initModels 函数并替换其内容
        // ===============================
        let initModelsFound = false;

        pathNode.traverse({
          VariableDeclarator(varPath) {
            // 查找 const initModels = (app: AppInstance) => { ... }
            if (
              t.isIdentifier(varPath.node.id, { name: 'initModels' }) &&
              (t.isArrowFunctionExpression(varPath.node.init) ||
                t.isFunctionExpression(varPath.node.init))
            ) {
              initModelsFound = true;

              const funcNode = varPath.node.init;

              // 生成新的函数体：app.model(model1); app.model(model2); ...
              const modelRegistrations = modelFiles.map(({ varName, namespace }) => {
                // 添加日志（开发模式）
                const logStatement = t.expressionStatement(
                  t.logicalExpression(
                    '&&',
                    t.binaryExpression(
                      '===',
                      t.memberExpression(
                        t.memberExpression(t.identifier('process'), t.identifier('env')),
                        t.identifier('NODE_ENV'),
                      ),
                      t.stringLiteral('development'),
                    ),
                    t.callExpression(
                      t.memberExpression(t.identifier('console'), t.identifier('log')),
                      [
                        t.stringLiteral('[DVA Server] Registering model:'),
                        t.stringLiteral(namespace),
                      ],
                    ),
                  ),
                );

                // app.model(modelVar)
                const registerStatement = t.expressionStatement(
                  t.callExpression(t.memberExpression(t.identifier('app'), t.identifier('model')), [
                    t.identifier(varName),
                  ]),
                );

                return [logStatement, registerStatement];
              }).flat();

              // 替换函数体
              funcNode.body = t.blockStatement(modelRegistrations);
            }
          },

          FunctionDeclaration(funcPath) {
            // 查找 function initModels(app: AppInstance) { ... }
            if (t.isIdentifier(funcPath.node.id, { name: 'initModels' })) {
              initModelsFound = true;

              // 生成新的函数体
              const modelRegistrations = modelFiles.map(({ varName, namespace }) => {
                const logStatement = t.expressionStatement(
                  t.logicalExpression(
                    '&&',
                    t.binaryExpression(
                      '===',
                      t.memberExpression(
                        t.memberExpression(t.identifier('process'), t.identifier('env')),
                        t.identifier('NODE_ENV'),
                      ),
                      t.stringLiteral('development'),
                    ),
                    t.callExpression(
                      t.memberExpression(t.identifier('console'), t.identifier('log')),
                      [
                        t.stringLiteral('[DVA Server] Registering model:'),
                        t.stringLiteral(namespace),
                      ],
                    ),
                  ),
                );

                const registerStatement = t.expressionStatement(
                  t.callExpression(t.memberExpression(t.identifier('app'), t.identifier('model')), [
                    t.identifier(varName),
                  ]),
                );

                return [logStatement, registerStatement];
              }).flat();

              funcPath.node.body = t.blockStatement(modelRegistrations);
            }
          },
        });

        if (!initModelsFound) {
          console.warn('[auto-dva-server-models] 未找到 initModels 函数');
          return;
        }

        // ===============================
        // 4) 将 import 语句插入到文件顶部（在现有 import 之后）
        // ===============================
        let insertIndex = 0;
        while (
          insertIndex < pathNode.node.body.length &&
          t.isImportDeclaration(pathNode.node.body[insertIndex])
        ) {
          insertIndex++;
        }

        // 插入所有 model 的 import 语句
        pathNode.node.body.splice(insertIndex, 0, ...importStatements);

        console.log(`[auto-dva-server-models] ✅ 成功注入 ${modelFiles.length} 个 model`);
      },
    },
  };
};

