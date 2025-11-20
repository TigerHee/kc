/*
 * @Owner: elliott.su@kupotech.com
 */
import loadJson from '../loadJson';
import {
  loadRemoteModule,
  registerRemote,
  splitPackageName,
} from './util';
// Mock loadJson
jest.mock('./loadJson', () => jest.fn());
// Mock System
global.System = {
  addImportMap: jest.fn(),
  import: jest.fn(),
};

describe('util', () => {
  beforeEach(() => {
    window._FEDERATION_ = {};
    jest.clearAllMocks();
  });
  
  describe('registerRemote', () => {
    test('should register remote and preload if specified', () => {
      const name = 'testProject';
      const entry = 'http://example.com/entry.json';
      const preload = true;
      registerRemote({ name, entry, preload });
      expect(window._FEDERATION_[name]).toEqual({ entry });
      expect(loadJson).toHaveBeenCalledWith(entry);
    });

    test('should not register remote if already registered', () => {
      const name = 'testProject';
      const entry = 'http://example.com/entry.json';
      window._FEDERATION_[name] = {
        entry: entry,
      };
      registerRemote({ name, entry });
      expect(loadJson).not.toHaveBeenCalled();
    });
  });
  describe('loadRemoteModule', () => {
    test('should reject if module is not registered', async () => {
      await expect(loadRemoteModule('unregisteredModule')).rejects.toThrow('not register');
    });
    test('should load json and import module on success', async () => {
      const name = 'testProject';
      const entry = 'http://example.com/entry.json';
      const mockData = { imports: { testProject: 'http://example.com/remoteEntry.js' } };
      window._FEDERATION_[name] = {
        entry: entry,
      };
      loadJson.mockImplementation((url, callback) => callback(mockData));
      System.import.mockResolvedValueOnce('module');
      const result = await loadRemoteModule(name);
      expect(System.addImportMap).toHaveBeenCalledWith(mockData);
      expect(System.import).toHaveBeenCalledWith(name);
      expect(result).toBe('module');
    });

    test('should reject if json load fails', async () => {
      const name = 'testProject';
      const entry = 'http://example.com/entry.json';
      window._FEDERATION_[name] = {
        entry: entry,
      };
      loadJson.mockImplementation((url, callback) => callback(null));
      await expect(loadRemoteModule(name)).rejects.toThrow('map json url error');
    });
    test('should reject if module import fails', async () => {
      const name = 'testProject';
      const entry = 'http://example.com/entry.json';
      const mockData = { imports: { testProject: 'http://example.com/remoteEntry.js' } };
      window._FEDERATION_[name] = {
        entry: entry,
      };
      loadJson.mockImplementation((url, callback) => callback(mockData));
      System.import.mockRejectedValueOnce(new Error('import error'));
      await expect(loadRemoteModule(name)).rejects.toThrow('remote js url error');
    });
  });
  describe('splitPackageName', () => {
    test('should split package name correctly', () => {
      const remotePackage = 'trade-web/List';
      const result = splitPackageName(remotePackage);
      expect(result).toEqual(['trade-web', 'List']);
    });
  });
});
