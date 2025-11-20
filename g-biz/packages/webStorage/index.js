/**
 * Owner: garuda@kupotech.com
 */
import idbDriver from './drivers/indexeddb';
import localStorageDriver from './drivers/localStorage';
import memoryStorageDriver from './drivers/memoryStorage';
import sessionStorageDriver from './drivers/sessionStorage';
import executeCallback from './utils/executeCallback';
import executeTwoCallbacks from './utils/executeTwoCallbacks';
import hasOwnProperty from './utils/hasOwnProperty';
import includes from './utils/includes';
import isArray from './utils/isArray';
import Promise from './utils/promise';
import serializer from './utils/serializer';
// Drivers are stored here when `defineDriver()` is called.
// They are shared across all instances.
const DefinedDrivers = {};
const DriverSupport = {};
// WEB_SQL not support
const DefaultDrivers = {
  INDEXED_DB: idbDriver,
  // WEB_SQL: websqlDriver,
  LOCAL_STORAGE: localStorageDriver,
  SESSION_STORAGE: sessionStorageDriver,
  MEMORY_STORAGE: memoryStorageDriver,
};
const DefaultDriverOrder = [
  DefaultDrivers.INDEXED_DB._driver,
  // DefaultDrivers.WEB_SQL._driver,
  DefaultDrivers.LOCAL_STORAGE._driver,
  DefaultDrivers.SESSION_STORAGE._driver,
  DefaultDrivers.MEMORY_STORAGE._driver,
];
const OptionalDriverMethods = ['dropInstance'];
const LibraryMethods = [
  'clear',
  'getItem',
  'iterate',
  'key',
  'keys',
  'keyLength',
  'length',
  'removeItem',
  'setItem',
].concat(OptionalDriverMethods);

const DefaultConfig = {
  description: 'kc storage implement',
  driver: DefaultDriverOrder.slice(),
  name: 'KC_STORAGE',
  // Default DB size is 5MB
  // databaseSize: 4980736,
  storeName: 'cache_common',
  version: 1.0,
  timeout: 3000, // default race time 3s
  maxItemSize: 153600, // default item max 150KB
};

function callWhenReady(storageInstance, libraryMethod) {
  storageInstance[libraryMethod] = function ready(...args) {
    const _args = args;
    return storageInstance.ready().then(() => {
      return { ...storageInstance, ..._args };
    });
  };
}
function extend(...args) {
  for (let i = 1; i < arguments.length; i++) {
    const arg = args[i];
    if (arg) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in arg) {
        if (hasOwnProperty(arg, key)) {
          if (isArray(arg[key])) {
            args[0][key] = arg[key].slice();
          } else {
            args[0][key] = arg[key];
          }
        }
      }
    }
  }
  return args[0];
}
class KcStorage {
  _defaultConfig;

  _config;

  _driverSet;

  _initDriver;

  _ready;

  _dbInfo;

  constructor(options) {
    // eslint-disable-next-line no-restricted-syntax
    for (const driverTypeKey in DefaultDrivers) {
      if (hasOwnProperty(DefaultDrivers, driverTypeKey)) {
        const driver = DefaultDrivers[driverTypeKey];
        const driverName = driver._driver;
        this[driverTypeKey] = driverName;
        if (!DefinedDrivers[driverName]) {
          // we don't need to wait for the promise,
          // since the default drivers can be defined
          // in a blocking manner
          this.defineDriver(driver);
        }
      }
    }
    this._defaultConfig = extend({}, DefaultConfig);
    this._config = extend({}, this._defaultConfig, options);
    this._driverSet = null;
    this._initDriver = null;
    this._ready = false;
    this._dbInfo = null;
    this._wrapLibraryMethodsWithReady();
    this.setDriver(this._config.driver).catch(() => {});
  }

  config(options) {
    // Helper function to validate and sanitize options
    const validateAndSanitizeOptions = (key, value) => {
      if (key === 'storeName') {
        return value.replace(/\W/g, '_');
      }
      if (key === 'version' && typeof value !== 'number') {
        throw new Error('Database version must be a number.');
      }
      return value;
    };
    if (typeof options === 'object' && options !== null) {
      if (this._ready) {
        throw new Error("Can't call config() after webStorage 'has been used.'");
      }
      Object.keys(options).forEach((key) => {
        this._config[key] = validateAndSanitizeOptions(key, options[key]);
      });
      if ('driver' in options && options.driver) {
        return this.setDriver(this._config.driver);
      }
      return true;
    }
    if (typeof options === 'string') {
      return this._config[options];
    }
    return this._config;
  }

