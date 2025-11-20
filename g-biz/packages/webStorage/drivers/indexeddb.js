/* eslint-disable prefer-spread */ // 屏蔽 apply 警告 xxx.apply 更改 this 指向有用
/* eslint-disable no-multi-assign */ // 屏蔽链式赋值警告 a=b=c 便捷为未赋值对象统一值
/**
 * Owner: garuda@kupotech.com
 */
import checkStrLength from '../utils/checkSize';
import createBlob from '../utils/createBlob';
import executeCallback from '../utils/executeCallback';
import executeTwoCallbacks from '../utils/executeTwoCallbacks';
import getCallback from '../utils/getCallback';
import idbCore from '../utils/idb';
import isIndexedDBValid from '../utils/isIndexedDBValid';
import normalizeKey from '../utils/normalizeKey';
import Promise from '../utils/promise';
import sentryReport from '../utils/sentryReport';
// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).
const DETECT_BLOB_SUPPORT_STORE = 'kc-storage-detect-blob-support';
const dbContexts = {};
const { toString } = Object?.prototype;
// Transaction Modes
const READ_ONLY = 'readonly';
const READ_WRITE = 'readwrite';
// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
  const binLength = bin.length;
  const buf = new ArrayBuffer(binLength);
  const arr = new Uint8Array(buf);
  for (let i = 0; i < binLength; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return buf;
}
//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
//
function _checkBlobSupportWithoutCaching(idb) {
  return new Promise((resolve) => {
    const txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
    const blob = new Blob(['']);
    txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');
    txn.onabort = (e) => {
      // If the transaction aborts now its due to not being able to
      // write to the database, likely due to the disk being full
      e.preventDefault();
      e.stopPropagation();
      resolve(false);
    };
    txn.oncomplete = () => {
      const matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
      const matchedEdge = navigator.userAgent.match(/Edge\//);
      // MS Edge pretends to be Chrome 42:
      // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
      resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
    };
  }).catch(() => {
    sentryReport(`indexed db not support blob`, `_checkBlobSupportWithoutCaching`);
    return false; // error, so assume unsupported
  });
}
let supportsBlobs;
function _checkBlobSupport(idb) {
  if (typeof supportsBlobs === 'boolean') {
    return Promise.resolve(supportsBlobs);
  }
  return _checkBlobSupportWithoutCaching(idb).then((value) => {
    supportsBlobs = value;
    return supportsBlobs;
  });
}
function _deferReadiness(dbInfo) {
  const dbContext = dbContexts[dbInfo.name];
  // Create a deferred object representing the current database operation.
  const deferredOperation = {};
  deferredOperation.promise = new Promise((resolve, reject) => {
    deferredOperation.resolve = resolve;
    deferredOperation.reject = reject;
  });
  // Enqueue the deferred operation.
  dbContext.deferredOperations.push(deferredOperation);
  // Chain its promise to the database readiness.
  if (!dbContext.dbReady) {
    dbContext.dbReady = deferredOperation.promise;
  } else {
    dbContext.dbReady = dbContext.dbReady.then(() => {
      return deferredOperation.promise;
    });
  }
}
function _advanceReadiness(dbInfo) {
  const dbContext = dbContexts[dbInfo.name];
  // Dequeue a deferred operation.
  const deferredOperation = dbContext.deferredOperations.pop();
  // Resolve its promise (which is part of the database readiness
  // chain of promises).
  if (deferredOperation) {
    deferredOperation.resolve();
    return deferredOperation.promise;
  }
  return null;
}
function _rejectReadiness(dbInfo, err) {
  const dbContext = dbContexts[dbInfo.name];
  // Dequeue a deferred operation.
  const deferredOperation = dbContext.deferredOperations.pop();
  // Reject its promise (which is part of the database readiness
  // chain of promises).
  if (deferredOperation) {
    deferredOperation.reject(err);
    sentryReport(`indexed db readiness`, `_rejectReadiness`);
    return deferredOperation.promise;
  }
  return null;
}
function _getConnection(dbInfo, upgradeNeeded) {
  return new Promise((resolve, reject) => {
    dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();
    if (dbInfo.db) {
      if (upgradeNeeded) {
        _deferReadiness(dbInfo);
        dbInfo.db.close();
      } else {
        return resolve(dbInfo.db);
      }
    }
    const dbArgs = [dbInfo.name];
    if (upgradeNeeded) {
      dbArgs.push(dbInfo.version);
    }
    const openReq = idbCore.open.apply(idbCore, dbArgs);
    if (upgradeNeeded) {
      openReq.onupgradeneeded = (e) => {
        const db = openReq.result;
        try {
          db.createObjectStore(dbInfo.storeName);
          if (e.oldVersion <= 1) {
            // Added when support for blob shims was added
            db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
          }
        } catch (ex) {
          if (ex.name === 'ConstraintError') {
            console.warn(
              `The database "${dbInfo.name}"` +
                ` has been upgraded from version ${e.oldVersion} to version ${e.newVersion}, but the storage "${dbInfo.storeName}" already exists.`,
            );
            sentryReport(`indexed db onupgradeneeded error`, `ConstraintError`);
          } else {
            sentryReport(`indexed db onupgradeneeded error`, ex);
            throw ex;
          }
        }
      };
    }
    openReq.onerror = (e) => {
      e.preventDefault();
      reject(openReq.error);
      sentryReport(`indexed db openReq error`, openReq.error);
    };
    openReq.onsuccess = () => {
      const db = openReq.result;
      db.onversionchange = (e) => {
        // Triggered when the database is modified (e.g. adding an objectStore) or
        // deleted (even when initiated by other sessions in different tabs).
        // Closing the connection here prevents those operations from being blocked.
        // If the database is accessed again later by this instance, the connection
        // will be reopened or the database recreated as needed.
        e.target.close();
      };
      resolve(db);
      _advanceReadiness(dbInfo);
    };
  });
}
function _getOriginalConnection(dbInfo) {
  return _getConnection(dbInfo, false);
}
function _getUpgradedConnection(dbInfo) {
  return _getConnection(dbInfo, true);
}
function _isUpgradeNeeded(dbInfo, defaultVersion) {
  if (!dbInfo.db) {
    return true;
  }
  const isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
  const isDowngrade = dbInfo.version < dbInfo.db.version;
  const isUpgrade = dbInfo.version > dbInfo.db.version;
  if (isDowngrade) {
    // If the version is not the default one
    // then warn for impossible downgrade.
    if (dbInfo.version !== defaultVersion) {
      console.warn(
        `The database "${dbInfo.name}"` +
          ` can't be downgraded from version ${dbInfo.db.version} to version ${dbInfo.version}.`,
      );
    }
    // Align the versions to prevent errors.
    dbInfo.version = dbInfo.db.version;
  }
  if (isUpgrade || isNewStore) {
    // If the store is new then increment the version (if needed).
    // This will trigger an "upgradeneeded" event which is required
    // for creating a store.
    if (isNewStore) {
      const incVersion = dbInfo.db.version + 1;
      if (incVersion > dbInfo.version) {
        dbInfo.version = incVersion;
      }
    }
    return true;
  }
  return false;
}
// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onloadend = (e) => {
      const base64 = btoa(e.target.result || '');
      resolve({
        __local_encoded_blob: true,
        data: base64,
        type: blob.type,
      });
    };
    reader.readAsArrayBuffer(blob);
  });
}
// decode an encoded blob
function _decodeBlob(encodedBlob) {
  const arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
  return createBlob([arrayBuff], { type: encodedBlob.type });
}
// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
  return value && value.__local_encoded_blob;
}
// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
  const self = this;
  const promise = self._initReady().then(() => {
    const dbContext = dbContexts[self._dbInfo.name];
    if (dbContext && dbContext.dbReady) {
      return dbContext.dbReady;
    }
  });
  executeTwoCallbacks(promise, callback, callback);
  return promise;
}
// Try to establish a new db connection to replace the
// current one which is broken (i.e. experiencing
// InvalidStateError while creating a transaction).
function _tryReconnect(dbInfo) {
  _deferReadiness(dbInfo);
  const dbContext = dbContexts[dbInfo.name];
  const { storages } = dbContext;
  for (let i = 0; i < storages.length; i++) {
    const storage = storages[i];
    if (storage._dbInfo.db) {
      storage._dbInfo.db.close();
      storage._dbInfo.db = null;
    }
  }
  dbInfo.db = null;
  return _getOriginalConnection(dbInfo)
    .then((db) => {
      dbInfo.db = db;
      if (_isUpgradeNeeded(dbInfo)) {
        // Reopen the database for upgrading.
        return _getUpgradedConnection(dbInfo);
      }
      return db;
    })
    .then((db) => {
      // store the latest db reference
      // in case the db was upgraded
      dbInfo.db = dbContext.db = db;
      for (let i = 0; i < storages.length; i++) {
        storages[i]._dbInfo.db = db;
      }
    })
    .catch((err) => {
      _rejectReadiness(dbInfo, err);
      throw err;
    });
}
// FF doesn't like Promises (micro-tasks) and IDDB store operations,
// so we have to do it with callbacks
function createTransaction(dbInfo, mode, callback, retries) {
  if (retries === undefined) {
    retries = 1;
  }
  try {
    const tx = dbInfo.db.transaction(dbInfo.storeName, mode);
    callback(null, tx);
  } catch (err) {
    if (
      retries > 0 &&
      (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')
    ) {
      return Promise.resolve()
        .then(() => {
          if (
            !dbInfo.db ||
            (err.name === 'NotFoundError' &&
              !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) &&
              dbInfo.version <= dbInfo.db.version)
          ) {
            // increase the db version, to create the new ObjectStore
            if (dbInfo.db) {
              dbInfo.version = dbInfo.db.version + 1;
            }
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
          }
        })
        .then(() => {
          return _tryReconnect(dbInfo).then(() => {
            createTransaction(dbInfo, mode, callback, retries - 1);
          });
        })
        .catch(callback);
    }
    callback(err);
  }
}

