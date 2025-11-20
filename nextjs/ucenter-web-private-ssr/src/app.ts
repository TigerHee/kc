import { kucoinv2Storage, sessionStorage } from 'gbiz-next/storage';
import SyncStorage from 'gbiz-next/syncStorage';

export interface IApp {
  defaultStorage?: SyncStorage;
  sessionStorage?: SyncStorage;
  initConfig: () => void;
}

export const app: IApp = {
  initConfig() {
    app.defaultStorage = kucoinv2Storage;
    app.sessionStorage = sessionStorage;
  },
};