  // Used to define a custom driver, shared across all instances of
  defineDriver = (driverObject, callback, errorCallback) => {
    const promise = new Promise((resolve, reject) => {
      try {
        const driverName = driverObject._driver;
        const complianceError = new Error(
          'Custom driver not compliant; Please check function config',
        );
        // A driver name should be defined and not overlap with the
        // library-defined, default drivers.
        if (!driverObject._driver) {
          reject(complianceError);
          return;
        }
        const driverMethods = LibraryMethods.concat('_initStorage');
        for (let i = 0, len = driverMethods.length; i < len; i++) {
          const driverMethodName = driverMethods[i];
          // when the property is there,
          // it should be a method even when optional
          const isRequired = !includes(OptionalDriverMethods, driverMethodName);
          if (
            (isRequired || driverObject[driverMethodName]) &&
            typeof driverObject[driverMethodName] !== 'function'
          ) {
            reject(complianceError);
            return;
          }
        }
        const configureMissingMethods = (...args) => {
          const methodNotImplementedFactory = (methodName) => {
            return function factory() {
              const error = new Error(
                `Method ${methodName} is not implemented by the current driver`,
              );
              const rejectPromise = Promise.reject(error);
              executeCallback(rejectPromise, args[args.length - 1]);
              return promise;
            };
          };
          for (let i = 0, len = OptionalDriverMethods.length; i < len; i++) {
            const optionalDriverMethod = OptionalDriverMethods[i];
            if (!driverObject[optionalDriverMethod]) {
              driverObject[optionalDriverMethod] = methodNotImplementedFactory(
                optionalDriverMethod,
              );
            }
          }
        };
        configureMissingMethods();
        const setDriverSupport = (support) => {
          if (DefinedDrivers[driverName]) {
            console.info(`Redefining KcStorage driver: ${driverName}`);
          }
          DefinedDrivers[driverName] = driverObject;
          DriverSupport[driverName] = support;
          // don't use a then, so that we can define
          // drivers that have simple _support methods
          // in a blocking manner
          resolve('');
        };
        if ('_support' in driverObject) {
          if (driverObject._support && typeof driverObject._support === 'function') {
            driverObject._support().then(setDriverSupport, reject);
          } else {
            setDriverSupport(!!driverObject._support);
          }
        } else {
          setDriverSupport(true);
        }
      } catch (e) {
        reject(e);
      }
    });
    executeTwoCallbacks(promise, callback, errorCallback);
    return promise;
  };

  driver() {
    return this._driver || null;
  }

  getDriver = (driverName, callback, errorCallback) => {
    const getDriverPromise = DefinedDrivers[driverName]
      ? Promise.resolve(DefinedDrivers[driverName])
      : Promise.reject(new Error('Driver not found.'));
    executeTwoCallbacks(getDriverPromise, callback, errorCallback);
    return getDriverPromise;
  };

  getSerializer = (callback) => {
    const serializerPromise = Promise.resolve(serializer);
    executeTwoCallbacks(serializerPromise, callback);
    return serializerPromise;
  };

  ready(callback) {
    const self = this;
    const promise = self._driverSet.then(() => {
      if (self._ready === null && self._initDriver) {
        self._ready = self._initDriver();
      }
      return self._ready;
    });
    executeTwoCallbacks(promise, callback, callback);
    return promise;
  }

  setDriver(drivers, callback, errorCallback) {
    const thisInstance = this;
    if (!Array.isArray(drivers)) {
      drivers = [drivers];
    }
    const supportedDrivers = this._getSupportedDrivers(drivers);
    const setDriverToConfig = () => {
      thisInstance._config.driver = thisInstance.driver();
    };
    const extendSelfWithDriver = (driver) => {
      thisInstance._extend(driver);
      setDriverToConfig();
      thisInstance._ready = thisInstance._initStorage(thisInstance._config);
      return thisInstance._ready;
    };
    const initDriver = (supports) => {
      let currentDriverIndex = 0;
      const driverPromiseLoop = () => {
        if (currentDriverIndex >= supports.length) {
          setDriverToConfig();
          const error = new Error('No available storage method found.');
          thisInstance._driverSet = Promise.reject(error);
          return thisInstance._driverSet;
        }
        const driverName = supports[currentDriverIndex];
        currentDriverIndex += 1;
        thisInstance._dbInfo = null;
        thisInstance._ready = null;
        return thisInstance
          .getDriver(driverName)
          .then(extendSelfWithDriver)
          .catch(driverPromiseLoop);
      };
      return driverPromiseLoop();
    };
    const oldDriverSetDone = this._driverSet
      ? this._driverSet.catch(() => Promise.resolve())
      : Promise.resolve();
    this._driverSet = oldDriverSetDone
      .then(() => {
        const driverName = supportedDrivers[0];
        thisInstance._dbInfo = null;
        thisInstance._ready = null;
        return thisInstance.getDriver(driverName).then((driver) => {
          thisInstance._driver = driver._driver;
          setDriverToConfig();
          thisInstance._wrapLibraryMethodsWithReady();
          thisInstance._initDriver = initDriver(supportedDrivers);
        });
      })
      .catch(() => {
        setDriverToConfig();
        const error = new Error('No available storage method found.');
        thisInstance._driverSet = Promise.reject(error);
        return thisInstance._driverSet;
      });
    executeTwoCallbacks(this._driverSet, callback, errorCallback);
    return this._driverSet;
  }

  supports = (driverName) => {
    return !!DriverSupport[driverName];
  };

  _extend(libraryMethodsAndProperties) {
    extend(this, libraryMethodsAndProperties);
  }

  _getSupportedDrivers(drivers) {
    const supportedDrivers = [];
    for (let i = 0, len = drivers.length; i < len; i++) {
      const driverName = drivers[i];
      if (this.supports(driverName)) {
        supportedDrivers.push(driverName);
      }
    }
    return supportedDrivers;
  }

  _wrapLibraryMethodsWithReady() {
    // Add a stub for each driver API method that delays the call to the
    // corresponding driver method until KcStorage is ready. These stubs
    // will be replaced by the driver methods as soon as the driver is
    // loaded, so there is no performance impact.
    for (let i = 0, len = LibraryMethods.length; i < len; i++) {
      callWhenReady(this, LibraryMethods[i]);
    }
  }

  createInstance = (options) => {
    return new KcStorage(options);
  };
}
// The actual object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.
const webStorageInstance = new KcStorage();
export default webStorageInstance;
