/*
 * @Owner: elliott.su@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { init, loadRemote, loadUtil, registerRemotes } from '../index';
import {
  loadRemoteModule,
  registerRemote,
  splitPackageName,
} from '../util';
import React from 'react';

// Mock the functions

jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  registerRemote: jest.fn(),
  loadRemoteModule: jest.fn(),
  splitPackageName: jest.fn(),
}));

describe('init', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call registerRemote for each remote', () => {
    const remotes = [{ name: 'remote1' }, { name: 'remote2' }];
    init({ name: 'test', remotes });
    expect(registerRemote).toHaveBeenCalledTimes(2);
    expect(registerRemote).toHaveBeenCalledWith(remotes[0]);
    expect(registerRemote).toHaveBeenCalledWith(remotes[1]);
  });
  test('should call registerRemote for each remote, remotes empty', () => {
    init({ name: 'test' });
    expect(registerRemote).not.toBeCalled();
  });
});

describe('registerRemotes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should call registerRemote for each remote', () => {
    const remotes = [{ name: 'remote1' }, { name: 'remote2' }];
    registerRemotes(remotes);
    expect(registerRemote).toHaveBeenCalledTimes(2);
    expect(registerRemote).toHaveBeenCalledWith(remotes[0]);
    expect(registerRemote).toHaveBeenCalledWith(remotes[1]);
  });
  test('should call registerRemote for each remote, remotes empty', () => {
    registerRemotes();
    expect(registerRemote).not.toBeCalled();
  });
});

describe('loadUtil', () => {
  test('should load and return the remote function', async () => {
    const remoteFunction = jest.fn();
    loadRemoteModule.mockImplementation(() =>
      Promise.resolve({ get: () => Promise.resolve(remoteFunction) }),
    );
    splitPackageName.mockImplementation(() => ['test', 'module']);
    const result = await loadUtil('test/module');
    expect(result).toBe(undefined);
  });
});

describe('loadRemote', () => {
  const remotePackage = 'trade-web/List';
  const LoadingComponent = () => <div>Loading...</div>;
  const ErrorComponent = () => <div>Error...</div>;
  const opts = { loading: LoadingComponent, error: ErrorComponent };

  beforeEach(() => {
    splitPackageName.mockReturnValue(['trade-web', 'List']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading component initially', () => {
    loadRemoteModule.mockReturnValue(new Promise(() => {})); // Never resolves

    const LoadRemoteComponent = loadRemote(remotePackage, opts);
    render(<LoadRemoteComponent />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  test('renders loading component initially, no opts', () => {
    loadRemoteModule.mockReturnValue(new Promise(() => {})); // Never resolves

    const LoadRemoteComponent = loadRemote(remotePackage);
    const { container } = render(<LoadRemoteComponent />);

    expect(container.firstChild).toBeNull();
  });

  test('renders error component on failure', async () => {
    loadRemoteModule.mockRejectedValue(new Error('Failed to load module'));

    const LoadRemoteComponent = loadRemote(remotePackage, opts);
    render(<LoadRemoteComponent />);

    await waitFor(() => expect(screen.getByText('Error...')).toBeInTheDocument());
  });
});