function createDbContext() {
  return {
    // Running sharing a database.
    storages: [],
    // Shared database.
    db: null,
    // Database readiness (promise).
    dbReady: null,
    // Deferred operations on the database.
    deferredOperations: [],
  };
}
// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
  const self = this;
  const dbInfo = {
    db: null,
  };
  if (options) {
    Object.keys(options).forEach((k) => {
      dbInfo[k] = options[k];
    });
  }
  console.log('_initStorage --->', dbInfo, options);
  // Get the current context of the database;
  let dbContext = dbContexts[dbInfo.name];
  // ...or create a new context.
  if (!dbContext) {
    dbContext = createDbContext();
    // Register the new context in the global container.
    dbContexts[dbInfo.name] = dbContext;
  }
  // Register itself as a running localstorage in the current context.
  dbContext.storages.push(self);
  // Replace the default `ready()` function with the specialized one.
  if (!self._initReady) {
    self._initReady = self.ready;
    self.ready = _fullyReady;
  }
  // Create an array of initialization states of the related.
  const initPromises = [];
  function ignoreErrors() {
    // Don't handle errors here,
    // just makes sure related aren't pending.
    return Promise.resolve();
  }
  for (let j = 0; j < dbContext.storages.length; j++) {
    const storage = dbContext.storages[j];
    if (storage !== self) {
      // Don't wait for itself...
      initPromises.push(storage._initReady().catch(ignoreErrors));
    }
  }
  // Take a snapshot of the related.
  const storages = dbContext.storages.slice(0);
  // Initialize the connection process only when
  // all the related aren't pending.
  return Promise.all(initPromises)
    .then(() => {
      dbInfo.db = dbContext.db;
      // Get the connection or open a new one without upgrade.
      return _getOriginalConnection(dbInfo);
    })
    .then((db) => {
      dbInfo.db = db;
      if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
        // Reopen the database for upgrading.
        return _getUpgradedConnection(dbInfo);
      }
      return db;
    })
    .then((db) => {
      dbInfo.db = dbContext.db = db;
      self._dbInfo = dbInfo;
      // Share the final connection amongst related.
      for (let k = 0; k < storages.length; k++) {
        const storage = storages[k];
        if (storage !== self) {
          // Self is already up-to-date.
          storage._dbInfo.db = dbInfo.db;
          storage._dbInfo.version = dbInfo.version;
        }
      }
    });
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            sentryReport(`iterate createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.openCursor();
            let iterationNumber = 1;
            req.onsuccess = () => {
              const cursor = req.result;
              if (cursor) {
                let { value } = cursor;
                if (_isEncodedBlob(value)) {
                  value = _decodeBlob(value);
                }
                const result = iterator(value, cursor.key, iterationNumber++);
                // when the iterator callback returns any
                // (non-`undefined`) value, then we stop
                // the iteration immediately
                // eslint-disable-next-line no-void
                if (result !== void 0) {
                  resolve(result);
                } else {
                  cursor.continue();
                }
              } else {
                resolve('');
              }
            };
            req.onerror = () => {
              reject(req.error);
              sentryReport(`iterate onerror`, req.error);
            };
          } catch (e) {
            reject(e);
            sentryReport(`iterate createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`iterate catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

function getItem(getKey, callback) {
  const self = this;

  getKey = normalizeKey(getKey);

  let timeoutId;

  // Add race timeout，default 3s
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve(null);
    }, this._dbInfo?.timeout || 3000);
  });

  const operationPromise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
            sentryReport(`getItem createTransaction`, err);
            return reject(err);
          }

          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.get(getKey);

            req.onsuccess = () => {
              clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
              let value = req.result;
              if (value === undefined) {
                value = null;
              }
              if (_isEncodedBlob(value)) {
                value = _decodeBlob(value);
              }
              resolve(value);
            };

            req.onerror = () => {
              clearTimeout(timeoutId); // Clear the timeout when an error occurs
              reject(req.error);
              sentryReport(`getItem onerror`, req.error);
            };
          } catch (e) {
            clearTimeout(timeoutId); // Clear the timeout when an exception is caught
            reject(e);
            sentryReport(`getItem createTransaction catch`, e);
          }
        });
      })

      .catch((err) => {
        clearTimeout(timeoutId); // Clear the timeout when an error occurs in ready()
        reject(err);
        sentryReport(`getItem catch`, err);
      });
  });

  const promise = Promise.race([operationPromise, timeoutPromise]);

  executeCallback(promise, callback);

  return promise;
}

function setItem(setKey, value, callback) {
  const self = this;
  setKey = normalizeKey(setKey);
  const promise = new Promise((resolve, reject) => {
    // check size
    if (checkStrLength(value, self._dbInfo?.maxItemSize)) {
      sentryReport(
        `setItem maxLength`,
        `set key ${setKey} value: ${!!value} maxItem: ${self._dbInfo?.maxItemSize}`,
      );
      return reject(
        `The single storage limit does not exceed ${self._dbInfo?.maxItemSize ||
          150 * 1024} chart!`,
      );
    }
    let dbInfo;
    self
      .ready()
      .then(() => {
        dbInfo = self._dbInfo;
        if (toString.call(value) === '[object Blob]') {
          console.warn(
            'Using blob for storage is not recommended and may result in reduced performance',
          );
          // save blob warning
          sentryReport(`setItem blob warning`, `set blob key ${setKey}`);
          return _checkBlobSupport(dbInfo.db).then((blobSupport) => {
            if (blobSupport) {
              return value;
            }
            return _encodeBlob(value);
          });
        }
        return value;
      })
      .then((v) => {
        createTransaction(self._dbInfo, READ_WRITE, (err, transaction) => {
          if (err) {
            sentryReport(`setItem createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            // The reason we don't _save_ null is because IE 10 does
            // not support saving the `null` type in IndexedDB. How
            // ironic, given the bug below!
            if (v === null) {
              v = undefined;
            }
            const req = store.put(v, setKey);
            transaction.oncomplete = () => {
              // Cast to undefined so the value passed to
              // callback/promise is the same as what one would get out
              // of `getItem()` later. This leads to some weirdness
              // (setItem('foo', undefined) will return `null`), but
              // it's not my fault localStorage is our baseline and that
              // it's weird.
              if (v === undefined) {
                v = null;
              }
              resolve(v);
            };
            transaction.onabort = transaction.onerror = () => {
              const retErr = req.error ? req.error : req.transaction.error;
              reject(retErr);
              sentryReport(`setItem onabort`, retErr);
            };
          } catch (e) {
            reject(e);
            sentryReport(`setItem createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`setItem catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

function removeItem(rmKey, callback) {
  const self = this;
  rmKey = normalizeKey(rmKey);
  const promise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_WRITE, (err, transaction) => {
          if (err) {
            sentryReport(`removeItem createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            // We use a Grunt task to make this safe for IE and some
            // versions of Android (including those used by Cordova).
            // Normally IE won't like `.delete()` and will insist on
            // using `['delete']()`, but we have a build step that
            // fixes this for us now.
            const req = store.delete(rmKey);
            transaction.oncomplete = () => {
              resolve('');
            };
            transaction.onerror = () => {
              reject(req.error);
              sentryReport(`removeItem onerror`, req.error);
            };
            // The request will be also be aborted if we've exceeded our storage
            // space.
            transaction.onabort = () => {
              const retErr = req.error ? req.error : req.transaction.error;
              reject(retErr);
              sentryReport(`removeItem onabort`, retErr);
            };
          } catch (e) {
            reject(e);
            sentryReport(`removeItem createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`removeItem catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

function keyLength(callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            sentryReport(`keyLength createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.count();
            req.onsuccess = () => {
              resolve(req.result);
            };
            req.onerror = () => {
              reject(req.error);
              sentryReport(`keyLength onerror`, req.error);
            };
          } catch (e) {
            reject(e);
            sentryReport(`keyLength createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`keyLength catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

function length(callback) {
  const self = this;
  const operationPromise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            sentryReport(`length createTransaction`, err);
            clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.openCursor();
            let totalSize = 0;
            req.onsuccess = (event) => {
              clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
              const cursor = event?.target?.result;
              if (!cursor) {
                resolve(totalSize);
                return;
              }
              const record = cursor.value;
              const recordSize = JSON.stringify(record)?.length;
              totalSize += recordSize;

              cursor.continue();
            };
            req.onerror = () => {
              reject(req.error);
              sentryReport(`length onerror`, req.error);
              clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
            };
          } catch (e) {
            clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
            reject(e);
            sentryReport(`length createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        clearTimeout(timeoutId); // Clear the timeout when the operation succeeds
        reject(err);
        sentryReport(`length catch`, err);
      });
  });

  let timeoutId;

  // Add race timeout，default 3s
  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve(null);
    }, this._dbInfo?.timeout || 3000);
  });

  const promise = Promise.race([operationPromise, timeoutPromise]);

  executeCallback(promise, callback);

  return promise;
}

function key(n, callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    if (n < 0) {
      resolve(null);
      return;
    }
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            sentryReport(`key createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            let advanced = false;
            const req = store.openKeyCursor();
            req.onsuccess = () => {
              const cursor = req.result;
              if (!cursor) {
                // this means there weren't enough keys
                resolve(null);
                return;
              }
              if (n === 0) {
                // We have the first key, return it if that's what they
                // wanted.
                resolve(cursor.key);
              } else if (!advanced) {
                // Otherwise, ask the cursor to skip ahead n
                // records.
                advanced = true;
                cursor.advance(n);
              } else {
                // When we get here, we've got the nth key.
                resolve(cursor.key);
              }
            };
            req.onerror = () => {
              reject(req.error);
              sentryReport(`key onerror`, req.error);
            };
          } catch (e) {
            reject(e);
            sentryReport(`key createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`key catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

function keys(callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_ONLY, (err, transaction) => {
          if (err) {
            sentryReport(`keys createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.openKeyCursor();
            const itKeys = [];
            req.onsuccess = () => {
              const cursor = req.result;
              if (!cursor) {
                resolve(itKeys);
                return;
              }
              itKeys.push(cursor.key);
              cursor.continue();
            };
            req.onerror = () => {
              reject(req.error);
              sentryReport(`keys onerror`, req.error);
            };
          } catch (e) {
            reject(e);
            sentryReport(`keys createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`keys catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

// store clear
function clear(callback) {
  const self = this;
  const promise = new Promise((resolve, reject) => {
    self
      .ready()
      .then(() => {
        createTransaction(self._dbInfo, READ_WRITE, (err, transaction) => {
          if (err) {
            sentryReport(`clear createTransaction`, err);
            return reject(err);
          }
          try {
            const store = transaction.objectStore(self._dbInfo.storeName);
            const req = store.clear();
            transaction.oncomplete = () => {
              resolve('');
            };
            transaction.onabort = transaction.onerror = () => {
              const retErr = req.error ? req.error : req.transaction.error;
              reject(retErr);
              sentryReport(`clear onabort`, retErr);
            };
          } catch (e) {
            reject(e);
            sentryReport(`clear createTransaction catch`, e);
          }
        });
      })
      .catch((err) => {
        reject(err);
        sentryReport(`clear catch`, err);
      });
  });
  executeCallback(promise, callback);
  return promise;
}

// remove database
function dropInstance(options, callback) {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments;
  // eslint-disable-next-line prefer-rest-params
  callback = getCallback.apply(this, args);
  const currentConfig = this.config();
  options = (typeof options !== 'function' && options) || {};
  if (!options.name) {
    options.name = options.name || currentConfig.name;
    options.storeName = options.storeName || currentConfig.storeName;
  }
  const self = this;
  let promise;
  if (!options.name) {
    promise = Promise.reject('Invalid arguments');
  } else {
    // check dbInfo is open
    const isCurrentDb = options.name === currentConfig.name && self._dbInfo?.db;
    const dbPromise = isCurrentDb
      ? Promise.resolve(self._dbInfo?.db)
      : _getOriginalConnection(options).then((db) => {
          const dbContext = dbContexts[options.name];
          const { storages } = dbContext;
          dbContext.db = db;
          for (let i = 0; i < storages.length; i++) {
            storages[i]._dbInfo.db = db;
          }
          return db;
        });
    if (!options.storeName) {
      promise = dbPromise.then((db) => {
        _deferReadiness(options);
        const dbContext = dbContexts[options.name];
        const { storages } = dbContext;
        db.close();
        for (let i = 0; i < storages.length; i++) {
          const storage = storages[i];
          storage._dbInfo.db = null;
        }
        const dropDBPromise = new Promise((resolve, reject) => {
          const req = idbCore.deleteDatabase(options.name);
          req.onerror = () => {
            const rDb = req.result;
            if (rDb) {
              rDb.close();
            }
            reject(req.error);
            sentryReport(`dropInstance onerror`, req.error);
          };
          req.onblocked = () => {
            // Closing all open connections in onversionchange handler should prevent this situation, but if
            // we do get here, it just means the request remains pending - eventually it will succeed or error
            console.warn(
              `dropInstance blocked for database "${options.name}" until all open connections are closed`,
            );
          };
          req.onsuccess = () => {
            const rDb = req.result;
            if (rDb) {
              rDb.close();
            }
            resolve(rDb);
          };
        });
        return dropDBPromise
          .then((rDb) => {
            dbContext.db = rDb;
            for (let i = 0; i < storages.length; i++) {
              const storage = storages[i];
              _advanceReadiness(storage._dbInfo);
            }
          })
          .catch((err) => {
            (_rejectReadiness(options, err) || Promise.resolve()).catch(() => {});
            sentryReport(`dropInstance dropDBPromise`, err);
            throw err;
          });
      });
    } else {
      promise = dbPromise.then((db) => {
        if (!db.objectStoreNames.contains(options.storeName)) {
          return;
        }
        const newVersion = db.version + 1;
        _deferReadiness(options);
        const dbContext = dbContexts[options.name];
        const { storages } = dbContext;
        db.close();
        for (let i = 0; i < storages.length; i++) {
          const storage = storages[i];
          storage._dbInfo.db = null;
          storage._dbInfo.version = newVersion;
        }
        const dropObjectPromise = new Promise((resolve, reject) => {
          const req = idbCore.open(options.name, newVersion);
          req.onerror = (err) => {
            const rDb = req.result;
            rDb.close();
            reject(err);
            sentryReport(`dropInstance reopen`, err);
          };
          req.onupgradeneeded = () => {
            const rDb = req.result;
            rDb.deleteObjectStore(options.storeName);
          };
          req.onsuccess = () => {
            const rDb = req.result;
            rDb.close();
            resolve(rDb);
          };
        });
        return dropObjectPromise
          .then((rDb) => {
            dbContext.db = rDb;
            for (let j = 0; j < storages.length; j++) {
              const storage = storages[j];
              storage._dbInfo.db = rDb;
              _advanceReadiness(storage._dbInfo);
            }
          })
          .catch((err) => {
            (_rejectReadiness(options, err) || Promise.resolve()).catch(() => {});

            sentryReport(`dropInstance reopen catch`, err);

            throw err;
          });
      });
    }
  }
  executeCallback(promise, callback);
  return promise;
}
const idbDriver = {
  _driver: 'idbDriver',
  _initStorage,
  _support: isIndexedDBValid(),
  iterate,
  getItem,
  setItem,
  removeItem,
  clear,
  keyLength,
  length,
  key,
  keys,
  dropInstance,
};
export default idbDriver;
