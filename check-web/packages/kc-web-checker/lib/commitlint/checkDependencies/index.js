const fs = require('fs');
const path = require('path');
const pico = require('chalk');
const yarnlockfile = require('@yarnpkg/lockfile');

const findup = (fileName) => {
  let dir = process.cwd();
  while (true) {
    const filePath = path.resolve(dir, fileName);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
    const nextDir = path.dirname(dir);
    if (dir === nextDir) {
      // top level => not found
      return null;
    }
    dir = nextDir;
  }
};

const checkDependenciesHelper = async (config) => {
  const output = { log: [], error: [] };

  let packageJson;

  let success = true;

  const log = (message) => {
    output.log.push(message);
    if (options.verbose) {
      options.log(message);
    }
  };

  const error = (message) => {
    output.error.push(message);
    if (options.verbose) {
      options.error(message);
    }
  };

  const finish = () => {
    output.status = success ? 0 : 1;

    return Promise.resolve(output);
  };

  const missingPackageJson = () => {
    success = false;
    error('Missing package.json!');
    return finish();
  };

  const options = {
    packageManager: 'yarn',
    onlySpecified: false,
    install: false,
    scopeList: ['dependencies', 'devDependencies'],
    optionalScopeList: ['optionalDependencies'],
    verbose: true,
    log: console.log.bind(console),
    error: console.error.bind(console),
    ...config,
  };

  if (!/^[a-z][a-z0-9-]*$/i.test(options.packageManager)) {
    success = false;
    error(
      'The packageManager field value must match the regex ' +
        `\`/^[a-z][a-z0-9-]*$/i\`; got: "${options.packageManager}"`
    );
    return finish();
  }

  const packageJsonRegex = /package\.json$/;

  options.packageDir = options.packageDir || findup('package.json');
  if (!options.packageDir) {
    return missingPackageJson();
  }
  options.packageDir = path.resolve(
    options.packageDir.replace(packageJsonRegex, '')
  );

  packageJson = `${options.packageDir}/package.json`;
  const yarnLockPath = `${options.packageDir}/yarn.lock`;
  const packageLockPath = `${options.packageDir}/package-lock.json`;

  if (!fs.existsSync(packageJson)) {
    return missingPackageJson();
  }
  packageJson = require(packageJson);

  const getDepsMappingsFromScopeList = (scopeList) =>
    // Get names of all packages specified in `package.json` at keys from
    // `scopeList` together with specified version numbers.
    scopeList.reduce(
      (result, scope) => Object.assign(result, packageJson[scope]),
      {}
    );
  const nexusSource = 'https://nexus.kcprd.com/repository/npm-group/';
  // Make sure each package from `scopeList` is present and matches the specified version range.
  // Packages from `optionalScopeList` may not be present but if they are, they are required
  // to match the specified version range.
  const checkPackage = (pkg) => {
    const name = pkg.name;
    let versionString = pkg.versionString;

    if (!versionString || typeof versionString !== 'string') {
      return;
    }
    // Let's look if we can get a valid version from a Git URL
    if (/\.git.*#v?(.+)$/.test(versionString)) {
      success = false;
      error(
        `${name}:  ${pico.red(versionString)} ${pico.green(
          'not support a Git URL'
        )} `
      );
      return;
    }

    // Quick and dirty check - make sure we're not dealing with a URL
    if (versionString.startsWith(nexusSource)) {
      return;
    }

    // If we are dealing with a custom package name, semver check won't work - skip it
    if (/#/.test(versionString)) {
      success = false;
      error(
        `${name}:  ${pico.red(versionString)} ${pico.green(
          'not support custom package name'
        )}`
      );
      return;
    }

    // Skip version checks for 'latest' - the semver module won't help here and the check
    // would have to consult the npm server, making the operation slow.
    if (versionString === 'latest') {
      return;
    }
  };

  //check lock file
  const checkNpmRegistry = () => {
    let npmLocks = [];
    if (fs.existsSync(yarnLockPath)) {
      const yarnLockJson = yarnlockfile.parse(
        fs.readFileSync(yarnLockPath, 'utf8')
      );
      npmLocks.push({
        dependencies: yarnLockJson.object,
        useLock: 'yarn.lock',
      });
    }
    if (fs.existsSync(packageLockPath)) {
      const packageLockJson = require(packageLockPath);
      npmLocks.push({
        dependencies: packageLockJson.dependencies,
        useLock: 'package-lock.json',
      });
    }
    if (npmLocks.length === 0) {
      success = false;
      error('Missing yarn.lock or package-lock.json!');
      return finish();
    }
    npmLocks.map(({ dependencies, useLock }) => {
      Object.entries(dependencies).forEach(([packageName, packageInfo]) => {
        const resolvedUrl = packageInfo.resolved;
        if (!resolvedUrl.startsWith(nexusSource)) {
          success = false;
          error(
            `${packageName}: resolved from ${pico.red(
              resolvedUrl
            )} in ${useLock}, expected from ${pico.green(nexusSource)}`
          );
          return;
        }
      });
    });
  };

  const depsMappings = getDepsMappingsFromScopeList(options.scopeList);
  const optionalDepsMappings = getDepsMappingsFromScopeList(
    options.optionalScopeList
  );

  Object.keys(depsMappings).forEach((name) => {
    checkPackage({
      name,
      versionString: depsMappings[name],
    });
  });

  Object.keys(optionalDepsMappings).forEach((name) => {
    checkPackage({
      name,
      versionString: optionalDepsMappings[name],
    });
  });
  checkNpmRegistry();

  if (success) {
    output.depsWereOk = true;
    return finish();
  }
  output.depsWereOk = false;
  return finish();
};

module.exports = (cfg) => checkDependenciesHelper(cfg);
