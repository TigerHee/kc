const path = require('path');
const sourceDir = path.resolve(__dirname, '../../src/pages');
const { isReactComponent } = require('@umijs/ast');
const { readDirPages } = require('./readDir');
const componentPath = '@/pages';
const globalRouteDir = path.resolve(__dirname, '../../src/layouts/index.js');
const { lstatSync, accessSync, constants, readFileSync } = require('fs');
const RE_DYNAMIC_ROUTE = /^\[(.+?)\]/;
const route404 = {
  path: '/404',
  component: `${componentPath}/404.js`,
  exact: true,
};
function hasGlobalRoute() {
  try {
    accessSync(globalRouteDir, constants.R_OK | constants.W_OK);
    const content = readFileSync(globalRouteDir, 'utf-8');
    if (!isReactComponent(content)) return false;
    return true;
  } catch (err) {
    console.error('没有全局路由文件');
    return false;
  }
}
function handleRouteTemplate(app) {
  if (app === '404') {
    return [
      {
        page: '/',
        exact: true,
        component: `${componentPath}/${app}`,
      }
    ];
  }
  let routes = generatorRoute(app) || [];
  Array.isArray(routes) && routes.push(route404);
  Array.isArray(routes) && routes.push({
    component: `${componentPath}/404.js`,
  });
  if (hasGlobalRoute()) {
    return [
      {
        exact: false,
        path: '/',
        component: '@/layouts/index',
        routes: routes,
      },
    ];
  } else {
    return routes;
  }
}
function generatorRoute(app) {
  try {
    if (lstatSync(`${sourceDir}/${app}`) && app.indexOf('.js') > -1) {
      return [
        {
          path: app.indexOf('.js') ? `/${app.substring(0, app.lastIndexOf('.js'))}` : `/${app}`,
          exact: true,
          component: `${componentPath}/${app}`,
        },
      ];
    }
    if (lstatSync(`${sourceDir}/${app}`).isDirectory()) {
      return handleDirRouteConfig(app);
    }
  } catch (e) {
    console.log(`获取${app}文件状态失败:`, e);
  }
}
function handleDirRouteConfig(app) {
  const child = getChild(app);
  if (isNestedRoute(child)) {
    const routes = handleNestedRoute(app, child);
    return routes;
  } else {
    const routes = handleDirRoute(app, child);
    return routes;
  }
}
function isNestedRoute(dir) {
  return dir.includes('_layout.js') || dir.includes('_layout.tsx');
}
function handleNestedRoute(app, child) {
  let path = `/${app}`;
  let _component = '';
  if (child.includes('_layout.js')) {
    _component = `@/pages/${app}/_layout.js`;
  }
  if (child.includes('_layout.tsx')) {
    _component = `@/pages/${app}/_layout.tsx`;
  }
  child = child.filter((i) => !['_layout.js', '_layout.tsx'].includes(i));
  const routes = handleChildRoute(app, child) || [];
  let route = {
    path: path,
    component: _component,
    routes: routes,
  };
  // console.log('NestedRoute', route);
  return [route];
}

function handleDirRoute(app, child) {
  let routes = [];
  let path = `/${app}`;
  let dir = `${sourceDir}/${app}`;
  handleIter(child, dir, path, routes);
  routes.reverse();
  return routes;
}
function getChild(app) {
  return readDirPages(`${sourceDir}/${app}`) || [];
}
function handleIter(child, dir, path, result = []) {
  return child.map((i) => {
    if (lstatSync(`${dir}/${i}`).isFile() && i.indexOf('.js') > -1) {
      result.push({
        path: handlePath(`${path}/${i}`),
        exact: true,
        component: `${componentPath}${path}/${i}`,
      });
    }
    if (lstatSync(`${dir}/${i}`).isDirectory()) {
      const _child = readDirPages(`${dir}/${i}`);
      handleIter(_child, `${dir}/${i}`, `${path}/${i}`, result);
    }
  });
}
function handlePath(path) {
  let _path = path;
  if(_path.endsWith('/index.js')){
    _path = _path.substring(0,_path.indexOf('/index.js'))
  }
  let arr = _path.split('/').map((p) => {
    p = p.replace(RE_DYNAMIC_ROUTE, ':$1');
    if (p.endsWith('.js')) {
      p = `${p.substring(0, p.indexOf('.js'))}`;
    }
    if (p.endsWith('$')) {
      p = `${p.substring(0, p.indexOf('$'))}?`;
    }
    return p;
  });
  _path = arr.join('/');
  return _path;
}
function handleChildRoute(app, child) {
  let childRoutes = [];
  let dir = `${sourceDir}/${app}`;
  let path = `/${app}`;
  handleIter(child, dir, path, childRoutes);
  childRoutes.reverse();
  return childRoutes;
}
module.exports = {
  handleRouteTemplate,
};
