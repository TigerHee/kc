/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * babel-plugin-auto-dva-register.js
 *
 * 功能：
 * - 在编译时扫描页面文件中的 dispatch({ type: 'ns/action' }) 或 dispatch('ns/action')
 * - 收集 namespace（ns），并尝试在 src/__models/** 下查找对应的 model 文件
 * - 支持任意层级目录：例如 src/__models/base/currency/index.ts、src/__models/finance/currency.ts 等
 * - 注入动态 import + registerModel 的注册逻辑，开发模式下打印加载信息
 *
 * 注意：
 * - 仅能静态识别字面量字符串的 dispatch 调用
 * - 插件在 Node 上读取文件系统，请确保在构建环境中 src/__models 可访问
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');

module.exports = function (babel) {
  const t = babel.types;

  return {
    name: 'auto-dva-register',
    visitor: {
      Program(pathNode, state) {
        const filename = (state.file && state.file.opts && state.file.opts.filename) || '';
        const includeRegex = (state.opts && state.opts.includeRegex) || '/src/pages/';

        // 只处理匹配的页面文件（默认 src/pages）
        if (!filename.includes(includeRegex)) return;
        // console.log('[auto-dva-register] 处理文件:', state.file && state.file.opts && state.file.opts.filename);

        // 收集 namespace
        const namespaces = new Set();

        // 从 'ns/action' 提取 ns
        function collectFromString(str) {
          if (typeof str !== 'string') return;
          const parts = str.split('/');
          if (parts.length >= 2 && parts[0]) namespaces.add(parts[0]);
        }

        // 遍历 AST，抓取 dispatch 调用
        pathNode.traverse({
          CallExpression(callPath) {
            const callee = callPath.node.callee;
            if (!t.isIdentifier(callee, { name: 'dispatch' })) return;

            const args = callPath.node.arguments || [];
            if (!args.length) return;

            const first = args[0];

            // dispatch('ns/action')
            if (t.isStringLiteral(first)) {
              collectFromString(first.value);
              return;
            }

            // dispatch({ type: 'ns/action' })
            if (t.isObjectExpression(first)) {
              for (const prop of first.properties) {
                if (!t.isObjectProperty(prop)) continue;
                const key = prop.key;
                const isTypeKey =
                  (t.isIdentifier(key) && key.name === 'type') ||
                  (t.isStringLiteral(key) && key.value === 'type');
                if (!isTypeKey) continue;
                const val = prop.value;
                if (t.isStringLiteral(val)) {
                  collectFromString(val.value);
                }
              }
            }
          },
        });

        if (!namespaces.size) return; // 没收集到任何 namespace，跳过

        // ===============================
        // 1) 准备 model 文件索引（并缓存到 state.opts）
        // ===============================
        // 缓存键（避免每次文件编译都扫描磁盘）
        const cacheKey = '__autoDvaModelMap';
        let modelFiles = (state.opts && state.opts[cacheKey]) || null;

        if (!modelFiles) {
          modelFiles = [];

          const rootDir = path.resolve(process.cwd(), 'src/__models');
          if (fs.existsSync(rootDir)) {
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
                  // 变为 import 路径，如 @/__models/finance/currency
                  const importPath = `@/__models/${rel}`;
                  modelFiles.push(importPath);
                }
              }
            })(rootDir);
          }

          // 缓存到 state.opts，供同一轮编译复用
          if (state.opts) state.opts[cacheKey] = modelFiles;
        }

        // 如果没有找到任何模型文件，打印并继续（不注入 loader）
        if (!modelFiles || modelFiles.length === 0) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[auto-dva-register] 未在 src/__models 下发现任何模型文件。');
          }
          return;
        }

        // ===============================
        // 2) 注入 import registerModel
        // ===============================
        const importRegister = t.importDeclaration(
          [t.importSpecifier(t.identifier('registerModel'), t.identifier('registerModel'))],
          t.stringLiteral('@/tools/dva/client'),
        );

        // 插入位置：在已有 import 之后
        let insertIndex = 0;
        while (
          insertIndex < pathNode.node.body.length &&
          t.isImportDeclaration(pathNode.node.body[insertIndex])
        ) {
          insertIndex++;
        }

        // ===============================
        // 3) 定义全局注册表（去重）
        // ===============================
        const regSetId = t.identifier('__DVA_REGISTERED_MODELS');
        const initRegSet = t.variableDeclaration('const', [
          t.variableDeclarator(
            regSetId,
            t.logicalExpression(
              '||',
              t.memberExpression(t.identifier('globalThis'), regSetId),
              t.assignmentExpression(
                '=',
                t.memberExpression(t.identifier('globalThis'), regSetId),
                t.newExpression(t.identifier('Set'), []),
              ),
            ),
          ),
        ]);

        // ===============================
        // 4) 为每个 namespace 生成 loader（匹配 modelFiles）
        // ===============================
        const loaderProps = [];
        for (const ns of Array.from(namespaces)) {
          // 找到候选路径：以 "/<ns>" 结尾或等于 "@/__models/<ns>"
          const candidates = modelFiles.filter((p) => {
            const lower = p.toLowerCase();
            return (
              lower === `@/__models/${ns.toLowerCase()}` || lower.endsWith(`/${ns.toLowerCase()}`)
            );
          });

          // 选最合适的候选：优先深度最小（目录浅）
          let chosen = null;
          if (candidates.length === 1) chosen = candidates[0];
          else if (candidates.length > 1) {
            candidates.sort((a, b) => a.split('/').length - b.split('/').length);
            chosen = candidates[0];
          }

          // 如果没有匹配则留 null（后续 loader 会 throw）
          if (chosen) {
            // 构造 async () => { return await import('<chosen>'); }
            const func = t.arrowFunctionExpression(
              [],
              t.blockStatement([
                t.returnStatement(
                  t.awaitExpression(t.callExpression(t.import(), [t.stringLiteral(chosen)])),
                ),
              ]),
              true,
            );
            loaderProps.push(t.objectProperty(t.stringLiteral(ns), func));
          } else {
            // 没找到时，loader 抛错（注册逻辑会 catch 并打印）
            const func = t.arrowFunctionExpression(
              [],
              t.blockStatement([
                t.throwStatement(
                  t.newExpression(t.identifier('Error'), [
                    t.stringLiteral(`[auto-dva-register] 未找到对应 model: ${ns}`),
                  ]),
                ),
              ]),
              true,
            );
            loaderProps.push(t.objectProperty(t.stringLiteral(ns), func));
          }
        }

        const loadersDecl = t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier('__DVA_MODEL_LOADERS'),
            t.objectExpression(loaderProps),
          ),
        ]);

        // ===============================
        // 5) 生成异步注册 IIFE（字符串解析为 AST）
        //    - 注册时会打印绑定到实际 importPath（如果匹配）
        // ===============================
        // 我们在注册时打印更友好的信息：ns -> chosenPath（从 model map 中获取）
        // 由于直接在 AST 中难以取得 chosen path（已在上面选出），我们在循环中直接使用 __DVA_MODEL_LOADERS[ns] 的 loader，
        // 并在开发模式打印 ns。若需要打印 importPath 可在上面把 chosen 也注入到一个 map 中，这里为简洁打印 ns。
        const loopCode = `
          (async function __dva_auto_register(){
            // 只在客户端环境执行，跳过服务端渲染
            if (typeof window === 'undefined') {
              return;
            }
            try {
              const keys = Object.keys(__DVA_MODEL_LOADERS);
              for (const ns of keys) {
                try {
                  const mod = await __DVA_MODEL_LOADERS[ns]();
                  if (!__DVA_REGISTERED_MODELS.has(ns)) {
                    try {
                      registerModel(mod && mod.default ? mod.default : mod);
                      __DVA_REGISTERED_MODELS.add(ns);
                      if (process.env.NODE_ENV === 'development') {
                        console.log('[auto-dva-register] 动态加载 model:', ns);
                      }
                    } catch(e) {
                      console.warn('[auto-dva-register] registerModel 失败 for', ns, e);
                    }
                  }
                } catch (e) {
                  if (process.env.NODE_ENV === 'development') {
                    console.warn('[auto-dva-register] 载入 model 失败 for', ns, e && e.message ? e.message : e);
                  }
                }
              }
            } catch (e) {
              console.warn('[auto-dva-register] 自动注册模型失败', e);
            }
          })();
        `;

        const iifeAST = parser.parse(loopCode, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
        }).program.body;

        // ===============================
        // 6) 注入到 AST（放在原有 import 之后）
        // ===============================
        pathNode.node.body.splice(
          insertIndex,
          0,
          importRegister,
          initRegSet,
          loadersDecl,
          ...iifeAST,
        );
      },
    },
  };
};
