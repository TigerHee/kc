const RUNTIME_PREFIX = /^APP_/i;

module.exports = function getRuntimeEnv (customEnv) {
  const raw = Object.keys({ ...process.env, ...customEnv })
    .filter(key => RUNTIME_PREFIX.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key] || customEnv[key];
      return env;
    }, {});

  const stringified = Object.keys(raw).reduce((env, key) => {
    const stringifiedKey = key.startsWith('process.env.') ? key : `process.env.${key}`;
    env[stringifiedKey] = JSON.stringify(raw[key]);
    return env;
  }, {});

  return {
    raw,
    stringified
  };
};
